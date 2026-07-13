# macOS Desktop Skill

`desktop` 是用于 macOS 登录会话的纯文档 Skill。它指导模型观察应用状态、读取辅助功能元素，并在必要时执行点击、输入、剪贴板和拖拽等桌面操作。

Docker、VPS 和未登录的后台会话不能控制真实 macOS 桌面。

## 前置条件

- AgentDock 在当前 macOS 登录用户下裸机运行。
- 运行 AgentDock 的应用或终端已获得屏幕录制权限。
- 需要交互时已获得辅助功能权限。
- 已安装并激活 `desktop` Skill。

## 使用流程

```text
agentdock_context
→ 找到 desktop Skill
→ read_file skill://desktop/SKILL.md
→ 按当前 Skill 文档执行预检、观察和操作
→ 截图或重新观察验证结果
```

不要手工读取 Skill 状态文件或拼接安装版本路径。AgentDock 会通过 `exec_command skill=desktop` 绑定当前激活包目录和独立环境。

## 操作原则

- 优先使用辅助功能元素和可读状态，坐标点击只作为兜底。
- 先观察再操作，操作后再次验证。
- 输入文本、写剪贴板、发送快捷键、拖拽和确认对话框都属于有副作用操作。
- 涉及删除、发送、上传、支付或权限变更时，应在 Skill 规定的确认边界内执行。

## 数据与隐私

截图和运行产物保存在该 Skill 的私有数据目录中。不要自动提交、同步或公开这些文件；其中可能包含窗口内容、通知和账号信息。

Skill 的通用设计见 [Skill 设计与运行模型](../concepts/skills.md)。
