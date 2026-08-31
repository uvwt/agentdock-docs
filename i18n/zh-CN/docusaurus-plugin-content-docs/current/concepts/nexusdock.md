# NexusDock

NexusDock 是面向多台 AgentDock 设备的可选自托管控制中心。真实的文件、命令、浏览器、Skill 和 Coding Agent 操作仍在各设备上的 AgentDock 中执行；NexusDock 负责把设备接入同一个中心，共享 Recall 与 Workflow 数据，并通过一个 MCP 入口暴露整套设备能力。

当你希望多台 Mac、Windows PC、Linux 主机或服务器通过一个可信入口统一使用时，可以部署 NexusDock。只有一台 AgentDock 时，普通本机工具和任务并不依赖 NexusDock。

准备自托管时，可直接参考 [部署 NexusDock](../operations/nexusdock.md)，其中包含 Docker、HTTPS、升级和备份说明。

## Web 控制台能做什么

控制台把 NexusDock 的共享数据和各节点自己的运行状态分开管理：

- **总览**：查看系统状态、各 AgentDock 节点是否在线，以及平台、版本、Skill、动态 MCP、最近任务和节点工具等摘要。
- **Recall**：管理共享知识，包括资料库、经验卡片、Evolution 记录、向量召回和本地版本历史。
- **Workflow**：浏览已发布模板、当前步骤与匹配规则，并查看历史版本。
- **任务 / Skill / MCP**：这些页面属于具体 AgentDock 节点。先选择设备，再查看其可恢复任务和已安装 Skill；动态 MCP 还可以直接添加、启停、刷新和移除，并管理隔离环境变量。敏感值只写入，不会从服务端回显明文。
- **设置**分为四部分：**账号与会话**用于修改密码和管理活动登录；**MCP 接入**用于查看统一 MCP 地址以及获取或重置专用 Access Token；**AI 与向量**用于配置 Stage 3 与 Embedding、测试连接和重建索引；**系统与节点**用于配对、重命名、停用或删除 AgentDock 节点，并查看系统状态。

Runtime 页面不会把节点上的任务、Skill 或动态 MCP 状态复制一份到 NexusDock。NexusDock 通过当前选中的 AgentDock 节点读取或管理这些数据，因此节点离线时也无法查看其实时运行状态。

## 第一次使用的典型流程

1. 登录 NexusDock Web 控制台。
2. 打开 **设置 → 系统与节点**，点击 **配对设备**，生成一个有过期时间且只能使用一次的配对码。
3. 在目标设备执行页面生成的 `agentdock nexus pair ...` 命令，然后重启 AgentDock。
4. 节点上线后，在 Runtime 页面顶部选择对应设备，即可查看任务、Skill 和动态 MCP。
5. 如果需要 Recall 语义搜索或 Workflow 向量匹配，可在 **设置 → AI 与向量** 中配置 Embedding、测试连接并重建索引。
6. 需要让 MCP 客户端访问整套设备时，连接 NexusDock 的 `/mcp`。支持 OAuth 的客户端可以通过浏览器授权；其他客户端可以使用 **设置 → MCP 接入** 中的专用 Access Token。

## 设备如何连接

先在 NexusDock 控制台中为 AgentDock 设备发起配对。完成配对后，设备会主动向 NexusDock 建立出站 WebSocket 连接。

这种设计意味着：

- 远程使用时，只需要让 NexusDock 有可访问的 HTTPS 地址。
- AgentDock 节点可以继续位于 NAT、家庭网络或没有入站公网端口的环境中。
- 每台设备保留独立身份，并继续受本机操作系统权限约束。
- 某个节点离线或被禁用，并不会把它的本机执行环境迁移到 NexusDock。

接入 NexusDock 不会移除节点自己的 MCP 地址。只操作单台设备或适合本地直连时，仍然可以直接连接 AgentDock。

## 用一个 MCP 入口访问多台设备

MCP 客户端可以只连接 NexusDock 的 `/mcp`，而不用分别配置每台 AgentDock。

连接后优先调用 `agentdock_context`。NexusDock 返回的 fleet 上下文分为两部分：

