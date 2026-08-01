# macOS 进阶配置

普通用户首次安装只需要完成 [macOS 安装](../getting-started/macos.md)。本页用于固定版本、修改安装目录、后台运行和桌面权限配置。

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
zsh /tmp/install-agentdock-macos.sh --version vX.Y.Z
```

## 修改安装目录

```bash
zsh /tmp/install-agentdock-macos.sh --install-dir "$HOME/bin"
```

修改目录后要确保该目录已经加入 PATH，或始终使用完整路径启动。

## 后台运行

长期后台运行可以使用当前登录用户的 LaunchAgent。涉及 Desktop Skill 时，AgentDock 必须运行在登录用户会话中，不能使用系统级 LaunchDaemon。

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

使用 `--register-service` 且没有显式指定 Tunnel 时，安装器只询问是否有已接入 Cloudflare 的域名。有域名进入固定 Named Tunnel，没有域名进入临时 Quick Tunnel。自动化仍可直接传入 `--tunnel quick`、`--tunnel named` 或 `--tunnel none` 作为高级覆盖。

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
