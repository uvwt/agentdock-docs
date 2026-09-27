import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
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
      title: translate({id: 'homepage.features.install.title', message: 'Install and connect'}),
      description: translate({
        id: 'homepage.features.install.description',
        message:
          'Follow the macOS, Windows, Linux, or Docker guide, then add the MCP URL to your client.',
      }),
      to: '/docs/getting-started/install',
    },
    {
      label: 'WORK',
      title: translate({id: 'homepage.features.files.title', message: 'Work with files and code'}),
      description: translate({
        id: 'homepage.features.files.description',
        message:
          'Let the agent read projects, run commands, edit files, and operate Git, then verify the real result.',
      }),
      to: '/docs/reference/tools',
    },
    {
      label: 'SKILLS',
      title: translate({id: 'homepage.features.skills.title', message: 'Use Skills'}),
      description: translate({
        id: 'homepage.features.skills.description',
        message:
          'Install trusted Skills and Plugins to add reusable workflows and related tools when you need them.',
      }),
      to: '/docs/concepts/skills',
    },
    {
      label: 'BROWSER',
      title: translate({id: 'homepage.features.browser.title', message: 'Operate a browser'}),
      description: translate({
        id: 'homepage.features.browser.description',
        message:
          'Open pages, click, type, and capture screenshots while checking page, console, and network errors.',
      }),
      to: '/docs/guides/browser-control',
    },
    {
      label: 'MCP',
      title: translate({id: 'homepage.features.mcp.title', message: 'Connect external services'}),
      description: translate({
        id: 'homepage.features.mcp.description',
        message:
          'Connect other MCP services as needed, with credentials kept in isolated environments.',
      }),
      to: '/docs/concepts/dynamic-mcp',
    },
    {
      label: 'TASKS',
      title: translate({id: 'homepage.features.tasks.title', message: 'Track complex tasks'}),
      description: translate({
        id: 'homepage.features.tasks.description',
        message:
          'Save goals, steps, progress, and verification so longer work can continue after an interruption.',
      }),
      to: '/docs/concepts/tasks',
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
  return (
    <div className={styles.nexusPreview} aria-hidden="true">
      <div className={styles.nexusPreviewHeader}>
        <span>NexusDock</span>
        <span className={styles.nexusOnline}>MULTI-DEVICE</span>
      </div>
      <div className={styles.nexusHub}>
        <div className={styles.nexusHubCore}>
          <span className={styles.nexusHubMark}>N</span>
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
                <Translate id="homepage.features.heading">From installation to real work</Translate>
              </Heading>
            </div>
            <p>
              <Translate id="homepage.features.summary">
                Start with installation, then add Skills, Plugins, browser automation, external
                MCP services, and recoverable tasks only when you need them.
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
                  <Translate id="homepage.nexus.install">Install NexusDock</Translate>
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
