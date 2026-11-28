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
        message: 'NexusDock and AgentDock task execution preview',
      })}>
      <div className={styles.previewGlow} />
      <div className={styles.previewCard}>
        <div className={styles.previewHeader}>
          <div className={styles.windowDots} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <span className={styles.previewTitle}>NexusDock · AgentDock</span>
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
            NEXUSDOCK CLOUD & AGENTDOCK DOCS
          </div>
          <Heading as="h1" className={styles.heroTitle}>
            <Translate id="homepage.hero.titleLine1">Connect your AI</Translate>
            <span>
              <Translate id="homepage.hero.titleLine2">to your real devices</Translate>
            </span>
          </Heading>
          <p className={styles.heroSubtitle}>
            <Translate id="homepage.hero.subtitle">
              Unified documentation for NexusDock Cloud and AgentDock: install on Mac, Windows,
              Linux, or Docker, connect ChatGPT, Claude, or Cursor over Remote MCP, and share
              long-term memory and reusable workflows.
            </Translate>
          </p>
          <div className={styles.actions}>
            <Link className={styles.primaryAction} to="/docs/getting-started/install">
              <Translate id="homepage.hero.chooseInstall">Get started</Translate>
              <span aria-hidden="true">→</span>
            </Link>
            <Link className={styles.secondaryAction} to="/docs/guides/ai-connect">
              <Translate id="homepage.hero.exploreFeatures">Let AI connect for you</Translate>
            </Link>
          </div>
          <div className={styles.proofRow}>
            <div>
              <strong>
                <Translate id="homepage.hero.builtIn">NexusDock</Translate>
              </strong>
              <span>
                <Translate id="homepage.hero.builtInTools">one Remote MCP hub</Translate>
              </span>
            </div>
            <div>
              <strong>
                <Translate id="homepage.hero.recoverable">AgentDock</Translate>
              </strong>
              <span>
                <Translate id="homepage.hero.taskState">multi-platform runtime</Translate>
              </span>
            </div>
            <div>
              <strong>
                <Translate id="homepage.hero.crossPlatform">Recall & Flow</Translate>
              </strong>
              <span>
                <Translate id="homepage.hero.localAndRemote">shared memory & routines</Translate>
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
      title={translate({id: 'homepage.meta.title', message: 'NexusDock Docs'})}
      description={translate({
        id: 'homepage.meta.description',
        message:
          'Official unified documentation for NexusDock Cloud and AgentDock: device installation, AI client connections, Recall memory, Workflows, built-in tools, and REST API.',
      })}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
