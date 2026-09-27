# Use the browser

With browser capabilities enabled, the agent can navigate pages, click, type, scroll, capture screenshots, and check page console, network, and page errors.

AgentDock supports Google Chrome, Chromium, and Microsoft Edge. Browser automation uses an isolated AgentDock-managed browser session by default.

## Before you start

### macOS graphical application

1. Install Google Chrome, Chromium, or Microsoft Edge.
2. Complete [macOS installation](../getting-started/macos.md).
3. Open **Advanced Settings**.
4. Check **Enable browser tools**.
5. Click **Apply and Restart**.

The application checks whether a supported browser is installed before saving; AgentDock does not download browsers automatically.

### Windows graphical application

Install Chrome, Chromium, or Microsoft Edge first, then enable browser tools in the AgentDock Control Panel and save settings. AgentDock automatically detects installed supported browsers.

### Linux or native deployments

Install Chrome, Chromium, or Microsoft Edge on the host, then enable browser tools via `AGENTDOCK_BROWSER_ENABLED=true` or `--browser-enabled`. If the browser is not automatically detected, specify the absolute binary path using `AGENTDOCK_BROWSER_EXECUTABLE_PATH`.

### Docker

To have Chromium contained within Docker, use the browser image:

1. Complete [Docker installation](../getting-started/docker.md).
2. Start the browser image per [Advanced Docker configuration](../operations/docker.md).
3. After connecting the client, confirm the agent can see `browser_*` tools.

## Ask the agent directly

Describe the goal directly:

```text
Open this page, check if it loads correctly, and report any console or network errors.
Log in, search for the specified content, but ask for my confirmation before submitting the form.
Take a screenshot of the final page.
```

Browser automation keeps the page state observable before and after actions, so the final result can be checked instead of inferred.

## Login state

AgentDock uses its own browser environment by default, separate from the browser you use every day.

If you want a site to stay signed in, AgentDock can keep that browser login state for later sessions. Some sites may still require a captcha, QR-code scan, or 2FA confirmation the first time you sign in.

If the host already has an available CDP browser, AgentDock can prefer reusing it and continue using its existing login state. If no reusable browser is available, AgentDock falls back to its own isolated browser. See [Configuration](../reference/configuration.md) for the setting.

Do not paste passwords, cookies, or other login credentials into chats or logs.

## Security boundaries

- Confirm before uploading files, sending messages, submitting forms, deleting content, or authorizing.
- Keep browser automation separate from your everyday browsing environment.
- Grant access only to websites and files required by the task.
- Clear saved browser login state when you no longer need it.

For tool boundaries, see [Tools reference](../reference/tools.md); for host configuration, see [Configuration reference](../reference/configuration.md).
