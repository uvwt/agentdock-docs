# 浏览器自动化

启用浏览器能力后，Agent 可以打开网页、点击、输入、滚动、截图，并检查页面控制台和网络错误。

## 开始前

### 推荐：Docker browser 镜像

当前面向普通用户的完整免构建方案是 Docker browser 镜像。它已经包含 Chromium、browser runner 和所需 Node.js 依赖：

1. 先完成 [Docker 安装](../getting-started/docker.md)。
2. 按 [Docker 进阶配置](../operations/docker.md#启用浏览器自动化) 启动 browser 镜像。
3. 连接客户端后，确认 Agent 可以看到 `browser_*` 工具。

### 原生 macOS / Windows

macOS 和 Windows Release 当前只安装 AgentDock 二进制，不会自动安装 browser runner。原生模式需要另外准备 Node.js、源码仓库中的 runner 及 `playwright-core`，属于进阶或开发者配置。

只想直接使用浏览器自动化时，不要在原生安装后盲目打开浏览器开关，优先使用 Docker browser 镜像。原生 runner 的配置项见 [配置参考](../reference/configuration.md#浏览器工具)。

## 直接提出任务

普通用户不需要手工调用浏览器工具，可以直接说：

```text
打开这个页面，检查是否能正常加载，并告诉我有没有控制台或网络错误。
登录后搜索指定内容，但提交表单前先让我确认。
把最终页面截图给我看。
```

Agent 应先观察页面，再执行动作，最后重新检查页面状态。

## 登录态与 Profile

需要保持登录时，使用 AgentDock 专用的独立浏览器 Profile。不要直接复用日常浏览器主 Profile，避免自动化访问不必要的账号或污染个人数据。

首次登录通常需要你手动完成验证码、扫码或安全确认。不要让 Agent 在聊天或日志中回显密码、Cookie 或 Authorization Header。

## 连接已经打开的浏览器

高级用户可以通过 CDP 连接一个已开启调试端口的浏览器。调试端口必须只监听 `127.0.0.1`；公开 CDP 端口相当于向外部开放完整浏览器控制权限。

## 截图与故障判断

截图只能证明视觉状态。判断页面是否真正正常时，还应检查：

- 最终 URL 和页面文本。
- `console_errors`。
- `network_errors`。
- `page_errors`。

## 安全边界

- 上传文件、发送消息、提交表单、删除内容和授权前要确认目标与副作用。
- 使用独立 Profile，不挂载日常浏览器完整用户目录。
- 只给自动化访问任务需要的网站和文件。
- 用完持久会话后，根据需要保存或清理登录态。

精确工具参数见 [工具介绍](../reference/tools.md#浏览器自动化)。
