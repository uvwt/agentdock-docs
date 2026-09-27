import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Installation',
      link: {
        type: 'doc',
        id: 'getting-started/install',
      },
      items: [
        'getting-started/macos',
        'getting-started/windows',
        'getting-started/linux',
        'getting-started/docker',
      ],
    },
    {
      type: 'category',
      label: 'Connect clients',
      link: {
        type: 'generated-index',
        title: 'Connect clients',
        description: 'Connect AgentDock to ChatGPT, Claude, Cursor, VS Code, and other MCP clients.',
      },
      items: ['guides/mcp-clients', 'guides/chatgpt'],
    },
    {
      type: 'category',
      label: 'Capabilities',
      link: {
        type: 'generated-index',
        title: 'Capabilities',
        description: 'Extend AgentDock with Skills and Plugins, track tasks, use browsers, and connect external tools.',
      },
      items: [
        'concepts/skills',
        'concepts/dynamic-mcp',
        'concepts/plugins',
        'guides/browser-control',
        'guides/coding-agents',
        'concepts/tasks',
      ],
    },
    {
      type: 'category',
      label: 'NexusDock',
      link: {
        type: 'generated-index',
        title: 'NexusDock',
        description: 'Connect multiple AgentDock devices and share Recall memory and Workflow data.',
      },
      items: [
        'concepts/nexusdock',
        'operations/nexusdock',
        'operations/nexusdock-connect',
        'concepts/recalldock',
        'concepts/workflow',
      ],
    },
    {
      type: 'category',
      label: 'Operations',
      link: {
        type: 'generated-index',
        title: 'Operations',
        description:
          'Manage desktop, Linux, Docker, public access, and troubleshooting.',
      },
      items: [
        'operations/desktop',
        'operations/linux',
        'operations/docker',
        'operations/public-access',
        'operations/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      link: {
        type: 'generated-index',
        title: 'Reference',
        description: 'Review runtime configuration and the built-in tool catalog.',
      },
      items: ['reference/configuration', 'reference/tools'],
    },
    {
      type: 'category',
      label: 'Developers',
      items: ['contributing/development'],
    },
  ],
};

export default sidebars;
