# 浏览器自动化

启用浏览器能力后，Agent 可以打开网页、点击、输入、滚动、截图，并检查页面控制台、网络和页面错误。

AgentDock 的浏览器工具使用 Go 原生 CDP 运行时，并启动独立的 Chrome、Chromium 或 Microsoft Edge 进程。浏览器自动化**不需要** Node.js、Playwright 或额外的 Browser Runner。

## 开始前

### macOS 图形应用

1. 安装 Google Chrome、Chromium 或 Microsoft Edge。
2. 完成 [macOS 安装](../getting-started/macos.md)。
3. 打开“高级设置”。
4. 勾选“启用浏览器工具”。
5. 点击“应用并重启”。

应用会在保存前检查本机是否已经安装受支持的浏览器；AgentDock 不会替你下载浏览器。

### Windows 图形应用

先安装 Chrome、Chromium 或 Microsoft Edge，再在 AgentDock 控制面板中启用浏览器工具并保存配置。AgentDock 会自动检测已经安装的受支持浏览器。

### Linux 或其他原生部署

在宿主机安装 Chrome、Chromium 或 Microsoft Edge，然后通过 `AGENTDOCK_BROWSER_ENABLED=true` 或 `--browser-enabled` 启用浏览器工具。自动检测不到浏览器时，可以用 `AGENTDOCK_BROWSER_EXECUTABLE_PATH` 指定浏览器可执行文件的绝对路径。

### Docker

如果希望容器直接包含 Chromium，使用 browser 镜像：

1. 完成 [Docker 安装](../getting-started/docker.md)。
2. 按 [Docker 进阶配置](../operations/docker.md#启用浏览器自动化) 启动 browser 镜像。
3. 连接客户端后，确认 Agent 可以看到 `browser_*` 工具。

## 直接提出任务

普通用户不需要手工调用浏览器工具，可以直接说：

```text
打开这个页面，检查是否能正常加载，并告诉我有没有控制台或网络错误。
登录后搜索指定内容，但提交表单前先让我确认。
把最终页面截图给我看。
```

Agent 应先观察页面，再执行动作，最后重新检查页面状态。

## 多标签页与稳定等待

网页打开新标签页或弹窗后，浏览器工具会返回当前 `page_id` 和 `pages` 列表。Agent 应选择目标页面继续操作，不要默认所有动作仍发生在第一个页面。

页面加载较慢时，优先等待可验证条件，而不是固定睡眠时间：

- 等待 URL 变化。
- 等待指定文本或元素出现。
- 等待匹配的网络响应和状态码。

这样比盲目等待几秒更稳定，也更容易判断失败原因。

## 登录态与 Profile

需要保持登录时，使用 AgentDock 自己的浏览器 Profile。指定 `profile_id` 后，Profile 会保存在 AgentDock 的浏览器数据目录中，后续会话可以继续复用登录态。

不要把 AgentDock 指向日常浏览器主 Profile。当前浏览器工具只管理 AgentDock 自己启动的浏览器，不会通过外部 CDP 调试端口接管已经打开的个人浏览器。

首次登录仍可能需要你手动完成验证码、扫码或安全确认。不要让 Agent 在聊天或日志中回显密码、Cookie 或 Authorization Header。

## 截图与故障判断

截图只能证明视觉状态。判断页面是否真正正常时，还应检查：

- 最终 URL 和页面文本。
- `console_errors`。
- `network_errors`。
- `page_errors`。

## 安全边界

- 上传文件、发送消息、提交表单、删除内容和授权前要确认目标与副作用。
- 使用 AgentDock 专用 Profile，不要复用日常浏览器主 Profile。
- 只给自动化访问任务需要的网站和文件。
- 不再需要登录态时，及时清理持久 Profile。

浏览器工具边界见 [工具介绍](../reference/tools.md#浏览器自动化)，宿主机配置见 [配置参考](../reference/configuration.md#浏览器工具)。
