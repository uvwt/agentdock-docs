# Browser automation

When browser capabilities are enabled, an agent can open pages, click, type, scroll, capture screenshots, and inspect console, network, and page errors.

AgentDock's browser tools use a native Go CDP runtime and launch a dedicated Chrome, Chromium, or Microsoft Edge process. Browser automation does **not** require Node.js, Playwright, or a separate Browser Runner.

## Before you start

### macOS app

1. Install Google Chrome, Chromium, or Microsoft Edge.
2. Complete the [macOS installation](../getting-started/macos.md).
3. Open **Advanced Settings (`高级设置`)**.
4. Turn on **Enable browser tools (`启用浏览器工具`)**.
5. Click **Apply and Restart (`应用并重启`)**.

The app checks whether a supported browser is installed before saving the setting. It does not download a browser for you.

### Windows app

Install Chrome, Chromium, or Microsoft Edge, then enable browser tools from the AgentDock control panel and save the configuration. AgentDock detects a supported installed browser automatically.

### Linux or other native deployments

Install Chrome, Chromium, or Microsoft Edge on the host, then enable browser tools with `AGENTDOCK_BROWSER_ENABLED=true` or `--browser-enabled`. If automatic discovery does not find the browser, set `AGENTDOCK_BROWSER_EXECUTABLE_PATH` to its absolute executable path.

### Docker

Use the browser image when you want Chromium to be included in the container:

1. Complete the [Docker installation](../getting-started/docker.md).
2. Start the browser image as described in [Advanced Docker configuration](../operations/docker.md#enable-browser-automation).
3. After connecting a client, confirm that the agent can see the `browser_*` tools.

## Describe the task directly

Regular users do not need to call browser tools manually. You can say:

```text
Open this page, check whether it loads correctly, and report any console or network errors.
After login, search for the requested content, but ask before submitting the form.
Show me a screenshot of the final page.
```

The agent should observe the page first, perform actions, and inspect the final state again.

## Multiple tabs and reliable waiting

When a page opens a new tab or popup, browser tools return the active `page_id` and a `pages` list. The agent should select the target page explicitly instead of assuming every action still belongs to the first page.

For slow pages, wait for a verifiable condition instead of sleeping for a fixed number of seconds:

- Wait for the URL to change.
- Wait for specific text or an element to appear.
- Wait for a matching network response and status code.

This is more reliable than an arbitrary delay and makes failures easier to diagnose.

## Login state and profiles

Use an AgentDock profile when login state must persist. A `profile_id` creates a profile under AgentDock's own browser data directory so later sessions can reuse the same login state.

Do not point AgentDock at your everyday browser profile. The current browser tools manage browsers launched by AgentDock; they do not attach to an already-open personal browser through an external CDP port.

The first login may still require manual CAPTCHA, QR-code, or security confirmation. Do not let the agent reveal passwords, cookies, or Authorization headers in chat or logs.

## Screenshots and failure diagnosis

A screenshot proves only the visual state. To determine whether the page actually works, also inspect:

- The final URL and page text.
- `console_errors`.
- `network_errors`.
- `page_errors`.

## Security boundaries

- Confirm the target and side effects before uploading files, sending messages, submitting forms, deleting content, or authorizing access.
- Use a dedicated AgentDock profile instead of your daily browser profile.
- Allow automation to access only the websites and files required by the task.
- Clean up persistent profiles when their login state is no longer needed.

See [Tools](../reference/tools.md#browser-automation) for the browser tool boundaries and [Configuration](../reference/configuration.md#browser-tools) for host settings.
