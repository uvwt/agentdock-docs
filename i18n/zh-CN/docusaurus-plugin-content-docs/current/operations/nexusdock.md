# 安装与维护

最简单的安装方式是使用 Docker Compose。

## 开始前

在宿主机安装 Docker Engine 和 Docker Compose。

## 创建 `compose.yaml`

新建一个 NexusDock 目录，并创建 `compose.yaml`：

```yaml
services:
  nexusdock:
    image: agentdockio/nexusdock:latest
    restart: unless-stopped
    ports:
      - "127.0.0.1:18777:18777"
    volumes:
      - nexus-data:/var/lib/nexus
      - recall:/recall
volumes:
  nexus-data:
  recall:
```

也可以使用 `ghcr.io/uvwt/nexusdock:latest`。官方镜像支持 `linux/amd64` 和 `linux/arm64`。

## 创建管理员并启动

执行：

```bash
docker compose run --rm nexusdock admin init admin
docker compose up -d
```

然后打开：

```text
http://127.0.0.1:18777
```

使用刚创建的管理员账号登录即可。

## 远程访问

需要远程使用时，通过 HTTPS 对外提供 NexusDock。HTTP 只用于 `localhost` / 回环地址访问。

保持 Docker 端口绑定 `127.0.0.1`，再在前面使用自己的 HTTPS 反向代理或 Tunnel。复杂代理链和其他可选站点设置见 [NexusDock README](https://github.com/uvwt/nexusdock)。

## AI 与向量设置

Embedding 和外部模型都是可选能力。不配置时，设备管理、MCP 路由、Recall 文件浏览、关键词搜索和基础 Workflow 仍然可以正常使用。

需要语义 Recall 或 Workflow 向量匹配时，在 **设置 → AI 与向量** 中配置即可。

## 升级

先备份持久化数据，然后执行：

```bash
docker compose pull
docker compose up -d
curl http://127.0.0.1:18777/health
```

不要运行两个 NexusDock 实例同时写同一份 Nexus 数据。

## 备份与恢复

快速安装使用两个 Docker Volume 保存持久化数据：

```text
nexus-data   NexusDock 账号、设备、设置、密钥和 Workflow 数据
recall       Recall 内容与私密笔记数据
```

升级或迁移前同时备份这两个 Volume。如果你改成了宿主机目录挂载，则完整备份对应的两个目录。

忘记管理员密码时执行：

```bash
docker compose run --rm nexusdock admin recover
```

基础排障可以先检查：

```bash
docker compose ps
docker compose logs --tail=200 nexusdock
curl http://127.0.0.1:18777/health
```

## 连接设备与客户端

安装完成后，继续阅读 [连接 AgentDock 与客户端](./nexusdock-connect.md)。
