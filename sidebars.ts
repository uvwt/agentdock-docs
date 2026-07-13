import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: '配置与工具',
      link: {
        type: 'generated-index',
        title: '配置与工具',
        description: '查看 AgentDock 的运行配置、认证方式和内置工具能力。',
      },
      items: ['reference/configuration', 'reference/tools'],
    },
    {
      type: 'category',
      label: '快速开始',
      link: {
        type: 'generated-index',
        title: '快速开始',
        description: '选择适合当前环境的 AgentDock 安装与部署方式。',
      },
      items: [
        'getting-started/docker',
        'getting-started/linux',
        {type: 'doc', id: 'getting-started/vps', label: 'Linux 手动部署'},
        'getting-started/windows',
        'getting-started/macos',
      ],
    },
    {
      type: 'category',
      label: '核心概念',
      link: {
        type: 'generated-index',
        title: '核心概念',
        description: '理解 AgentDock 的 Skill、任务、动态 MCP 与 NexusDock Recall。',
      },
      items: [
        'concepts/skills',
        'concepts/tasks',
        'concepts/dynamic-mcp',
        'concepts/recalldock',
      ],
    },
    {
      type: 'category',
      label: '使用指南',
      link: {
        type: 'generated-index',
        title: '使用指南',
        description: '配置浏览器和 macOS 桌面自动化能力。',
      },
      items: ['guides/browser-control', 'guides/desktop-automation'],
    },
    {
      type: 'category',
      label: '运维与安全',
      link: {
        type: 'generated-index',
        title: '运维与安全',
        description: '查看安全边界、常见问题和排障方法。',
      },
      items: ['operations/security', 'operations/troubleshooting'],
    },
    {
      type: 'category',
      label: '参与贡献',
      items: ['contributing/development'],
    },
  ],
};

export default sidebars;
