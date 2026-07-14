# 使用 Skill

Skill 是一份给 Agent 阅读的工作说明，里面写明什么时候使用、要遵守什么步骤、需要哪些依赖，以及哪些操作必须谨慎确认。

它不是单独运行的插件。真正的文件修改、命令执行、浏览器操作和外部请求仍由 AgentDock 工具完成。

## 普通用户如何使用

直接告诉 Agent 你的目标即可，例如：

```text
查看当前 Codex 额度。
用 desktop Skill 操作这个 macOS 应用。
安装并使用这个 Skill：https://example.com/example-skill.zip
```

Agent 通常会：

1. 检查当前是否已经安装匹配的 Skill。
2. 读取 Skill 的说明和安全边界。
3. 检查需要的命令、账号或环境变量。
4. 使用真实工具执行任务。
5. 对有副作用的操作进行确认和验证。

普通用户不需要手工打开 Skill 安装目录，也不要自己拼接版本路径。

## 安装 Skill

安装前应先确认来源可信。可以让 Agent 先校验包，再安装并激活：

```text
请先审查这个 Skill 的来源、文件和权限需求，确认安全后再安装。
```

远程地址必须指向 ZIP 包；本机来源可以是 Skill 目录或 ZIP 文件。AgentDock 会保存已安装版本，并允许在更新失败时回滚。Skill 包不应包含 Token、Cookie、浏览器登录态或个人环境文件。

## 配置账号或 API Key

Skill 需要账号凭据时，让 Agent 使用该 Skill 的独立环境保存，例如：

```text
为 example-skill 配置 EXAMPLE_API_KEY，但不要在回复中回显真实值。
```

独立环境只在运行对应 Skill 时注入，不会写入 Skill 包，也不会永久污染系统环境。

## 使用时要注意

- 删除、发送、上传、支付、授权等操作仍需要明确确认。
- Skill 说明不能突破运行用户、Docker volume 或系统权限。
- 第三方 Skill 可能调用外部服务，安装前应检查来源和能力范围。
- 遇到失败时，优先查看缺少的依赖或配置，不要把秘密粘贴到公开日志。

## 查看已安装 Skill

可以直接询问：

```text
当前有哪些 Skill？它们分别做什么？
```

Agent 会先查看已安装 Skill 的名称和说明，需要时再读取对应使用文档。

创建或维护 Skill 属于开发者工作，见 [开发者指南](../contributing/development.md#skill-开发)。
