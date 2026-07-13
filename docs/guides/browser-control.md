# 浏览器自动化

AgentDock 的 `browser_*` 工具用于打开页面、点击、输入、滚动、等待、截图，并返回页面文本、控制台错误、网络失败和页面运行错误。

## 启动会话

使用系统 Chrome：

```json
{
  "action": "start",
  "browser": "chrome",
  "headless": true,
  "url": "https://example.com"
}
```

macOS 推荐使用已安装的 Google Chrome；Windows 也可以使用 Chrome 或 Edge。默认 runner 使用 `playwright-core`，不会自动下载完整浏览器。

## 使用独立 Profile

需要持久登录态时，为 AgentDock 使用单独的 `profile_id`。不要直接复用日常浏览器主 Profile，以免污染用户数据或让自动化访问不必要的账号。

## CDP 连接

需要连接已开启调试端口的浏览器时：

```json
{
  "action": "start",
  "backend": "cdp",
  "cdp_url": "http://127.0.0.1:9222"
}
```

CDP 端口必须只监听回环地址。公开 CDP 端口等同于向外部开放浏览器控制权限。

## 截图与诊断

`browser_act` 和 `browser_snapshot` 返回截图 Artifact 引用，而不是在工具结果中嵌入 Base64。需要查看截图时，再用 `view_image` 加载 `artifact_id`。

诊断网页问题时同时检查：

- `console_errors`
- `network_errors`
- `page_errors`
- 页面文本和最终 URL

截图只能证明视觉状态，不能替代控制台和网络错误检查。

## 安全建议

- 优先使用点击、输入、滚动和等待等可观察动作。
- 不在自动化脚本中记录密码、Cookie 或 Authorization Header。
- 上传文件和提交表单前确认目标页面与副作用。
- 使用完持久会话后按需要保存或清理 storage state。
