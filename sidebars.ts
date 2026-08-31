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
        description: 'Use Skills, tasks, browser and desktop automation, Coding Agents, and external MCP servers.',
      },
      items: [
        'concepts/skills',
        'concepts/tasks',
        'guides/browser-control',
        'guides/coding-agents',
        'guides/desktop-automation',
        'concepts/dynamic-mcp',
      ],
    },
    {
      type: 'category',
      label: 'NexusDock',
      link: {
        type: 'generated-index',
        title: 'NexusDock',
        description: 'Connect multiple AgentDock devices and share Recall and Workflow data.',
      },
      items: ['concepts/nexusdock', 'concepts/recalldock'],
    },
    {
      type: 'category',
      label: 'Operations',
      link: {
        type: 'generated-index',
        title: 'Operations',
        description:
          'Configure platforms, public access, manual deployment, security boundaries, and troubleshooting.',
      },
      items: [
        'operations/macos',
        'operations/windows',
        'operations/linux',
        'operations/docker',
        {type: 'doc', id: 'getting-started/vps', label: 'Manual Linux deployment'},
        'guides/fixed-domain',
        'operations/security',
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
