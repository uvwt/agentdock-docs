# macOS 安装

AgentDock 为 Apple Silicon 和 Intel Mac 发布预编译二进制。普通安装不需要 Go、Git 或源码。

裸机模式可以使用浏览器自动化，并在授予屏幕录制和辅助功能权限后使用 macOS Desktop Skill。

## 安装

```bash
curl -fL https://github.com/uvwt/agentdock/releases/latest/download/install-macos.sh \
  -o /tmp/install-agentdock-macos.sh
zsh /tmp/install-agentdock-macos.sh
```

安装脚本会：

1. 识别 `arm64` 或 `amd64`。
2. 下载对应的 GitHub Release 压缩包和 SHA-256 校验文件。
3. 安装到 `~/.local/bin/agentdock`。
4. 创建 `~/.agentdock` 和 `~/AgentDock`。
5. 升级时把旧二进制备份到 `~/.agentdock/backups/bin`。

首次安装后，如 `~/.local/bin` 尚未加入 PATH：

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zprofile
export PATH="$HOME/.local/bin:$PATH"
```

## 前台运行

```bash
agentdock --host 127.0.0.1 --port 8765
```

健康检查：

```bash
curl -fsS http://127.0.0.1:8765/healthz
```

本机回环监听可以无认证运行。需要监听局域网地址或通过反代公开时，必须配置 Bearer Token 或 OAuth，并使用 HTTPS。

## 安装指定版本

```bash
zsh /tmp/install-agentdock-macos.sh --version vX.Y.Z
```

也可以更改安装目录：

```bash
zsh /tmp/install-agentdock-macos.sh --install-dir "$HOME/bin"
```

## 更新

重新下载并运行最新安装脚本即可。运行数据和工作目录不会被删除，旧二进制会先备份。

## 目录与权限

```text
~/.agentdock  AgentDock 内部状态
~/AgentDock   默认工作目录
```

裸机进程能访问哪些文件，取决于当前 macOS 用户权限。开启桌面自动化前，应只给实际运行 AgentDock 的终端或托管应用授予必要的屏幕录制和辅助功能权限。

长期后台运行可以使用 LaunchAgent，固定二进制路径、工作目录和环境变量。涉及 Desktop Skill 时，AgentDock 必须运行在当前登录用户会话中，不能放到系统级 LaunchDaemon。

桌面能力见 [macOS Desktop Skill](../guides/desktop-automation.md)。源码构建只面向贡献者，见 [开发与质量门禁](../contributing/development.md)。
