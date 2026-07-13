# 动态 MCP

AgentDock 把外部 MCP Server 与内置工具分开管理。远端工具不会直接混入 AgentDock 的固定工具列表，而是通过搜索、检查和调用三个步骤按需使用，避免客户端因工具列表频繁变化而失效。

## 调用流程

```text
agentdock_context
→ mcp_tool_search
→ mcp_tool_inspect
→ mcp_tool_call
```

- `mcp_manage`：注册、启用、禁用、刷新、删除 Server，并管理独立环境。
- `mcp_tool_search`：搜索轻量工具摘要。
- `mcp_tool_inspect`：读取 `<server>:<tool>` 的完整输入 Schema。
- `mcp_tool_call`：校验参数并调用上游工具。

## 注册 HTTP MCP

```json
{
  "action": "add",
  "name": "figma",
  "description": "访问 Figma 设计文件和节点。",
  "transport": "streamable_http",
  "url": "https://mcp.example.com/mcp",
  "header_env": {
    "Authorization": "FIGMA_MCP_AUTHORIZATION"
  },
  "enabled": true
}
```

`header_env` 的键是 HTTP Header 名，值是环境变量名。注册信息不会保存 Token 本身。

把秘密写入该 MCP 的独立环境：

```json
{
  "action": "env_set",
  "name": "figma",
  "key": "FIGMA_MCP_AUTHORIZATION",
  "value": "Bearer ..."
}
```

更新环境后执行 `refresh`，使当前连接重新读取配置。

## 注册 stdio MCP

```json
{
  "action": "add",
  "name": "local-analyzer",
  "description": "提供本地代码分析工具。",
  "transport": "stdio",
  "command": "/absolute/path/to/mcp-server",
  "args": ["--stdio"],
  "cwd": "/absolute/working/directory",
  "env_from_env": {
    "SERVICE_TOKEN": "LOCAL_ANALYZER_TOKEN"
  },
  "enabled": true
}
```

`env_from_env` 的键是子进程变量名，值是 AgentDock 宿主进程中的环境变量名。它适合复用已经由服务管理器注入的环境；不要在注册信息中写入真实秘密。

更推荐使用 MCP 独立环境直接配置子进程变量，并省略 `env_from_env`：

```json
{
  "action": "env_set",
  "name": "local-analyzer",
  "key": "SERVICE_TOKEN",
  "value": "..."
}
```

stdio Server 会作为持久子进程运行；禁用、刷新、删除或 AgentDock 退出时会回收进程树。更新独立环境后执行 `refresh`。

## 发现和调用

搜索：

```json
{
  "server": "figma",
  "query": "screenshot",
  "limit": 10
}
```

检查：

```json
{
  "name": "figma:get_screenshot"
}
```

调用：

```json
{
  "name": "figma:get_screenshot",
  "arguments": {
    "file_key": "...",
    "node_id": "1:2"
  }
}
```

AgentDock 会先按发现到的 Schema 做结构校验，上游 MCP Server 仍负责最终业务校验。

## 管理与安全

常用动作：

```text
list
inspect
add
enable
disable
refresh
remove
env_set
env_unset
env_list
```

`env_list` 只返回变量名和是否已配置，不返回秘密值。不要把 Token、Cookie、OAuth Code 或密码直接写入 MCP 注册信息、README 或日志。
