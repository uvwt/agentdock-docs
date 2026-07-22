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
