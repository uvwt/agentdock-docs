# Browser automation

With browser capabilities enabled, the agent can navigate pages, click, type, scroll, capture screenshots, and check page console, network, and page errors.

AgentDock supports Google Chrome, Chromium, and Microsoft Edge. By default, browser automation launches isolated AgentDock-managed sessions. Advanced users can instead attach to an existing Chromium-family browser over CDP; that mode is opt-in and has different isolation boundaries.

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

## Login state, profiles, and existing CDP browsers

For an AgentDock-owned browser, use a dedicated `profile_id` when persistent login state is needed. AgentDock stores that profile in its own browser data directory for reuse across later sessions; do not point an owned session at your daily browser profile.

Advanced setups can attach to an already-running Chromium-family browser. A per-session `cdp_url` is limited to loopback endpoints; named or remote CDP endpoints must be configured by the user through AgentDock settings. `AGENTDOCK_BROWSER_CDP_URL` selects a configured endpoint, while `AGENTDOCK_BROWSER_REUSE_EXISTING_CDP=true` asks AgentDock to reuse one uniquely discovered local CDP browser.

When attached over CDP, AgentDock creates and manages a dedicated target inside the external browser and leaves that browser running when the AgentDock session closes. External CDP sessions cannot use AgentDock persistent `profile_id`, cookie injection, or localStorage injection. Because the external browser may contain unrelated logged-in state, attach only to a browser instance you intentionally exposed for automation.

Initial logins may still require manual captcha completion, QR code scans, or 2FA confirmations. Do not let the agent echo passwords, cookies, or Authorization headers in chats or logs.

## Security boundaries

- Confirm before uploading files, sending messages, submitting forms, deleting content, or authorizing.
- Prefer AgentDock-owned dedicated profiles. If you explicitly use CDP attachment, expose only a browser instance intended for automation.
- Grant access only to websites and files required by the task.
- Clean up persistent profiles when login sessions are no longer needed.

For tool boundaries, see [Tools reference](../reference/tools.md#browser-automation); for host configuration, see [Configuration reference](../reference/configuration.md#browser-tools).
