# macOS 进阶配置

推荐通过 [macOS 图形应用](../getting-started/macos.md)安装和管理 AgentDock。本页用于命令行安装、指定版本、自定义目录、管理文件、服务检查和卸载。

## 优先使用图形应用

主窗口已经提供状态、连接地址、凭据、启动、停止、重启、核心更新和日志入口。“高级设置”可以管理端口、日志级别、NexusDock 接入、浏览器工具，以及两个互不影响的登录自启开关。

图形应用已经提供的设置不要再手工编辑 `agentdock.env` 或 LaunchAgent。应用会校验输入、以私有权限原子写入配置、重启并执行健康检查；新配置无法启动时会自动恢复旧配置。

## 命令行安装

自动化或自定义目录时仍可使用命令行安装器：

```bash
curl -fL https://github.com/uvwt/agentdock/releases/latest/download/install.sh \
  -o /tmp/agentdock-install.sh
sh /tmp/agentdock-install.sh --register-service
```

## 把 AgentDock 加入 PATH

安装器默认把二进制放到 `~/.local/bin`。希望直接执行 `agentdock` 时：

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile
```

随后可以直接运行：

```bash
agentdock
```

## 安装指定版本

```bash
sh /tmp/agentdock-install.sh --register-service --version vX.Y.Z
```

## 修改安装目录

```bash
sh /tmp/agentdock-install.sh --register-service --install-dir "$HOME/bin"
```

修改目录后要确保该目录已经加入 PATH，或始终使用完整路径启动。

## 后台运行

图形应用会自动安装当前用户的 LaunchAgent。“高级设置”中的“登录后自动启动 AgentDock 服务”控制核心服务，“登录后显示 AgentDock 菜单栏”只控制菜单栏应用；关闭其中一个不会修改另一个。

手工配置时，应使用当前登录用户的 LaunchAgent。涉及 Desktop Skill 时，AgentDock 必须运行在登录用户会话中，不能使用系统级 LaunchDaemon。

推荐固定以下内容：

```text
程序路径    $HOME/.local/bin/agentdock
工作目录    $HOME/AgentDock
状态目录    $HOME/.agentdock
监听地址    127.0.0.1:8765
```

启动配置中的 Token、OAuth Secret 或第三方凭据不应直接写入公开仓库。修改 LaunchAgent 后使用 `launchctl` 重新加载，并执行健康检查：

```bash
curl -fsS http://127.0.0.1:8765/healthz
```

## 管理 Cloudflare Tunnel

在图形应用中可自由切换仅本机、临时公网和固定域名。固定域名会复用已有 Tunnel Token，修改其他设置时不需要再次粘贴。

命令行安装器在使用 `--register-service` 且没有显式指定 Tunnel 时，只询问是否有已接入 Cloudflare 的域名。内部实现中，有域名对应 Named Tunnel，没有域名对应临时 Quick Tunnel。自动化仍可直接传入 `--tunnel quick`、`--tunnel named` 或 `--tunnel none`。

两种公网模式都会自动创建或复用 Bearer Token、OAuth 登录密码和 OAuth 签名密钥。临时安装会先用 Bearer 认证启动 AgentDock，取得生成的 `trycloudflare.com` 地址后写入 `AGENTDOCK_SERVER_URL`、启用 OAuth，再重启 AgentDock。完成框会显示公网地址、MCP 地址、Bearer Token 和 OAuth 登录密码；签名密钥保持私密。

安装器会把 AgentDock 与 `cloudflared` 注册为两个独立的用户级 LaunchAgent，只有 `cloudflared` 会读取 Named Tunnel Token。管理文件：

```text
~/Library/Application Support/AgentDock/agentdock.env
~/Library/Application Support/AgentDock/cloudflared.env
~/Library/Application Support/AgentDock/start-cloudflared.sh
~/Library/LaunchAgents/com.uvwt.agentdock.cloudflared.plist
~/Library/Logs/AgentDock/cloudflared.out.log
~/Library/Logs/AgentDock/cloudflared.err.log
```

`agentdock.env` 与 `cloudflared.env` 权限均为 `0600`。AgentDock LaunchAgent 不会加载 Tunnel Token，Token 也不会写入 `ProgramArguments`。

查看服务和日志：

```bash
launchctl print "gui/$(id -u)/com.uvwt.agentdock.cloudflared"
tail -f "$HOME/Library/Logs/AgentDock/cloudflared.err.log"
```

临时地址变化后，重新运行同一个安装命令即可。安装器会保留 Bearer Token、OAuth 密码和签名密钥，写入新地址并重启 AgentDock。随后在客户端替换 MCP URL，并重新完成 OAuth 授权。固定模式后续重跑会复用已有公网地址与 Tunnel Token。

## 浏览器自动化

启用浏览器工具时，macOS 图形应用会确认本机已经安装 Google Chrome、Chromium 或 Microsoft Edge。浏览器本身按正常方式安装和更新即可。

## 目录与权限

```text
~/.agentdock  AgentDock 内部状态
~/AgentDock   默认工作目录
```

裸机进程能访问哪些文件，取决于当前 macOS 用户权限。不要给 AgentDock 运行用户授予不需要的目录访问权。

## Desktop Skill 权限

使用屏幕、键盘和鼠标自动化前，需要在“系统设置 → 隐私与安全性”中给实际托管 AgentDock 的终端或应用授予：

- 辅助功能
- 屏幕与系统音频录制

只给实际运行 AgentDock 的程序授权。更换终端、应用路径或代码签名后，macOS 可能要求重新授权。

具体步骤见 [macOS 桌面自动化](../guides/desktop-automation.md)。

## 更新与备份

重新运行安装脚本即可升级。旧二进制会备份到：

```text
~/.agentdock/backups/bin
```

运行数据和默认工作目录不会被删除。

## 卸载 AgentDock

删除应用前，先在“高级设置”中关闭“登录后显示 AgentDock 菜单栏”，应用更改后退出 AgentDock。

下载并运行官方卸载脚本：

```bash
curl -fL https://github.com/uvwt/agentdock/releases/latest/download/uninstall-macos.sh \
  -o /tmp/uninstall-agentdock.sh
zsh /tmp/uninstall-agentdock.sh
```

默认命令会删除后台服务、支持文件和日志，但保留二进制、`~/.agentdock` 与 `~/AgentDock`。

需要同时删除安装的二进制时使用 `--remove-binary`。只有明确要删除二进制、全部 AgentDock 状态、浏览器支持和默认工作目录时，才使用 `--purge-data`。

最后把“应用程序”中的 `AgentDock.app` 移到废纸篓。
