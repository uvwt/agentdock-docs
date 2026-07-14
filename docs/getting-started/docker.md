# Docker 安装

适合已经安装 Docker，或希望把 AgentDock 与宿主系统隔离运行的用户。不需要下载源码或执行 `docker build`。

需要控制 macOS 桌面时不要使用 Docker，请改用 [macOS 安装](./macos.md)。

## 1. 确认 Docker 可用

```bash
docker --version
docker compose version
```

两条命令都能显示版本号后再继续。

## 2. 下载启动配置

根据当前系统选择一组命令。

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

`.env` 中保存的是连接 Token。不要把它提交到 Git 或发给别人。

## 3. 启动并检查

```bash
docker compose up -d
docker compose ps
```

第一次启动需要下载镜像。等待状态变为 `healthy`；如果仍是 `starting`，十几秒后再执行一次 `docker compose ps`。

## 4. 连接 MCP 客户端

在客户端的 MCP、Tools 或 Connectors 设置中，新建连接：

```text
传输方式    Streamable HTTP
地址        http://127.0.0.1:18766/mcp
请求头      Authorization: Bearer <你的 Token>
```

Token 是 `.env` 文件中 `AGENTDOCK_AUTH_TOKEN=` 后面的内容。

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
**安装完成：** `docker compose ps` 显示 `healthy`，并把 MCP 地址与 Token 填入客户端后即可使用。
:::

## 更新

重新下载最新 `docker-compose.yml`，然后执行：

```bash
docker compose pull
docker compose up -d --force-recreate
```

## 按需继续

- 需要浏览器镜像、开发工具镜像、修改端口、挂载项目或迁移旧数据：阅读 [Docker 进阶配置](../operations/docker.md)。
- 启动失败：查看 [故障排查](../operations/troubleshooting.md)。
- 需要局域网或公网访问：先阅读 [安全模型](../operations/security.md)。
