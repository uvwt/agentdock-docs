import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import styles from './index.module.css';

function RuntimePreview(): ReactNode {
  return (
    <div className={styles.previewShell} aria-label="AgentDock 任务执行预览">
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
              <strong>更新项目并完成验证</strong>
            </div>
            <span className={styles.progress}>3 / 4</span>
          </div>

          <div className={styles.stepList}>
            <div className={styles.stepDone}>
              <span className={styles.stepIcon}>✓</span>
              <span>检查真实环境</span>
              <code>read_file</code>
            </div>
            <div className={styles.stepDone}>
              <span className={styles.stepIcon}>✓</span>
              <span>实施代码修改</span>
              <code>file_edit</code>
            </div>
            <div className={styles.stepDone}>
              <span className={styles.stepIcon}>✓</span>
              <span>执行测试与构建</span>
              <code>exec_command</code>
            </div>
            <div className={styles.stepCurrent}>
              <span className={styles.currentPulse} />
              <span>发布并验证结果</span>
              <code>browser_snapshot</code>
            </div>
          </div>

          <div className={styles.previewFooter}>
            <span>任务状态已持久化</span>
            <span className={styles.resumeText}>随时可恢复 →</span>
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
            LOCAL & REMOTE AGENT RUNTIME
          </div>
          <Heading as="h1" className={styles.heroTitle}>
            让 Agent
            <span>真正完成工作</span>
          </Heading>
          <p className={styles.heroSubtitle}>
            AgentDock 为文件、命令、Git、浏览器和外部服务提供清晰的工具边界，
            并让长任务保持可追踪、可恢复、可验证。
          </p>
          <div className={styles.actions}>
            <Link className={styles.primaryAction} to="/docs/getting-started/docker">
              开始使用
              <span aria-hidden="true">→</span>
            </Link>
            <Link className={styles.secondaryAction} to="/docs/reference/tools">
              浏览工具
            </Link>
          </div>
          <div className={styles.proofRow}>
            <div>
              <strong>30</strong>
              <span>内置工具</span>
            </div>
            <div>
              <strong>可恢复</strong>
              <span>任务状态</span>
            </div>
            <div>
              <strong>MCP</strong>
              <span>原生协议</span>
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
      title="AgentDock 文档"
      description="AgentDock 官方文档：安装、配置、工具、Skill、动态 MCP、可恢复任务与 NexusDock Recall。">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
