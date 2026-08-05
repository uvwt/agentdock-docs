# 在不同客户端中连接 AgentDock

AgentDock 通过 Streamable HTTP MCP 接入 Claude Desktop、ChatGPT、Claude Code、Cursor、VS Code、Codex、TRAE 和 WorkBuddy。本页示例统一使用：

```text
https://agentdock.example.com/mcp
```

请把它替换为你自己的 AgentDock MCP 地址。

:::note
不同客户端的菜单名称、套餐限制和管理员策略可能调整。本文使用当前常见界面名称；找不到对应入口时，可在设置中搜索 `MCP`、`插件` 或 `Connectors`。
:::

## 连接前准备

使用公网客户端或云端服务时，应先确认：

- AgentDock 已通过公网 HTTPS 域名提供服务。
- MCP 地址以 `/mcp` 结尾。
- OAuth 已启用，或者客户端支持通过 Header 发送 Bearer Token。
- 反向代理会转发 `/mcp`、`/register`、`/oauth/*` 和 `/.well-known/*`。

启用 OAuth 时，AgentDock 至少需要：

```bash
AGENTDOCK_OAUTH_ENABLED=true
AGENTDOCK_SERVER_URL=https://agentdock.example.com
AGENTDOCK_OAUTH_PASSWORD=<至少-12-个字符的授权密码>
AGENTDOCK_OAUTH_TOKEN_SECRET=<至少-32-字节的随机签名密钥>
```

`AGENTDOCK_SERVER_URL` 只填写 Origin，不附加 `/mcp`。客户端中填写的地址才是完整的 `https://agentdock.example.com/mcp`。

对于与 AgentDock 运行在同一台电脑上的本地客户端，也可以连接：

```text
http://127.0.0.1:8765/mcp
```

云端客户端无法访问你电脑或服务器的 `127.0.0.1`。

## Claude Desktop

Claude Desktop 是否支持自定义 MCP，以及可添加的服务器数量，取决于当前套餐和工作区策略。

1. 打开 Claude Desktop，进入 **Customize > Connectors**。
2. 点击 **+**，选择 **Add Connector**。
3. 名称填写 `AgentDock`。
4. MCP Server URL 填写：

   ```text
   https://agentdock.example.com/mcp
   ```

5. 保存后点击 **Connect**。
6. 浏览器打开 AgentDock 授权页后，输入 `AGENTDOCK_OAUTH_PASSWORD` 完成授权。

## ChatGPT

ChatGPT 需要当前套餐和工作区支持自定义 MCP 插件；企业工作区还可能需要管理员先开放开发人员模式。

在 Windows 或 macOS 桌面安装并已开启公网地址时，常见路径是：

1. 从 AgentDock 控制面板复制公网 MCP 地址和 OAuth 密码。
2. 打开 ChatGPT，进入 **设置 > 插件 > 高级设置**。
3. 开启 **开发人员模式**。
4. 在插件页面点击 **➕** / **创建插件**。
5. 插件名称填写 `AgentDock`。
6. MCP Server URL 填写公网地址，例如：

   ```text
   https://agentdock.example.com/mcp
   ```

7. 创建插件并发起连接。
8. 浏览器打开 AgentDock 授权页后，确认插件名称与回调域名，再输入 OAuth 密码完成授权。
9. 返回 ChatGPT，确认 AgentDock 插件已经可用。

完整的 Windows 安装器教程、端点检查和排障步骤见 [使用 ChatGPT 连接 AgentDock](./chatgpt.md)。

## Claude Code

### OAuth

在终端运行：

```bash
claude mcp add --transport http agentdock https://agentdock.example.com/mcp
```

然后在 Claude Code 会话中运行：

```text
/mcp
```

选择 AgentDock，并按提示在浏览器中完成 OAuth 授权。

### Bearer Token

```bash
claude mcp add --transport http agentdock https://agentdock.example.com/mcp \
  --header "Authorization: Bearer YOUR_TOKEN_HERE"
```

不要把真实 Token 提交到 Shell 历史、脚本或公开仓库。长期使用时，优先通过受限环境变量或客户端秘密管理能力注入。

## Cursor

1. 打开 Cursor，进入 **Cursor Settings**。
2. 在左侧选择 **Tools & MCP**。
3. 点击 **Add Custom MCP**。
4. 编辑项目中的 `.cursor/mcp.json`：

