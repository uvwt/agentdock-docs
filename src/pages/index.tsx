import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import styles from './index.module.css';

function RuntimePreview(): ReactNode {
  return (
    <div
      className={styles.previewShell}
      aria-label={translate({
        id: 'homepage.runtimePreview.ariaLabel',
        message: 'AgentDock task execution preview',
      })}>
      <div className={styles.previewGlow} />
      <div className={styles.previewCard}>
        <div className={styles.previewHeader}>
          <div className={styles.windowDots} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <span className={styles.previewTitle}>AgentDock Runtime</span>
          <span className={styles.statusBadge}>
            <span className={styles.statusDot} /> connected
          </span>
        </div>

        <div className={styles.previewBody}>
          <div className={styles.taskHeading}>
            <div>
              <span className={styles.taskLabel}>ACTIVE TASK</span>
              <strong>
                <Translate id="homepage.runtimePreview.taskTitle">
                  Update the project and verify the result
                </Translate>
              </strong>
            </div>
            <span className={styles.progress}>3 / 4</span>
          </div>

          <div className={styles.stepList}>
            <div className={styles.stepDone}>
              <span className={styles.stepIcon}>✓</span>
              <span>
                <Translate id="homepage.runtimePreview.inspectEnvironment">
                  Inspect the real environment
                </Translate>
              </span>
              <code>read_file</code>
            </div>
            <div className={styles.stepDone}>
              <span className={styles.stepIcon}>✓</span>
              <span>
                <Translate id="homepage.runtimePreview.applyChanges">
                  Apply the code changes
                </Translate>
              </span>
              <code>file_edit</code>
            </div>
            <div className={styles.stepDone}>
              <span className={styles.stepIcon}>✓</span>
              <span>
                <Translate id="homepage.runtimePreview.runChecks">
                  Run tests and builds
                </Translate>
              </span>
              <code>exec_command</code>
            </div>
            <div className={styles.stepCurrent}>
              <span className={styles.currentPulse} />
              <span>
                <Translate id="homepage.runtimePreview.publishAndVerify">
                  Publish and verify the result
                </Translate>
              </span>
              <code>browser_snapshot</code>
            </div>
          </div>

          <div className={styles.previewFooter}>
            <span>
              <Translate id="homepage.runtimePreview.statePersisted">
                Task state persisted
              </Translate>
            </span>
            <span className={styles.resumeText}>
              <Translate id="homepage.runtimePreview.resumeAnytime">
                Resume at any time →
              </Translate>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomepageHeader(): ReactNode {
  return (
    <header className={styles.hero}>
      <div className={styles.heroBackdrop} aria-hidden="true" />
      <div className={`container ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            LOCAL & REMOTE AGENT TOOLS
          </div>
          <Heading as="h1" className={styles.heroTitle}>
            <Translate id="homepage.hero.titleLine1">Let agents</Translate>
            <span>
              <Translate id="homepage.hero.titleLine2">finish real work</Translate>
            </span>
          </Heading>
          <p className={styles.heroSubtitle}>
            <Translate id="homepage.hero.subtitle">
              Connect an MCP-compatible AI client to your computers and servers, then use files,
              commands, Git, browsers, and external services through explicit tool boundaries.
            </Translate>
          </p>
          <div className={styles.actions}>
            <Link className={styles.primaryAction} to="/docs/getting-started/install">
              <Translate id="homepage.hero.chooseInstall">Choose an installation</Translate>
              <span aria-hidden="true">→</span>
            </Link>
            <Link className={styles.secondaryAction} to="/docs/intro">
              <Translate id="homepage.hero.exploreFeatures">Explore the features</Translate>
            </Link>
          </div>
          <div className={styles.proofRow}>
            <div>
              <strong>30</strong>
              <span>
                <Translate id="homepage.hero.builtInTools">built-in tools</Translate>
              </span>
            </div>
            <div>
              <strong>
                <Translate id="homepage.hero.recoverable">Recoverable</Translate>
              </strong>
              <span>
                <Translate id="homepage.hero.taskState">task state</Translate>
              </span>
            </div>
            <div>
              <strong>
                <Translate id="homepage.hero.crossPlatform">Cross-platform</Translate>
              </strong>
              <span>
                <Translate id="homepage.hero.localAndRemote">local and remote</Translate>
              </span>
            </div>
          </div>
        </div>
        <RuntimePreview />
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title={translate({id: 'homepage.meta.title', message: 'AgentDock documentation'})}
      description={translate({
        id: 'homepage.meta.description',
        message:
          'Official AgentDock documentation for installation, MCP clients, Skills, browser automation, and external MCP servers.',
      })}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
