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
  tagline: '让 Agent 安全、可恢复地操作本地与远程环境',
  url: 'https://uvwt.github.io',
  baseUrl: '/agentdock-docs/',
  organizationName: 'uvwt',
  projectName: 'agentdock-docs',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'warn',

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
      title: 'AgentDock Docs',
      hideOnScroll: true,
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: '文档',
        },
        {
          to: '/docs/getting-started/docker',
          label: '快速开始',
          position: 'left',
        },
        {
          href: 'https://github.com/uvwt/agentdock',
          label: 'AgentDock',
          position: 'right',
        },
        {
          href: 'https://github.com/uvwt/agentdock-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '文档',
          items: [
            {label: '快速开始', to: '/docs/getting-started/docker'},
            {label: 'Skill', to: '/docs/concepts/skills'},
            {label: '可恢复任务', to: '/docs/concepts/tasks'},
          ],
        },
        {
          title: '项目',
          items: [
            {label: 'AgentDock', href: 'https://github.com/uvwt/agentdock'},
            {
              label: '文档仓库',
              href: 'https://github.com/uvwt/agentdock-docs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AgentDock. Built with Docusaurus.`,
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
