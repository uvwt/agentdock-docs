import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: '安装',
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
      label: '使用 AgentDock',
      link: {
        type: 'generated-index',
        title: '使用 AgentDock',
        description: '了解 Skill、任务、浏览器、桌面自动化和外部服务接入。',
      },
      items: [
        'guides/chatgpt',
        'concepts/skills',
        'concepts/tasks',
        'guides/browser-control',
        'guides/desktop-automation',
        'concepts/dynamic-mcp',
        'concepts/recalldock',
      ],
    },
    {
      type: 'category',
      label: '配置与工具',
      link: {
        type: 'generated-index',
        title: '配置与工具',
        description: '查看完整运行配置、认证方式和内置工具目录。',
      },
      items: ['reference/configuration', 'reference/tools'],
    },
    {
      type: 'category',
      label: '进阶与运维',
      link: {
        type: 'generated-index',
        title: '进阶与运维',
        description: '查看平台进阶配置、手动部署、安全边界和故障排查。',
      },
      items: [
        'operations/macos',
        'operations/windows',
        'operations/linux',
        'operations/docker',
        {type: 'doc', id: 'getting-started/vps', label: 'Linux 手动部署（高级）'},
        'operations/security',
        'operations/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: '开发者',
      items: ['contributing/development'],
    },
  ],
};

export default sidebars;