- `nodes`：已启用的 AgentDock 设备，包括 `node_id`、在线状态、版本、平台、能力以及可用的节点本地上下文。
- `shared`：由 NexusDock 统一持有的 Workflow、Recall、规则和共享上下文，不会在每个节点重复返回。

NexusDock 不提供额外的 `node_list` 工具。`agentdock_context` 返回的 `node_id` 就是后续调用设备工具时使用的路由标识。

以下中央工具只发布一次，并且不需要 `node_id`：

- `agentdock_context`
- `recall_search`、`recall_read`、`recall_write`、`recall_maintain`
- `workflow_template_manage`
- `private_note_manage`

文件、命令、任务、浏览器、ACP、动态 MCP 和 `evolve` 等仍然是 AgentDock 节点能力。经 NexusDock 调用时，它们的输入 Schema 会增加必填的 `node_id`，由 NexusDock 路由到指定设备。

建议让已配对的 AgentDock 节点保持在相近的最新版本，以减少工具契约差异，保证统一 MCP 入口尽量完整、一致。

## Recall 与 Workflow 数据

Recall 和 Workflow 模板由 NexusDock 统一管理，因此 fleet `agentdock_context` 会把它们放在 `shared` 中，而不是重复塞进每个节点上下文。

`recall_search` 默认支持关键词检索；NexusDock 配置 Embedding 模型后，可以透明加入语义召回。模型侧仍然调用同一个工具，不需要选择底层检索后端。

内容边界见 [NexusDock Recall](./recalldock.md)，当前工具契约见 [工具参考](../reference/tools.md#nexusdock-recall)。

## 从节点下载文件

通过 NexusDock 调用 `file_publish` 时，文件仍然存放在选中的 AgentDock 节点上。NexusDock 可以返回自己的临时签名下载地址，并通过节点现有的出站连接代理文件内容。

需要注意：

- 下载期间源 AgentDock 节点必须保持在线。
- NexusDock 会按受限分块读取大文件，并在代理过程中校验 Artifact 元数据和校验和。
- NexusDock 不会额外持久化一份节点 Artifact 内容。
- 签名地址会过期，不是永久公开文件托管地址。

要让外部客户端使用 NexusDock 的公开下载地址，需要正确配置对外 `NEXUS_PUBLIC_URL` 并使用 HTTPS。

## 认证边界

NexusDock 将管理权限和 MCP 访问权限分开。远程 MCP 客户端可以通过受支持的 OAuth 流程或专用 MCP Access Token 访问 `/mcp`，但不会因此获得 NexusDock 管理 API 权限。

远程部署时建议：

- 为 NexusDock 提供 HTTPS。
- 条件允许时，让应用端口只绑定 loopback 或可信私网。
- 只信任实际使用的反向代理。
- 分别保护 Nexus API Token、MCP Token、管理员密码、Recall 数据和私密笔记加密材料。

AgentDock 节点仍然执行自己的主机权限边界。通过 NexusDock 路由，并不会让节点获得其 AgentDock 进程本来无法访问的文件、命令、浏览器或账号权限。

## AgentDock 与 NexusDock 的职责

| 职责 | AgentDock | NexusDock |
| --- | --- | --- |
| 文件、命令、浏览器、ACP、Skill、动态 MCP | 在设备上真实执行 | 把调用路由到指定节点 |
| 设备运行环境和操作系统权限 | 负责 | 不替代 |
| 可恢复任务状态 | 保存在 AgentDock 节点 | 路由节点任务调用 |
| Recall 与 Workflow Registry | 配置后消费 | 持有共享服务 |
| 知识 Evolution 生命周期 | 负责策略和决策 | 提供共享存储与访问路径 |
| 多设备 MCP | 公布节点能力 | 聚合兼容节点工具与中央工具 |
| 节点发布的 Artifact | 保存源文件 | 代理临时签名下载 |

只有一台设备时，优先直接使用 AgentDock。需要集中 Recall、Workflow、设备管理或统一的多设备 MCP 入口时，再加入 NexusDock。
