# 可恢复任务

`task_manage` 用于保存多步骤开发、部署、排障和迁移任务的目标、步骤、完成条件、进度和最终验证。它只保存状态，不代替命令、测试或真实部署。

简单查询、单次 Skill 调用和一条明确命令通常不需要创建任务。

## 生命周期

```text
workflow_template_manage match
→ task_manage create
→ task_manage checkpoint
→ 使用真实工具执行和验证
→ task_manage final_review
→ task_manage complete
```

当前动作：

```text
create
list
get
checkpoint
block
resume
final_review
complete
```

## 创建任务

```json
{
  "action": "create",
  "title": "修复 OAuth",
  "goal": "修复并验证 OAuth 流程",
  "completion_conditions": [
    "自动测试通过",
    "真实授权成功"
  ],
  "steps": [
    {"id": "inspect", "title": "检查现状"},
    {"id": "implement", "title": "修改实现"},
    {"id": "verify", "title": "测试并真实验证"}
  ]
}
```

步骤最多 12 条，每条使用稳定的 `id`。完成条件应描述可验证结果，而不是“代码已修改”这类过程。

## 更新进度

单步更新：

```json
{
  "action": "checkpoint",
  "task_id": "tsk_xxx",
  "step_id": "verify",
  "status": "in_progress",
  "summary": "正在运行完整测试"
}
```

一次完成多个步骤并指定当前步骤：

```json
{
  "action": "checkpoint",
  "task_id": "tsk_xxx",
  "completed_step_ids": ["inspect", "implement"],
  "current_step_id": "verify",
  "summary": "实现完成，进入验证"
}
```

步骤状态只有 `pending`、`in_progress` 和 `completed`，只能向前推进；一个任务同时最多有一个进行中步骤。

## 阻塞与恢复

只有出现无法继续的真实阻塞时才使用 `block`，例如目标设备离线、权限无法获取或外部服务持续不可达。普通测试失败和仍可继续排查的问题不应标记为阻塞。

阻塞解除后使用 `resume`，并说明恢复依据。

## 最终审查

所有步骤完成且真实验证结束后：

```json
{
  "action": "final_review",
  "task_id": "tsk_xxx",
  "status": "pass",
  "summary": "实现、测试和真实授权验证均已完成",
  "verified": [
    "go test ./... 通过",
    "真实 OAuth 授权成功"
  ]
}
```

审查通过后再调用 `complete`。`final_review` 不会自动补全未完成步骤。

## Workflow 模板

`workflow_template_manage` 用于匹配和读取可复用流程模板。一个模板合适时，创建任务只需传 `template_id`；多个模板同时适合时，应读取 2～3 个模板后合并、裁剪和排序，再把最终步骤与完成条件写入任务。

模板提供流程建议，不会替代模型判断，也不会自动执行命令。

## 状态边界

任务状态保存在当前 AgentDock 实例的 `~/.agentdock/tasks`。执行中任务不跨设备同步；需要长期复用的结论应整理到项目文档或 NexusDock Recall，而不是依赖旧任务文件。
