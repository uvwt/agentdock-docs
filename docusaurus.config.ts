import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {themes as prismThemes} from 'prism-react-renderer';

const algoliaAppId = process.env.ALGOLIA_APP_ID;
const algoliaApiKey = process.env.ALGOLIA_SEARCH_API_KEY;
const algoliaIndexName = process.env.ALGOLIA_INDEX_NAME;

const algolia =
  algoliaAppId && algoliaApiKey && algoliaIndexName
    ? {
        appId: algoliaAppId,
        apiKey: algoliaApiKey,
        indexName: algoliaIndexName,
        contextualSearch: true,
      }
    : undefined;

const config: Config = {
  title: 'AgentDock',
  tagline: '让 Agent 可控、可恢复地操作本地与远程环境',
  favicon: 'img/favicon.svg',
  url: 'https://uvwt.github.io',
  baseUrl: '/agentdock-docs/',
  organizationName: 'uvwt',
  projectName: 'agentdock-docs',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',

  future: {
    v4: true,
  },

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/uvwt/agentdock-docs/edit/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    metadata: [
      {
        name: 'keywords',
        content: 'AgentDock, Agent, MCP, Skill, automation, documentation',
      },
    ],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'AgentDock',
      hideOnScroll: false,
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: '文档',
        },
        {
          to: '/docs/reference/configuration',
          label: '配置参考',
          position: 'left',
        },
        {
          to: '/docs/reference/tools',
          label: '工具目录',
          position: 'left',
        },
        {
          href: 'https://github.com/uvwt/agentdock',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: '文档',
          items: [
            {label: '安装 AgentDock', to: '/docs/getting-started/install'},
            {label: '配置参考', to: '/docs/reference/configuration'},
            {label: '工具目录', to: '/docs/reference/tools'},
          ],
        },
        {
          title: '能力',
          items: [
            {label: 'Skill', to: '/docs/concepts/skills'},
            {label: '动态 MCP', to: '/docs/concepts/dynamic-mcp'},
            {label: '可恢复任务', to: '/docs/concepts/tasks'},
          ],
        },
        {
          title: '项目',
          items: [
            {label: 'AgentDock 源码', href: 'https://github.com/uvwt/agentdock'},
            {label: '文档源码', href: 'https://github.com/uvwt/agentdock-docs'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} AgentDock. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'powershell'],
    },
    ...(algolia ? {algolia} : {}),
  } satisfies Preset.ThemeConfig,
};

export default config;
