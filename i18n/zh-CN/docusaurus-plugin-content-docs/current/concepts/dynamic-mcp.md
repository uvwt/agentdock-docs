# 使用外部MCP

动态 MCP 让 AgentDock 在不重启的情况下使用其他 MCP 服务提供的工具。需要接入外部服务或本机 MCP 程序时使用它。

## 最简单的使用方式

直接告诉 Agent 要连接什么：

```text
接入这个 MCP：https://mcp.example.com/mcp
名称使用 example，并验证它的工具是否可用。
```

AgentDock 会注册连接、判断需要哪种认证，并可以通过一次只读工具调用确认是否接入成功。

## HTTP MCP

服务已经提供网络地址时使用 HTTP，例如：

```text
https://mcp.example.com/mcp
```

### 使用 OAuth 浏览器登录

如果远程 MCP 需要 OAuth，直接让 Agent 授权即可。AgentDock 会启动授权流程并返回登录链接，你在浏览器中完成登录后，MCP 连接即可刷新并使用已授权的服务。

不需要把 OAuth Code 或 Access Token 复制到聊天中。需要重新登录或解除账号授权时，也可以清除现有授权。

### 使用 API 密钥

如果服务不是通过浏览器登录，而是提供 API Token 或密钥，把它保存在这个 MCP 连接自己的独立环境中。AgentDock 不会把真实密钥写进连接记录，也不会在查看配置时把它显示出来。

## 本机 MCP 程序

AgentDock 也可以启动安装在同一台机器上的命令行 MCP 服务。提供可执行文件、必要的启动参数和环境变量即可。

本机 MCP 程序会继承 AgentDock 的系统权限，因此陌生软件使用前要先审查来源。

## 凭据怎么保存

不要把 Token、Cookie、密码或 OAuth Code 写进聊天记录、README 或 MCP 注册信息。

- OAuth 使用 AgentDock 自带的授权流程。
- Token 类认证使用 MCP 连接的独立环境。
- 查看配置时只显示秘密的变量名和配置状态，不回显真实值。

## 如何确认接入成功

可以要求 Agent：

```text
列出 example MCP 的工具，检查一个只读工具的参数，并完成一次无副作用调用。
```

如果失败，检查连接是否启用、地址或命令是否正确、认证是否完成，以及上游服务是否可达。

## 管理已有 MCP

可以让 AgentDock 查看、启用、禁用、刷新、重新授权或删除连接；需要时也可以管理它的独立环境。

完整操作和参数见 [工具参考](../reference/tools.md)。
