# macOS 安装

AgentDock 为 Apple Silicon 和 Intel Mac 提供预编译版本。普通安装不需要 Go、Git 或源码。

原生安装适合使用本机文件，以及需要屏幕录制和辅助功能权限的 macOS 桌面自动化。

## 1. 安装 AgentDock

```bash
curl -fL https://github.com/uvwt/agentdock/releases/latest/download/install-macos.sh \
  -o /tmp/install-agentdock-macos.sh
zsh /tmp/install-agentdock-macos.sh
```

脚本会识别当前 Mac 架构、校验下载文件，并安装到：

```text
~/.local/bin/agentdock
```

如果脚本提示 PATH 尚未包含该目录，执行：

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zprofile
export PATH="$HOME/.local/bin:$PATH"
```

## 2. 启动

```bash
agentdock --host 127.0.0.1 --port 8765
```

保持这个终端窗口运行。第一次体验时不需要先配置后台服务。

## 3. 确认启动成功

另开一个终端执行：

```bash
curl -fsS http://127.0.0.1:8765/healthz
```

正常结果中会包含 `ok: true`。

## 4. 连接 MCP 客户端

在同一台 Mac 上使用时填写：

```text
传输方式    Streamable HTTP
地址        http://127.0.0.1:8765/mcp
认证        不需要
```

只监听 `127.0.0.1` 时可以无认证运行。需要局域网或公网访问时，必须启用认证并使用 HTTPS。

:::tip
**安装完成：** 健康检查通过并在客户端连接成功后，就可以开始使用文件、命令、Git 和 Skill。
:::

## 更新

重新下载并运行最新安装脚本即可。任务、Skill、配置和工作目录不会被删除，旧二进制会先备份。

## 按需继续

- 指定版本、修改安装目录或配置后台运行：阅读 [macOS 进阶配置](../operations/macos.md)。
- 使用屏幕、键盘和鼠标自动化：阅读 [macOS 桌面自动化](../guides/desktop-automation.md)。
- 使用浏览器自动化：当前免构建方案是 Docker browser 镜像，见 [浏览器自动化](../guides/browser-control.md)。
- 启动失败：查看 [故障排查](../operations/troubleshooting.md)。
