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
  tagline: 'A secure, recoverable runtime for local and remote AI agent work',
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
    defaultLocale: 'en',
    locales: ['en', 'zh-CN'],
    localeConfigs: {
      en: {
        label: 'English',
        htmlLang: 'en',
      },
      'zh-CN': {
        label: '简体中文',
        htmlLang: 'zh-CN',
      },
    },
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
        content:
          'AgentDock, AI agent runtime, MCP server, Model Context Protocol, self-hosted, remote execution, automation, documentation',
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
          label: 'Documentation',
        },
        {
          to: '/docs/reference/configuration',
          label: 'Configuration',
          position: 'left',
        },
        {
          to: '/docs/reference/tools',
          label: 'Tools',
          position: 'left',
        },
        {
          type: 'localeDropdown',
          position: 'right',
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
          title: 'Documentation',
          items: [
            {label: 'Install AgentDock', to: '/docs/getting-started/install'},
            {label: 'Configuration', to: '/docs/reference/configuration'},
            {label: 'Tools', to: '/docs/reference/tools'},
          ],
        },
        {
          title: 'Capabilities',
          items: [
            {label: 'Skills', to: '/docs/concepts/skills'},
            {label: 'Dynamic MCP', to: '/docs/concepts/dynamic-mcp'},
            {label: 'Recoverable tasks', to: '/docs/concepts/tasks'},
          ],
        },
        {
          title: 'Project',
          items: [
            {label: 'AgentDock source', href: 'https://github.com/uvwt/agentdock'},
            {label: 'Documentation source', href: 'https://github.com/uvwt/agentdock-docs'},
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
