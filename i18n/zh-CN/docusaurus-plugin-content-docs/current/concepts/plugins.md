# 使用 Plugin

Plugin 用来把一组相关的 AgentDock 扩展打包在一起，方便统一审查和管理。一个 Plugin 可以包含 Skill、MCP Server 配置，或者同时包含两者。这些组件仍然使用 AgentDock 现有的 Skill 和动态 MCP 机制，Plugin 不会另外建立一套执行层。

这里的 **Plugin** 指 AgentDock 扩展包，不是 ChatGPT 等 AI 客户端中用来连接 AgentDock 的“插件”“连接器”或 MCP 入口。

## 什么时候使用 Plugin

当多个相关扩展需要一起安装和更新时，适合使用 Plugin。只需要一套任务说明时使用 [Skill](./skills.md)；只需要连接一个 MCP 服务时使用 [动态 MCP](./dynamic-mcp.md)。

AgentDock 可以识别自己的 Portable Plugin 格式，以及受支持的 OpenAI / Claude Plugin 包。Git、GitHub 等远程来源会先通过内置的 `plugin-import` Skill 下载到本地，再交给 AgentDock 审查。

## 安装 Plugin

直接描述目标，并要求先审查：

```text
审查并安装这个 Plugin。安装前先告诉我它会增加哪些 Skill 和 MCP 连接。
```

AgentDock 会先校验 Plugin，再安装已经审查过的那一份内容。只要包内容发生变化，就需要重新审查。

安装后的 Plugin 可以查看、更新、启用、禁用或删除。禁用只会停止其中组件生效，不会卸载 Plugin；删除时可以选择保留数据，也可以明确清理 Plugin 自己的数据和 MCP 凭据。

## 安全注意事项

- 陌生 Plugin 安装或更新前先审查。
- 不要把 Token、Cookie、密码等秘密写进 Plugin 包。
- Plugin 中的 MCP Server 与直接配置的 MCP Server 具有相同的信任边界。
- Plugin 不能突破 AgentDock 的操作系统权限、容器挂载或其他宿主边界。

完整的管理操作和参数见 [工具参考](../reference/tools.md)。
