# macOS desktop automation

The macOS Desktop Skill lets an agent observe the current logged-in desktop and, within the permissions you grant, click, type, use keyboard shortcuts, or drag.

Docker, remote VPS hosts, system-level background services, and logged-out sessions cannot control the real macOS desktop.

## 1. Install AgentDock

Follow the [macOS installation](../getting-started/macos.md) and run AgentDock as the current logged-in user. Docker, a LaunchDaemon, and a remote Linux instance cannot control the current Mac desktop.

## 2. Install the Desktop Skill

Send this instruction to a client that is already connected to AgentDock:

```text
Validate, install, and activate the official Desktop Skill:
https://github.com/uvwt/agentdock/releases/latest/download/skill-desktop.zip
```

The official ZIP is published with each AgentDock release and has a matching SHA-256 checksum file. After installation, ask whether the `desktop` Skill is active.

## 3. Grant macOS permissions

1. Grant Screen Recording permission to the terminal or host application that actually runs AgentDock.
2. Grant Accessibility permission when clicking or typing is required.
3. Restart the relevant terminal or application so the permission takes effect.

Grant these permissions only to the process that runs AgentDock, not to unrelated applications.

## How to use it

Describe the goal directly:

```text
Inspect the current window and explain this error message.
Find the settings page in this application, but ask before changing anything.
Fill this text into the form without submitting it.
```

The agent should observe the current application and window first, perform the action, and observe or capture a screenshot again to verify the result.

## Operations that require confirmation

The following actions usually need an additional confirmation:

- Send messages, email, or files.
- Delete content.
- Upload, pay, or authorize access.
- Change system permissions or account settings.
- Write sensitive information to the clipboard.

Coordinate-based clicking is fragile across window positions, scaling, and multiple displays. Prefer readable Accessibility elements when available.

## Privacy

Desktop screenshots may contain notifications, chats, accounts, and file contents. Do not publish, synchronize, or commit screenshots and runtime artifacts automatically.

Regular users do not need to call the Desktop Skill's internal commands manually. See [Contributor guide](../contributing/development.md#skill-development) for Skill development.
