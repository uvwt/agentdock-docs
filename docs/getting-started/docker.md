# Docker 快速安装

这是体验 AgentDock 最省事的方式：不需要下载源码，也不需要自己构建镜像。

Docker 版适合文件、命令、Git、Skill 和动态 MCP。它不能直接控制 macOS 桌面；需要桌面自动化时请使用 [macOS 安装](./macos.md)。

## 开始前

先安装 Docker：

- Windows 或 macOS：安装 [Docker Desktop](https://docs.docker.com/desktop/)。
- Linux：安装 [Docker Engine](https://docs.docker.com/engine/install/) 和 Docker Compose 插件。

打开终端，确认下面两条命令都能正常输出版本号：

```bash
docker --version
docker compose version
```

## 1. 下载启动配置

根据你的系统选择一组命令。

### macOS / Linux

```bash
mkdir -p agentdock && cd agentdock
curl -fL https://github.com/uvwt/agentdock/releases/latest/download/docker-compose.yml \
  -o docker-compose.yml
printf 'AGENTDOCK_AUTH_TOKEN=%s\n' "$(openssl rand -hex 32)" > .env
```

### Windows PowerShell

```powershell
New-Item -ItemType Directory -Force agentdock | Out-Null
Set-Location agentdock
Invoke-WebRequest `
  https://github.com/uvwt/agentdock/releases/latest/download/docker-compose.yml `
  -OutFile docker-compose.yml
$token = [guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")
"AGENTDOCK_AUTH_TOKEN=$token" | Set-Content -Encoding ascii .env
```

`.env` 中保存的是本机连接密码。不要把它提交到 Git，也不要发给别人。

## 2. 启动 AgentDock

```bash
docker compose up -d
```

第一次启动会下载镜像，通常需要几十秒到几分钟。

## 3. 确认启动成功

```bash
docker compose ps
```

当状态显示为 `healthy` 时，AgentDock 已经可以使用。如果仍是 `starting`，等待十几秒后再执行一次。

也可以直接检查健康接口。

macOS / Linux：

```bash
curl -fsS http://127.0.0.1:18766/healthz
```

Windows PowerShell：

```powershell
Invoke-RestMethod http://127.0.0.1:18766/healthz
```

正常结果中会包含 `ok: true`。

## 4. 连接 MCP 客户端

在客户端的 MCP、Tools 或 Connectors 设置中，新建一个 HTTP MCP 连接并填写：

```text
传输方式    Streamable HTTP
地址        http://127.0.0.1:18766/mcp
请求头      Authorization: Bearer <你的 Token>
```

Token 就是 `.env` 文件中 `AGENTDOCK_AUTH_TOKEN=` 后面的内容。

查看 Token：

```bash
# macOS / Linux
cat .env
```

```powershell
# Windows PowerShell
Get-Content .env
```

:::tip
**安装完成：** 看到 `healthy` 并把 MCP 地址与 Token 填入客户端后，Docker 安装就完成了。下面的内容都不是首次启动必须操作的。
:::

## 常用命令

```bash
# 查看日志
docker compose logs -f

# 重启
docker compose restart

# 停止并移除容器，数据仍会保留
docker compose down

# 再次启动
docker compose up -d
```

## 按需继续

- 需要 Chromium 浏览器自动化、开发工具镜像、修改端口或挂载宿主项目：阅读 [Docker 进阶配置](../operations/docker.md)。
- 启动失败或状态一直不是 `healthy`：查看 [故障排查](../operations/troubleshooting.md)。
- 需要局域网或公网访问：先阅读 [安全模型](../operations/security.md)。
