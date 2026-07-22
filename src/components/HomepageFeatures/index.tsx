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
          'Install trusted Skills so agents can follow proven workflows, dependencies, and safety boundaries.',
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
          'Connect additional MCP servers on demand and keep credentials in isolated environments instead of registry data.',
      }),
      to: '/docs/concepts/dynamic-mcp',
    },
    {
      label: 'TASKS',
      title: translate({id: 'homepage.features.tasks.title', message: 'Track complex tasks'}),
      description: translate({
        id: 'homepage.features.tasks.description',
        message:
          'Persist goals, steps, progress, and verification so interrupted work can continue without mistaking execution for completion.',
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
                Start with the shortest installation path, then enable Skills, browser automation,
                external MCP servers, and long-running tasks as needed.
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

      <section className={styles.quickStart}>
        <div className={`container ${styles.quickStartInner}`}>
          <div>
            <span className={styles.kicker}>GET STARTED</span>
            <Heading as="h2">
              <Translate id="homepage.quickStart.heading">Install for your current system</Translate>
            </Heading>
            <p>
              <Translate id="homepage.quickStart.summary">
                Most users should choose the native macOS, Windows, or Linux installer. Choose the
                container option when Docker is already part of your environment.
              </Translate>
            </p>
          </div>
          <div className={styles.quickLinks}>
            <Link className={styles.quickPrimary} to="/docs/getting-started/install">
              <Translate id="homepage.quickStart.chooseInstall">Choose an installation</Translate>
              <span aria-hidden="true">→</span>
            </Link>
            <Link className={styles.quickSecondary} to="/docs/intro">
              <Translate id="homepage.quickStart.allDocs">Browse all documentation</Translate>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
