# NexusDock

NexusDock is the optional self-hosted control plane for multiple AgentDock devices. AgentDock still performs real file, command, browser, Skill, and Coding Agent work on each device; NexusDock adds one place to connect devices, share Recall and Workflow data, and expose the fleet through one MCP endpoint.

Use NexusDock when you want several Macs, Windows PCs, Linux hosts, or servers to appear behind one trusted entry point. A single AgentDock instance does not require NexusDock for normal local tools or tasks.

Ready to self-host it? See [Deploy NexusDock](../operations/nexusdock.md) for the Docker setup, HTTPS boundary, upgrades, and backups.

## What the web console gives you

The console separates shared NexusDock data from node-local runtime state:

- **Overview** shows system status, whether each AgentDock node is online, and summaries for platform, version, Skills, dynamic MCP, recent tasks, and node tools.
- **Recall** provides the shared knowledge workspace: library files, experience cards, Evolution records, vector recall, and local version history.
- **Workflow** lets you browse published templates, their current steps and matching rules, and older retired versions.
- **Tasks**, **Skills**, and **MCP** are node views. Select a device first, then inspect its recoverable tasks and installed Skills. Dynamic MCP servers can also be added, enabled, disabled, refreshed, or removed, with isolated environment variables managed without reading secret values back in plaintext.
- **Settings** has four areas: **Account & Sessions** for password and active-session management; **MCP Access** for the fleet MCP endpoint and dedicated Access Token; **AI & Vector** for Stage 3 and embedding configuration, connection tests, and index rebuilds; and **System & Nodes** for pairing, renaming, disabling, or removing AgentDock nodes and checking system state.

The Runtime pages do not copy a node's task, Skill, or dynamic MCP state into NexusDock. NexusDock reads or manages those resources through the selected AgentDock node, so an offline node cannot serve its live runtime data.

## A typical first setup

1. Sign in to the NexusDock web console.
2. Open **Settings → System & Nodes** and choose **Pair device** to generate an expiring, one-time pairing code.
3. Run the generated `agentdock nexus pair ...` command on the target machine, then restart AgentDock.
4. After the node is online, choose it from the Runtime node selector to inspect tasks, Skills, and dynamic MCP.
5. If you want semantic Recall search or vector-assisted Workflow matching, configure embeddings under **Settings → AI & Vector**, test the connection, and rebuild the indexes.
6. To connect an MCP client to the whole fleet, use the NexusDock `/mcp` endpoint. OAuth-capable clients can authorize in the browser; other clients can use the dedicated token shown under **Settings → MCP Access**.

## How devices connect

Pair each AgentDock device from the NexusDock control panel. The device then opens an outbound WebSocket connection to NexusDock.

This design means:

- Only NexusDock needs a reachable HTTPS address for remote use.
- AgentDock nodes can stay behind NAT or a home network without opening an inbound port.
- Each paired device keeps its own identity and local operating-system permissions.
- Disabling or disconnecting one node does not move its local execution environment into NexusDock.

Pairing NexusDock does not remove the node's own MCP endpoint. You can continue connecting directly to AgentDock when a local or single-device workflow is more appropriate.

## One MCP endpoint for the fleet

MCP clients can connect to the NexusDock `/mcp` endpoint instead of configuring every AgentDock node separately.

Start with `agentdock_context`. NexusDock returns a fleet context with two parts:

- `nodes`: enabled AgentDock devices, including `node_id`, online state, version, platform, capabilities, and available node-local context.
- `shared`: NexusDock-owned Workflow, Recall, rules, and shared context that should not be duplicated per node.

NexusDock does not expose a separate `node_list` tool. The `node_id` returned by `agentdock_context` is the routing key for device tools.

Central tools are published once and do not take a `node_id`, including:

- `agentdock_context`
- `recall_search`, `recall_read`, `recall_write`, and `recall_maintain`
- `workflow_template_manage`
- `private_note_manage`

Device tools such as files, commands, tasks, browser automation, ACP, dynamic MCP, and `evolve` remain AgentDock capabilities. Through NexusDock, their input schema adds a required `node_id` so the call is routed to the intended node.

Keep paired AgentDock nodes on reasonably recent, similar versions to reduce tool-contract differences and keep the unified MCP endpoint as complete and consistent as possible.

## Recall and Workflow data

Recall and Workflow templates are centralized in NexusDock. This is why the fleet `agentdock_context` returns them under `shared` rather than copying them into every node context.

`recall_search` supports lexical search by default and can add semantic retrieval when NexusDock has an embedding model configured. The model-facing tool remains the same; callers do not need to choose a search backend.

See [NexusDock Recall](./recalldock.md) for content boundaries and [Tools](../reference/tools.md#nexusdock-recall) for the current tool contract.

## Download files from a node

When `file_publish` is called through NexusDock, the file still belongs to the selected AgentDock node. NexusDock can return its own temporary signed download URL and proxy the file over the node's existing outbound connection.

The important boundaries are:

- The source AgentDock node must remain online while the download is running.
- NexusDock reads large files in bounded chunks and verifies the artifact metadata and checksum while proxying.
- NexusDock does not persist a second copy of the node artifact.
- The signed URL expires; it is not a permanent public file host.

A public NexusDock download URL requires a correct external `NEXUS_PUBLIC_URL` and HTTPS deployment.

## Authentication boundaries

NexusDock keeps management access and MCP access separate. A remote MCP client can authorize against `/mcp` with the supported OAuth flow or a dedicated MCP Access Token without receiving NexusDock administrator API access.

For remote deployment:

- Put NexusDock behind HTTPS.
- Keep its application port bound to loopback or a trusted private network when possible.
- Configure trusted proxies narrowly.
- Protect the Nexus API token, MCP token, administrator password, Recall data, and private-note encryption material independently.

AgentDock nodes still enforce their own host permissions. NexusDock routing does not grant a node access to files, commands, browsers, or accounts that its AgentDock process could not access directly.

## AgentDock and NexusDock responsibilities

| Responsibility | AgentDock | NexusDock |
| --- | --- | --- |
| Files, commands, browser, ACP, Skills, dynamic MCP | Executes on the device | Routes calls to the selected node |
| Device runtime and operating-system permissions | Owns | Does not replace |
| Recoverable task state | Stored on the AgentDock node | Routes node task calls |
| Recall and Workflow registry | Consumes when configured | Owns the shared service |
| Knowledge evolution lifecycle | Owns policy and decisions | Provides shared storage and access paths |
| Multi-device MCP | Publishes node capabilities | Aggregates compatible node tools and central tools |
| Published node artifacts | Stores the source artifact | Proxies temporary signed downloads |

For a single device, start with AgentDock directly. Add NexusDock when centralized Recall, Workflow data, device management, or a unified multi-device MCP endpoint becomes useful.
