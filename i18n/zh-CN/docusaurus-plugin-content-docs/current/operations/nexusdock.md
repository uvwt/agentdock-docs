# 部署 NexusDock

NexusDock 是独立于 AgentDock 的自托管中心服务。需要统一 Web 控制台、共享 Recall / Workflow，或希望用一个 MCP 入口访问多台 AgentDock 时，再部署 NexusDock。

产品边界和日常使用见 [NexusDock](../concepts/nexusdock.md)。本页只介绍一套精简、偏生产环境的 Docker 部署方式。

## 部署前准备

需要准备：

- Docker Engine 与 Docker Compose。
- 能长期保存 `nexus-data` 和 `recall` 的宿主机。
- 远程使用时准备一个 HTTPS 地址，例如 `https://nexus.example.com`。

官方镜像同时发布到 Docker Hub 与 GHCR，并支持 `linux/amd64` 和 `linux/arm64`。下面的示例固定使用 NexusDock `0.2.0`，避免生产环境隐式跟随 `latest`。

## 创建部署目录

创建持久化目录：

```bash
mkdir -p nexusdock/nexus-data nexusdock/recall
cd nexusdock
```

Linux 使用宿主机目录挂载时，让镜像内用户拥有写权限：

```bash
sudo chown -R 10001:10001 nexus-data recall
```

生成一个用于程序化 `/v1` API 的随机 Token：

```bash
openssl rand -hex 32
```

新建 `.env`：

```dotenv
NEXUS_AUTH_TOKEN=<random-token>
NEXUS_PUBLIC_URL=https://nexus.example.com
NEXUS_AUTH_ALLOW_INSECURE_HTTP=false
NEXUS_TRUSTED_PROXIES=127.0.0.1,::1
```

`NEXUS_PUBLIC_URL` 必须是纯 HTTPS Origin，不能附带路径、查询参数或 Fragment。只在本机临时通过 HTTP 试用时，可以留空 `NEXUS_PUBLIC_URL` 并设置 `NEXUS_AUTH_ALLOW_INSECURE_HTTP=true`；远程使用不要保留这个设置。

新建 `compose.yaml`：

```yaml
services:
  nexusdock:
    image: agentdockio/nexusdock:0.2.0
    container_name: nexusdock
    restart: unless-stopped
    read_only: true
    cap_drop:
      - ALL
    security_opt:
      - no-new-privileges:true
    ports:
      - "127.0.0.1:18777:18777"
    tmpfs:
      - /tmp:rw,noexec,nosuid,size=64m,uid=10001,gid=10001,mode=0700
    volumes:
      - ./nexus-data:/var/lib/nexus
      - ./recall:/recall
    environment:
      NEXUS_AUTH_TOKEN: ${NEXUS_AUTH_TOKEN}
      NEXUS_REQUIRE_AUTH: "true"
      NEXUS_AUTH_ALLOW_INSECURE_HTTP: ${NEXUS_AUTH_ALLOW_INSECURE_HTTP:-false}
      NEXUS_PUBLIC_URL: ${NEXUS_PUBLIC_URL:-}
      NEXUS_DATA_DIR: /var/lib/nexus
      RECALL_REPO_DIR: /recall
      NEXUS_TRUSTED_PROXIES: ${NEXUS_TRUSTED_PROXIES:-127.0.0.1,::1}
```

也可以使用 GHCR：

```yaml
image: ghcr.io/uvwt/nexusdock:0.2.0
```

## 初始化管理员

第一次登录前先创建管理员账号：

```bash
docker compose run --rm nexusdock admin init owner
```

命令会在终端中交互输入密码，并把凭据记录写入 NexusDock 的持久化数据库。不要把管理员密码写进 `.env`。

启动 NexusDock 并检查健康状态：

```bash
docker compose up -d
curl http://127.0.0.1:18777/health
```

然后打开已经配置好的 HTTPS 地址；如果只是本机试用，也可以打开 `http://127.0.0.1:18777`。

## 远程访问使用 HTTPS

条件允许时继续让容器端口只绑定 `127.0.0.1`，再通过自己的 HTTPS 反向代理或 Tunnel 对外提供 NexusDock。`NEXUS_PUBLIC_URL` 应填写实际对外访问的 Origin。

`NEXUS_TRUSTED_PROXIES` 只加入你实际使用的代理。NexusDock 会信任这些来源提供的转发请求信息，范围过宽会削弱这一安全边界。

如果 MCP 客户端需要使用 NexusDock OAuth，或需要通过 NexusDock 下载 AgentDock 节点发布的临时 Artifact，正确的公网地址尤其重要。节点文件仍保存在源 AgentDock 上；NexusDock 代理下载期间源节点必须保持在线。

## 配对 AgentDock 节点

登录后打开 **设置 → 系统与节点**，点击 **配对设备**。NexusDock 会生成一个有过期时间、只能使用一次的命令，例如：

```bash
agentdock nexus pair --endpoint https://nexus.example.com --code pair_xxx
```

在目标设备执行命令并重启 AgentDock。节点会主动向 NexusDock 建立出站 WebSocket 连接，因此 AgentDock 节点本身不需要开放公网入站端口。

节点选择、Runtime 页面、Recall、Workflow 和 fleet 路由见 [NexusDock](../concepts/nexusdock.md)。

## 连接 MCP 客户端

统一 MCP 地址是：

```text
https://nexus.example.com/mcp
```

支持 OAuth 的客户端可以通过浏览器授权。不支持 OAuth、需要固定 Bearer Token 的客户端，可以打开 **设置 → MCP 接入**，使用页面显示的专用 MCP Access Token。

不要混用三种凭据：

| 凭据 | 用途 |
| --- | --- |
| 管理员账号 / 密码 | 登录 Web 控制台 |
| `NEXUS_AUTH_TOKEN` | 程序化访问 `/v1` 管理 API |
| MCP Access Token | 只访问 `/mcp` |

不同客户端的具体接入方式见 [连接 MCP 客户端](../guides/mcp-clients.md)。

## 配置 AI 与向量检索

Embedding 是可选能力。不配置时，Recall 文件、关键词搜索、本地版本历史和普通 Workflow 浏览仍然可以正常使用。

部署完成后，优先在 **设置 → AI 与向量** 中配置 Stage 3 和共享 Embedding 服务。页面可以直接测试两个服务的连接，并重建 Recall / Workflow 向量索引，无需为了这些设置重启 NexusDock。

## 升级

先备份持久化数据，再把 `compose.yaml` 中的镜像标签改成目标版本，然后执行：

```bash
docker compose pull
docker compose up -d
curl http://127.0.0.1:18777/health
```

生产环境建议固定具体版本。可用版本见 [NexusDock Releases](https://github.com/uvwt/nexusdock/releases)。

不要让两个 NexusDock 实例同时写同一份 `nexus-data`。

## 备份与恢复

至少同时备份两个持久化目录：

```text
nexus-data/   账号、已配对设备、设置、数据库和 NexusDock 密钥
recall/       Recall 内容与本地 Git 历史
```

忘记管理员密码时，在部署主机上执行：

```bash
docker compose run --rm nexusdock admin recover owner
```

排障可以先检查：

```bash
docker compose ps
docker compose logs --tail=200 nexusdock
curl http://127.0.0.1:18777/health
```
