# 浏览器自动化

启用浏览器能力后，Agent 可以打开网页、点击、输入、滚动、截图，并检查页面控制台、网络和页面错误。

AgentDock 支持 Google Chrome、Chromium 和 Microsoft Edge。默认情况下，浏览器自动化会启动由 AgentDock 管理的独立会话；高级用户也可以选择通过 CDP 附着已有 Chromium 系浏览器，但这是显式开启的另一种隔离边界。

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

直接描述任务即可：

```text
打开这个页面，检查是否能正常加载，并告诉我有没有控制台或网络错误。
登录后搜索指定内容，但提交表单前先让我确认。
把最终页面截图给我看。
```

Agent 应先观察页面，再执行动作，最后重新检查页面状态。

## 登录态、Profile 与已有 CDP 浏览器

AgentDock 自有浏览器需要保持登录时，使用专用 `profile_id`。Profile 会保存在 AgentDock 自己的浏览器数据目录中，后续会话可以继续复用；不要把自有会话指向日常浏览器主 Profile。

高级配置也可以附着已经运行的 Chromium 系浏览器。单次 session 传入的 `cdp_url` 只允许回环地址；命名或远程 CDP 地址必须由用户在 AgentDock 设置中配置。`AGENTDOCK_BROWSER_CDP_URL` 用来指定已配置地址，`AGENTDOCK_BROWSER_REUSE_EXISTING_CDP=true` 则让 AgentDock 尝试复用唯一检测到的本地 CDP 浏览器。

通过 CDP 附着时，AgentDock 会在外部浏览器中创建并管理独立 target，关闭 AgentDock session 不会退出外部浏览器。外部 CDP session 不能使用 AgentDock 持久 `profile_id`、Cookie 注入或 localStorage 注入。外部浏览器可能还包含其他登录态，因此只应附着你明确用于自动化的浏览器实例。

首次登录仍可能需要你手动完成验证码、扫码或安全确认。不要让 Agent 在聊天或日志中回显密码、Cookie 或 Authorization Header。

## 安全边界

- 上传文件、发送消息、提交表单、删除内容和授权前要确认目标与副作用。
- 优先使用 AgentDock 自有专用 Profile；如果显式使用 CDP 附着，只暴露专门用于自动化的浏览器实例。
- 只给自动化访问任务需要的网站和文件。
- 不再需要登录态时，及时清理持久 Profile。

浏览器工具边界见 [工具介绍](../reference/tools.md#浏览器自动化)，宿主机配置见 [配置参考](../reference/configuration.md#浏览器工具)。