```json
{
  "mcpServers": {
    "agentdock": {
      "url": "https://agentdock.example.com/mcp"
    }
  }
}
```

保存后回到 **Tools & MCP**，找到 AgentDock，点击 **Connect**，并在浏览器中完成 OAuth 授权。

使用 Bearer Token 时：

```json
{
  "mcpServers": {
    "agentdock": {
      "url": "https://agentdock.example.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN_HERE"
      }
    }
  }
}
```

项目级 `.cursor/mcp.json` 可能进入版本控制。不要把真实 Token 直接写入会提交的文件。

## VS Code

在工作区创建或编辑 `.vscode/mcp.json`：

```json
{
  "servers": {
    "agentdock": {
      "type": "http",
      "url": "https://agentdock.example.com/mcp"
    }
  }
}
```

也可以打开命令面板：

```text
Ctrl+Shift+P / Cmd+Shift+P
```

运行 **Add Server**，选择 **HTTP (HTTP or Server-Sent Events)**，输入 AgentDock MCP 地址和服务器 ID，再选择保存到工作区或全局配置。保存后按提示在浏览器中完成 OAuth 授权。

使用 Bearer Token 时：

```json
{
  "servers": {
    "agentdock": {
      "type": "http",
      "url": "https://agentdock.example.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN_HERE"
      }
    }
  }
}
```

工作区配置可能进入 Git。不要提交真实 Token。

## Codex

### Codex App

1. 打开 Codex，进入 **设置 > 插件 > MCP**。
2. 点击 **添加服务器**。
3. 名称填写 `AgentDock`。
4. 传输方式选择 **流式 HTTP**。
5. MCP Server URL 填写：

   ```text
   https://agentdock.example.com/mcp
   ```

6. 保存后点击右侧的 **进行身份验证**，在浏览器中完成 OAuth 授权。

### 命令行

```bash
codex mcp add agentdock --url https://agentdock.example.com/mcp
```

命令执行后，按终端提示完成 OAuth 登录和授权。

## TRAE

1. 打开 TRAE，进入设置。
2. 在左侧选择 **MCP**。
3. 点击 **添加 > 手动添加**。
4. 添加以下配置：

```json
{
  "mcpServers": {
    "agentdock": {
      "url": "https://agentdock.example.com/mcp"
    }
  }
}
```

保存后，在已安装的 MCP Servers 中找到 AgentDock，点击右侧 **前往验证**，并在浏览器中完成 OAuth 授权。

使用 Bearer Token 时：

```json
{
  "mcpServers": {
    "agentdock": {
      "url": "https://agentdock.example.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN_HERE"
      }
    }
  }
}
```

## WorkBuddy

1. 打开 WorkBuddy，在左侧选择 **技能**。
2. 在右侧选择 **MCP 服务器**。
3. 点击 **配置 MCP**。
4. 添加以下配置：

```json
{
  "mcpServers": {
    "agentdock": {
      "type": "http",
      "url": "https://agentdock.example.com/mcp",
      "disabled": false
    }
  }
}
```

保存后返回 MCP 列表，找到 AgentDock，点击右侧 **连接**，并在浏览器中完成 OAuth 授权。

使用 Bearer Token 时：

```json
{
  "mcpServers": {
    "agentdock": {
      "type": "http",
      "url": "https://agentdock.example.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN_HERE"
      },
      "disabled": false
    }
  }
}
```

## 验证连接

连接完成后，不要只看客户端显示“已连接”。应完成一次真实只读调用，例如：

```text
调用 AgentDock 的 server_info，告诉我服务版本、操作系统和当前认证方式。
```

如果 OAuth 页面没有打开，先验证：

```bash
curl -fsS https://agentdock.example.com/.well-known/oauth-authorization-server
curl -fsS https://agentdock.example.com/.well-known/oauth-protected-resource/mcp
```

如果授权页面返回 `302`，通常表示 AgentDock 正在跳转回客户端，这是 OAuth 正常流程。页面没有继续跳转时，再检查反向代理是否保留 `Location` Header，以及客户端回调地址是否被浏览器或网络策略拦截。

完整认证配置见 [配置](../reference/configuration.md#oauth-配置)，公网部署见 [Linux 手动部署](../getting-started/vps.md)。
