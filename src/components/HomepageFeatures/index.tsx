import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  label: string;
  title: string;
  description: string;
  to: string;
};

function getFeatures(): FeatureItem[] {
  return [
    {
      label: 'START',
      title: translate({id: 'homepage.features.install.title', message: 'Install and pair a device'}),
      description: translate({
        id: 'homepage.features.install.description',
        message:
          'Install AgentDock on macOS, Windows, Linux, or Docker, then pair with NexusDock Cloud or connect directly.',
      }),
      to: '/docs/getting-started/install',
    },
    {
      label: 'AI SETUP',
      title: translate({id: 'homepage.features.files.title', message: 'Let AI connect NexusDock'}),
      description: translate({
        id: 'homepage.features.files.description',
        message:
          'Copy one prompt to your AI assistant so it can configure native Remote MCP with OAuth and verify tools for you.',
      }),
      to: '/docs/guides/ai-connect',
    },
    {
      label: 'CLIENTS',
      title: translate({id: 'homepage.features.skills.title', message: 'Connect AI clients'}),
      description: translate({
        id: 'homepage.features.skills.description',
        message:
          'Step-by-step setup for ChatGPT, Claude Desktop, Claude Code, Cursor, VS Code, Codex, and other MCP clients.',
      }),
      to: '/docs/guides/mcp-clients',
    },
    {
      label: 'EVERYDAY',
      title: translate({id: 'homepage.features.browser.title', message: 'Devices, memory & workflows'}),
      description: translate({
        id: 'homepage.features.browser.description',
        message:
          'Organize online devices, keep long-term context in Recall, and reuse proven Workflows across conversations.',
      }),
      to: '/docs/guides/using-nexusdock',
    },
    {
      label: 'CAPABILITIES',
      title: translate({id: 'homepage.features.mcp.title', message: 'Tools, Skills & Browser'}),
      description: translate({
        id: 'homepage.features.mcp.description',
        message:
          'Work with files, commands, Git, browser automation, Skills, Plugins, dynamic MCP servers, and recoverable tasks.',
      }),
      to: '/docs/reference/tools',
    },
    {
      label: 'API',
      title: translate({id: 'homepage.features.tasks.title', message: 'NexusDock REST API'}),
      description: translate({
        id: 'homepage.features.tasks.description',
        message:
          'Integrate scripts, services, and automation via OAuth Device Flow or Bearer tokens with OpenAPI and live docs.',
      }),
      to: '/docs/reference/api',
    },
  ];
}

function Feature({label, title, description, to}: FeatureItem): ReactNode {
  return (
    <Link className={styles.card} to={to}>
      <span className={styles.label}>{label}</span>
      <Heading as="h3" className={styles.title}>
        {title}
      </Heading>
      <p className={styles.description}>{description}</p>
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </Link>
  );
}


function NexusDockPreview(): ReactNode {
  const brandIconUrl = useBaseUrl('/img/nexusdock-icon.png');

  return (
    <div className={styles.nexusPreview} aria-hidden="true">
      <div className={styles.nexusPreviewHeader}>
        <span>NexusDock</span>
        <span className={styles.nexusOnline}>MULTI-DEVICE</span>
      </div>
      <div className={styles.nexusHub}>
        <div className={styles.nexusHubCore}>
          <span className={styles.nexusHubMark}>
            <img src={brandIconUrl} alt="" width={28} height={28} />
          </span>
          <div>
            <strong>NexusDock</strong>
            <span>ONE MCP ENDPOINT</span>
          </div>
        </div>
        <div className={styles.nexusNodes}>
          <div><span>●</span><strong>Mac</strong><small>AgentDock</small></div>
          <div><span>●</span><strong>Windows</strong><small>AgentDock</small></div>
          <div><span>●</span><strong>Linux</strong><small>AgentDock</small></div>
        </div>
      </div>
      <div className={styles.nexusShared}>
        <div><span>01</span><strong>Recall</strong><small>MEMORY</small></div>
        <div><span>02</span><strong>Workflow</strong><small>SHARED DATA</small></div>
        <div><span>03</span><strong>MCP</strong><small>ONE ENDPOINT</small></div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  const features = getFeatures();

  return (
    <>
      <section className={styles.features}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.kicker}>WHAT YOU CAN DO</span>
              <Heading as="h2">
                <Translate id="homepage.features.heading">Everything in one documentation hub</Translate>
              </Heading>
            </div>
            <p>
              <Translate id="homepage.features.summary">
                Start by installing AgentDock and connecting your AI client, then explore everyday
                NexusDock workflows, Skills, browser automation, operations, and REST APIs.
              </Translate>
            </p>
          </div>
          <div className={styles.grid}>
            {features.map((feature) => (
              <Feature key={feature.label} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.nexusSection}>
        <div className="container">
          <div className={styles.nexusGrid}>
            <div className={styles.nexusCopy}>
              <span className={styles.kicker}>NEXUSDOCK</span>
              <Heading as="h2">
                <Translate id="homepage.nexus.heading">One MCP, multiple devices</Translate>
              </Heading>
              <p className={styles.nexusTagline}>
                <strong>
                  <Translate id="homepage.nexus.tagline">Share Recall memory and Workflow data</Translate>
                </strong>
              </p>
              <p>
                <Translate id="homepage.nexus.summary">
                  Bring AgentDock on Mac, Windows, Linux, and servers into one NexusDock and manage
                  device status in one place.
                </Translate>
              </p>
              <div className={styles.nexusActions}>
                <Link className={styles.quickPrimary} to="/docs/concepts/nexusdock">
                  <Translate id="homepage.nexus.explore">Explore NexusDock</Translate>
                  <span aria-hidden="true">→</span>
                </Link>
                <Link className={styles.quickSecondary} to="/docs/operations/nexusdock">
                  <Translate id="homepage.nexus.install">Self-host NexusDock</Translate>
                </Link>
              </div>
            </div>
            <NexusDockPreview />
          </div>

          <div className={styles.nexusCapabilities}>
            <div>
              <span>01</span>
              <strong>
                <Translate id="homepage.nexus.capability.mcp.title">One MCP endpoint</Translate>
              </strong>
              <p>
                <Translate id="homepage.nexus.capability.mcp.description">
                  Connect the AI client once and reach multiple AgentDock devices through NexusDock.
                </Translate>
              </p>
            </div>
            <div>
              <span>02</span>
              <strong>
                <Translate id="homepage.nexus.capability.devices.title">Manage devices together</Translate>
              </strong>
              <p>
                <Translate id="homepage.nexus.capability.devices.description">
                  See connected devices and their current status from one web console.
                </Translate>
              </p>
            </div>
            <div>
              <span>03</span>
              <strong>
                <Translate id="homepage.nexus.capability.data.title">Share Recall and Workflow data</Translate>
              </strong>
              <p>
                <Translate id="homepage.nexus.capability.data.description">
                  Reuse long-term memory and repeatable workflows across your AgentDock devices.
                </Translate>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
