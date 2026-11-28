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
      label: 'Connect AI',
      link: {
        type: 'generated-index',
        title: 'Connect AI',
        slug: '/category/connect-ai',
        description:
          'Let your AI assistant configure NexusDock automatically, or connect ChatGPT, Claude, Cursor, VS Code, and other MCP clients manually.',
      },
      items: ['guides/ai-connect', 'guides/mcp-clients', 'guides/chatgpt'],
    },
    {
      type: 'category',
      label: 'Everyday Use & Capabilities',
      link: {
        type: 'generated-index',
        title: 'Everyday Use & Capabilities',
        slug: '/category/capabilities',
        description:
          'Use NexusDock devices, Recall memory, and Workflows every day, and extend AgentDock with Skills, Plugins, browser automation, Coding Agents, and tasks.',
      },
      items: [
        'guides/using-nexusdock',
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
      label: 'NexusDock Platform',
      link: {
        type: 'generated-index',
        title: 'NexusDock Platform',
        slug: '/category/nexusdock',
        description:
          'Connect multiple AgentDock devices via NexusDock Cloud or self-hosted NexusDock, and share Recall memory and Workflow data.',
      },
      items: [
        'concepts/nexusdock',
        'operations/nexusdock-connect',
        'operations/nexusdock',
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
        slug: '/category/operations',
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
        slug: '/category/reference',
        description:
          'Review runtime configuration, the built-in tool catalog, and NexusDock Cloud REST API entry points.',
      },
      items: ['reference/configuration', 'reference/tools', 'reference/api'],
    },
    {
      type: 'category',
      label: 'Developers',
      items: ['contributing/development'],
    },
  ],
};

export default sidebars;
