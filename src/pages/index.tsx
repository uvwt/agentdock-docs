import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import styles from './index.module.css';

function HomepageHeader(): ReactNode {
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <p className={styles.eyebrow}>AGENT TOOL RUNTIME</p>
        <Heading as="h1" className={styles.heroTitle}>
          AgentDock
        </Heading>
        <p className={styles.heroSubtitle}>
          让 Agent 安全、可恢复地操作本地与远程环境。
        </p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            阅读文档
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started/docker">
            快速开始
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="AgentDock 文档"
      description="AgentDock 官方文档：安装、Skill、动态 MCP、可恢复任务、RecallDock 与自动化。">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
