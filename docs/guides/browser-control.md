# Browser automation

When browser capabilities are enabled, an agent can open pages, click, type, scroll, capture screenshots, and inspect console and network errors.

## Before you start

### Recommended: Docker browser image

The complete build-free option for regular users is the Docker browser image. It already includes Chromium, the browser runner, and the required Node.js dependencies:

1. Complete the [Docker installation](../getting-started/docker.md).
2. Start the browser image as described in [Advanced Docker configuration](../operations/docker.md#enable-browser-automation).
3. After connecting a client, confirm that the agent can see the `browser_*` tools.

### Native macOS / Windows / Linux

Native macOS, Windows, and Linux releases currently install only the AgentDock binary. They do not install the browser runner automatically. Native mode requires Node.js, the runner from the source repository, and `playwright-core`, so it is an advanced or contributor configuration.

If you only want working browser automation, do not enable browser tools blindly after a native installation. Prefer the Docker browser image. See [Configuration](../reference/configuration.md#browser-tools) for native runner settings.

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

Use a dedicated AgentDock browser profile when login state must persist. Do not reuse your daily browser profile, which may expose unrelated accounts or personal data to automation.

The first login often requires manual CAPTCHA, QR-code, or security confirmation. Do not let the agent reveal passwords, cookies, or Authorization headers in chat or logs.

## Connect to an existing browser

Advanced users can connect to a browser that was started with a CDP debugging port. The debugging port must listen only on `127.0.0.1`; a public CDP port provides complete browser control to anyone who can reach it.

## Screenshots and failure diagnosis

A screenshot proves only the visual state. To determine whether the page actually works, also inspect:

- The final URL and page text.
- `console_errors`.
- `network_errors`.
- `page_errors`.

## Security boundaries

- Confirm the target and side effects before uploading files, sending messages, submitting forms, deleting content, or authorizing access.
- Use a dedicated profile and do not mount the complete daily browser profile.
- Allow automation to access only the websites and files required by the task.
- Save or clean up persistent login state as appropriate after the session.

See [Tools](../reference/tools.md#browser-automation) for exact parameters.
