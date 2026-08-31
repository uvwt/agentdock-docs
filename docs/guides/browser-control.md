# Browser automation

With browser capabilities enabled, the agent can navigate pages, click, type, scroll, capture screenshots, and check page console, network, and page errors.

AgentDock supports Google Chrome, Chromium, and Microsoft Edge. Browser automation uses isolated sessions managed by AgentDock, separated from your primary browser profile.

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
2. Start the browser image per [Advanced Docker configuration](../operations/docker.md#enable-browser-automation).
3. After connecting the client, confirm the agent can see `browser_*` tools.

## Ask the agent directly

Describe the goal directly:

```text
Open this page, check if it loads correctly, and report any console or network errors.
Log in, search for the specified content, but ask for my confirmation before submitting the form.
Take a screenshot of the final page.
```

The agent observes the page first, executes actions, and verifies the final state.

## Login state and profiles

When persistent logins are needed, use AgentDock's dedicated browser profiles. Specifying a `profile_id` saves the profile in AgentDock's browser data directory for reuse across subsequent sessions.

Do not point AgentDock to your daily personal browser profile. Browser tools use isolated sessions managed by AgentDock and do not take over existing open personal browsers.

Initial logins may still require manual captcha completion, QR code scans, or 2FA confirmations. Do not let the agent echo passwords, cookies, or Authorization headers in chats or logs.

## Security boundaries

- Confirm before uploading files, sending messages, submitting forms, deleting content, or authorizing.
- Use AgentDock dedicated profiles instead of personal browser profiles.
- Grant access only to websites and files required by the task.
- Clean up persistent profiles when login sessions are no longer needed.

For tool boundaries, see [Tools reference](../reference/tools.md#browser-automation); for host configuration, see [Configuration reference](../reference/configuration.md#browser-tools).
