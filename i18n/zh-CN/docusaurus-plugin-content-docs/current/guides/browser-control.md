# 使用浏览器

启用浏览器能力后，Agent 可以打开网页、点击、输入、滚动、截图，并检查页面控制台、网络和页面错误。

AgentDock 支持 Google Chrome、Chromium 和 Microsoft Edge。浏览器自动化默认使用由 AgentDock 管理的独立浏览器会话。

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
2. 按 [Docker 进阶配置](../operations/docker.md) 启动 browser 镜像。
3. 连接客户端后，确认 Agent 可以看到 `browser_*` 工具。

## 直接提出任务

直接描述任务即可：

```text
打开这个页面，检查是否能正常加载，并告诉我有没有控制台或网络错误。
登录后搜索指定内容，但提交表单前先让我确认。
把最终页面截图给我看。
```

浏览器自动化会保留操作前后的可观察页面状态，便于确认最终结果，而不是只根据操作是否发出进行判断。

## 登录状态

AgentDock 默认使用自己的独立浏览器环境，不会和你日常上网使用的浏览器混在一起。

如果希望网站保持登录，AgentDock 可以保存这份浏览器登录状态，后续会话继续使用。部分网站第一次登录时，仍可能需要你手动完成验证码、扫码或 2FA。

如果宿主机上已经有可使用的CDP浏览器，也可以在设置中选择优先复用它，这样可以继续使用其中已有的登录状态。找不到可复用的浏览器时，AgentDock 会自动使用自己的独立浏览器。具体设置见 [配置参考](../reference/configuration.md)。

不要把密码、Cookie 或其他登录凭据发到聊天或日志中。

## 安全边界

- 上传文件、发送消息、提交表单、删除内容和授权前要确认目标与副作用。
- 浏览器自动化和日常上网环境保持分开。
- 只给自动化访问任务需要的网站和文件。
- 不再需要保持登录时，可以清理保存的浏览器登录状态。

浏览器工具边界见 [工具参考](../reference/tools.md)，宿主机配置见 [配置参考](../reference/configuration.md)。
