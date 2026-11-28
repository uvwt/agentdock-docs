# Workflow 工作流

Workflow 是 NexusDock 中共享的可复用流程。只要一件事会重复发生，而且每次大致遵循相似步骤，就可以把它保存成 Workflow。日常生活、学习、内容创作、工作和技术任务都可以使用。

## 有什么用

Workflow 可以把一套已经验证过的流程保存下来，之后遇到类似任务时直接复用，不需要每次从头规划。

例如可以保存：

- 出门旅行前的准备流程；
- 每周学习复习或资料整理流程；
- 照片、下载文件或个人资料的整理流程；
- 写文章、做视频或发布内容的流程；
- 工作中的例行检查和重复事务；
- 发布版本、部署服务或排查故障的流程。

Workflow 由 NexusDock 统一保存，已经配对的 AgentDock 设备可以共同使用。

## 怎么使用

可以直接说：

```text
按我平时的旅行准备 Workflow 检查这次还缺什么。
用已有的每周复习 Workflow 帮我整理今天要做的内容。
把这套照片整理步骤保存成以后可以复用的 Workflow。
这次发版使用已有的发布 Workflow。
```

Workflow 是可复用流程，不是自动执行的脚本。AgentDock 会根据当前任务和真实环境调整步骤后再执行。

## 匹配方式

基础 Workflow 词法匹配开箱即用，不需要额外配置外部 AI 或 Embedding。在 NexusDock Cloud 中，语义匹配由云端按方案托管提供；在自托管 NexusDock 中，可在 **设置 → AI 与向量** 中配置启用。

当前任务进度和 Workflow 是两回事。执行进度见 [任务与进度](./tasks.md)，长期知识见 [Recall 记忆](./recalldock.md)。

想了解如何在日常工作中把设备、记忆与工作流结合使用，见 [日常使用 NexusDock](../guides/using-nexusdock.md)。
