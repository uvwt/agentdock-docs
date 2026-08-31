# 连接外部 MCP

动态 MCP 让 AgentDock 在不重启或重新编译的情况下连接其他 MCP Server，例如设计平台、任务系统、搜索服务或本地分析工具。


## 最简单的使用方式

可以直接告诉 Agent：

```text
接入这个 MCP：https://mcp.example.com/mcp
名称使用 example，认证 Token 放到独立环境里，接入后验证能否列出工具。
```

Agent 会完成注册、凭据保存、连接刷新，并用一次只读调用验证接入结果。

## 两种连接方式

### HTTP MCP

适合已经提供网络地址的服务：

```text
https://mcp.example.com/mcp
```

认证信息通过独立环境映射到 HTTP Header。注册信息只保存变量名，不保存真实 Token。

### 本地 stdio MCP

适合安装在同一台机器上的命令行 MCP Server。需要提供：

- 可执行文件的绝对路径。
- 启动参数。
- 可选工作目录。
- 运行所需环境变量。

本地 MCP 会继承运行 AgentDock 的系统权限，因此安装前同样要审查来源。

## 凭据怎么保存

不要把 Token、Cookie、密码或 OAuth Code 直接写进聊天记录、README 或 MCP 注册信息。

让 Agent 把秘密保存在该 MCP Server 的独立环境中。查看配置时只显示变量名和配置状态，不返回真实值。

更新凭据后需要刷新 MCP 连接。

## 如何确认接入成功

可以要求 Agent：

```text
列出 example MCP 的工具，选择一个只读工具确认参数，并完成一次无副作用调用。
```

如果失败，依次检查服务是否启用、地址或命令是否正确、所需变量是否已配置，以及上游服务是否可达。

## 管理已有 MCP

常用操作包括：

- 查看和检查配置。
- 启用、禁用或刷新连接。
- 更新或删除独立环境变量。
- 删除不再使用的 Server。

精确 action 和参数见 [工具介绍](../reference/tools.md#动态-mcp)。
