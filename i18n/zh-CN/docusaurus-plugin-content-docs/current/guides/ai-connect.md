# 让 AI 帮你连接 NexusDock

复制下面这段话，发送给你正在使用的 AI 助手。如果它支持管理原生 MCP 连接，就可以按照指南完成配置、发起 OAuth 授权并检查连接结果。

:::info[本页主要面向 AI 助手]
如果你准备自己手动配置 NexusDock，请查看 [在不同客户端中连接](./mcp-clients.md)。本页内容主要供 AI 助手阅读并代你执行接入步骤。
:::

## 复制这段话发给 AI

登录或授权确认可能需要你本人操作。其他具有操作权限的步骤，应由 AI 尽可能自行完成。

```text
请阅读 https://docs.nexusdock.co/zh-CN/docs/guides/ai-connect，按照官方指南帮我接入 NexusDock。尽可能自动完成，只有必须由我确认时再让我操作。
```

## 给 AI 助手的接入步骤

仅在用户明确要求接入 NexusDock 时执行以下操作。必须使用当前客户端提供的原生 MCP 集成和已授权配置能力，不能用模拟调用代替真正接入。

### 1. 先安装 NexusDock Skill（如支持）

在配置 MCP 之前，先检查当前 AI 客户端是否支持原生 Skill 安装。读取官方 [`SKILL.md`](https://www.nexusdock.co/skills/nexusdock/SKILL.md)，检查内容，按平台要求取得确认后安装到当前 AI 客户端，并验证出现在 Skill 列表中。不要用安装到远程 AgentDock 设备代替客户端安装。不支持 Skill 时跳过这一步，继续配置 MCP。

### 2. 确认 MCP 支持与配置方式

先判断当前 AI 客户端本身是否支持注册远程 Streamable HTTP MCP。

- 若客户端支持 MCP，但你无法在当前对话中修改 MCP 或连接器设置，不要把它判断为“不支持”。
- 应识别当前客户端，并从可靠的最新文档或客户端自身设置界面中检索它当前的原生 MCP / 连接器接入方式，然后一步步指导用户完成：在哪里打开设置、选择哪种连接类型、在哪里填写 NexusDock 地址，以及什么时候需要确认 OAuth 授权。
- 不要凭记忆编造已经过期的菜单名称或步骤。
- 用户配置完成后，再继续验证 NexusDock 工具是否真正注册成功。
- 只有客户端本身确实不具备 MCP 能力时，才说明不支持。严禁改用脚本、代理、命令行或临时 HTTP 请求冒充原生接入。

### 3. 注册官方 MCP 地址

在客户端原生 MCP 或连接器设置中，将以下官方地址注册为 NexusDock 远程 MCP 连接：

```text
https://mcp.nexusdock.co/mcp
```

不要用无关的本地桥接器或自定义脚本代替。

### 4. 使用 OAuth 并让用户确认授权

选择客户端提供的 OAuth 授权流程，并通过客户端打开官方登录与授权页面。密码、验证码和授权确认必须由用户本人处理；不要在聊天中索取访问令牌、密码或验证码，也不要悄悄改用手动令牌。

### 5. 确认工具已注册并真实调用

确认 NexusDock 工具确实出现在当前 AI 客户端的原生工具列表中。获得权限后，通过已注册的 MCP 连接调用 `agentdock_context` 验证连接。单纯请求接口成功或脚本能调用，不代表原生接入成功。

## 官方 NexusDock Skill

Skill 帮助兼容的 AI 助手在用户询问在线设备、操作本机或使用其他设备时识别需求，并选择对应的 NexusDock MCP 工具。Skill 本身不会授予设备权限。

- [查看 Skill 原文（`SKILL.md`）](https://www.nexusdock.co/skills/nexusdock/SKILL.md)
- [下载 Skill ZIP](https://www.nexusdock.co/skills/nexusdock.zip)

是否能安装和自动选用 Skill 取决于各 AI 客户端的支持情况。MCP 连接及 OAuth 授权仍须单独完成；线上提供 Skill 并不代表所有 AI 产品都会自动加载。

## 如果 AI 无法自动完成接入

有些客户端本身支持 MCP，但客户端里的 AI 无法直接修改连接设置。这属于配置权限限制，不代表客户端不兼容 MCP。此时 AI 应先识别当前客户端，检索它最新的原生 MCP 接入方式，再一步步指导用户完成配置；用户完成后，AI 继续验证 NexusDock 工具是否已注册。

只有客户端本身确实不支持远程 MCP 时，才应明确说明不支持，而不是编造替代方案。

- [查看人工接入教程](./mcp-clients.md)
- [使用 ChatGPT 连接](./chatgpt.md)
- [连接问题排查](../operations/troubleshooting.md)
