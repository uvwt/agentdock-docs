# macOS 桌面自动化

macOS Desktop Skill 可以让 Agent 观察当前登录桌面，并在你的授权范围内点击、输入、使用快捷键或拖拽。

Docker、远程 VPS、系统级后台服务和未登录会话不能控制真实 macOS 桌面。

## 1. 安装 AgentDock

先按 [macOS 安装](../getting-started/macos.md) 在当前登录用户下运行 AgentDock。Docker、LaunchDaemon 和远程 Linux 实例都不能控制当前 Mac 桌面。

## 2. 安装 Desktop Skill

把下面这句话发给已经连接 AgentDock 的客户端：

```text
请读取官方 AgentDock Skills 目录中的 desktop 条目，按其中的摘要校验软件包，然后安装并激活：
https://raw.githubusercontent.com/uvwt/agentdock-skills/main/catalog.json
```

Desktop Skill 在 [uvwt/agentdock-skills](https://github.com/uvwt/agentdock-skills) 中独立版本化和发布，目录会锁定下载地址与 SHA-256 摘要。安装完成后可以询问“当前 desktop Skill 是否已经激活”进行确认。

## 3. 授予 macOS 权限

1. 为实际运行 AgentDock 的终端或托管应用授予“屏幕录制”权限。
2. 需要点击和输入时，再授予“辅助功能”权限。
3. 重启相关终端或应用，使权限生效。

只给实际运行 AgentDock 的应用授权，不要给无关程序开放这些权限。

## 怎样使用

可以直接提出目标：

```text
查看当前窗口，并告诉我这个错误提示是什么。
在这个应用里找到设置页面，但修改前先让我确认。
把文本填入表单，不要点击最终提交。
```

Agent 应先观察当前应用和窗口，再执行操作，最后重新观察或截图确认结果。

## 需要确认的操作

以下动作通常需要额外确认：

- 发送消息、邮件或文件。
- 删除内容。
- 上传、付款或授权。
- 修改系统权限和账号设置。
- 使用剪贴板写入敏感信息。

坐标点击容易受窗口位置、缩放和多显示器影响，应优先使用可读的辅助功能元素。

## 隐私

桌面截图可能包含通知、聊天、账号和文件内容。不要自动公开、同步或提交截图和运行产物。

Desktop Skill 的实现和内部命令不需要普通用户手工调用。创建 Skill 的说明见 [开发者指南](../contributing/development.md#skill-开发)。
