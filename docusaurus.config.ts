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
  title: 'NexusDock Docs',
  tagline: 'Unified documentation for NexusDock Cloud and AgentDock',
  favicon: 'img/favicon.png',
  url: 'https://docs.nexusdock.co',
  baseUrl: '/',
  organizationName: 'uvwt',
  projectName: 'agentdock-docs',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  clientModules: ['./src/clientModules/localePreference.mjs'],

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
          'NexusDock, NexusDock Cloud, AgentDock, AI agent runtime, Remote MCP, Model Context Protocol, Recall memory, Workflow, REST API, self-hosted, documentation',
      },
    ],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'NexusDock Docs',
      logo: {
        alt: 'NexusDock',
        src: 'img/nexusdock-icon.png',
        width: 28,
        height: 28,
      },
      hideOnScroll: false,
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/docs/guides/mcp-clients',
          label: 'Connect AI',
          position: 'left',
        },
        {
          to: '/docs/category/reference',
          label: 'Reference',
          position: 'left',
        },
        {
          href: 'https://mcp.nexusdock.co/docs/api',
          label: 'REST API',
          position: 'left',
        },
        {
          href: 'https://www.nexusdock.co',
          label: 'Website',
          position: 'right',
        },
        {
          href: 'https://mcp.nexusdock.co',
          label: 'Cloud',
          position: 'right',
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
            {label: 'Introduction', to: '/docs/intro'},
            {label: 'Install AgentDock', to: '/docs/getting-started/install'},
            {label: 'Let AI connect NexusDock', to: '/docs/guides/ai-connect'},
            {label: 'Everyday use', to: '/docs/guides/using-nexusdock'},
          ],
        },
        {
          title: 'Reference',
          items: [
            {label: 'Connect clients', to: '/docs/guides/mcp-clients'},
            {label: 'Configuration', to: '/docs/reference/configuration'},
            {label: 'Tools', to: '/docs/reference/tools'},
            {label: 'REST API overview', to: '/docs/reference/api'},
          ],
        },
        {
          title: 'NexusDock',
          items: [
            {label: 'Website', href: 'https://www.nexusdock.co'},
            {label: 'NexusDock Cloud', href: 'https://mcp.nexusdock.co'},
            {label: 'NexusDock REST API', href: 'https://mcp.nexusdock.co/docs/api'},
            {label: 'AgentDock source', href: 'https://github.com/uvwt/agentdock'},
            {label: 'Documentation source', href: 'https://github.com/uvwt/agentdock-docs'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} NexusDock. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['bash', 'powershell'],
    },
    ...(algolia ? {algolia} : {}),
  } satisfies Preset.ThemeConfig,
};

export default config;
