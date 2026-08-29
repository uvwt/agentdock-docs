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
      label: 'Using AgentDock',
      link: {
        type: 'generated-index',
        title: 'Using AgentDock',
        description:
          'Learn how to use Skills, tasks, browser and desktop automation, and external services.',
      },
      items: [
        'guides/mcp-clients',
        'guides/chatgpt',
        'concepts/skills',
        'concepts/tasks',
        'guides/browser-control',
        'guides/coding-agents',
        'guides/desktop-automation',
        'concepts/dynamic-mcp',
        'concepts/nexusdock',
        'concepts/recalldock',
      ],
    },
    {
      type: 'category',
      label: 'Configuration and tools',
      link: {
        type: 'generated-index',
        title: 'Configuration and tools',
        description: 'Review runtime configuration, authentication, and the built-in tool catalog.',
      },
      items: ['guides/fixed-domain', 'reference/configuration', 'reference/tools'],
    },
    {
      type: 'category',
      label: 'Advanced operations',
      link: {
        type: 'generated-index',
        title: 'Advanced operations',
        description:
          'Review advanced platform configuration, manual deployment, security boundaries, and troubleshooting.',
      },
      items: [
        'operations/macos',
        'operations/windows',
        'operations/linux',
        'operations/docker',
        {type: 'doc', id: 'getting-started/vps', label: 'Manual Linux deployment'},
        'operations/security',
        'operations/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Developers',
      items: ['contributing/development'],
    },
  ],
};

export default sidebars;
