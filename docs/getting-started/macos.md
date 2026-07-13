# macOS 源码运行

AgentDock 可以在 macOS 当前登录用户下直接运行。裸机模式可以使用浏览器自动化，并在授予屏幕录制和辅助功能权限后使用 macOS Desktop Skill。

## 前置条件

- `go.mod` 声明版本的 Go
- Git
- 需要浏览器自动化时安装 Google Chrome

## 构建

```bash
git clone https://github.com/uvwt/agentdock.git
cd agentdock
make check
```

`make check` 会格式化、测试、vet 并生成 `bin/agentdock`。

## 前台运行

```bash
./bin/agentdock --host 127.0.0.1 --port 8765
```

健康检查：

```bash
curl -fsS http://127.0.0.1:8765/healthz
```

本机回环监听可以无认证运行。需要监听局域网地址或通过反代公开时，必须配置 Bearer Token 或 OAuth，并使用 HTTPS。

## 目录与权限

```text
~/.agentdock  AgentDock 内部状态
~/AgentDock   默认工作目录
```

裸机进程能访问哪些文件，取决于当前 macOS 用户权限。开启桌面自动化前，应只给实际运行 AgentDock 的应用或终端授予必要的屏幕录制和辅助功能权限。

## 长期运行

长期后台运行可以自行创建 LaunchAgent，固定二进制路径、工作目录和环境变量。升级时保持稳定的二进制路径和代码签名身份，避免 macOS 将其识别为新的应用而丢失隐私权限。

桌面能力见 [macOS Desktop Skill](../guides/desktop-automation.md)。
