import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  label: string;
  title: string;
  description: string;
  to: string;
};

const features: FeatureItem[] = [
  {
    label: 'CONFIG',
    title: '配置与认证',
    description: '统一查看 CLI、环境变量、Bearer Token、OAuth、可信代理和可选能力。',
    to: '/docs/reference/configuration',
  },
  {
    label: 'TOOLS',
    title: '内置工具',
    description: '按文件、命令、Git、任务、浏览器和 Recall 浏览完整工具边界。',
    to: '/docs/reference/tools',
  },
  {
    label: 'SKILLS',
    title: '可移植工作方法',
    description: '用纯文档 Skill 固化流程、约束和经验，真实动作仍由稳定工具执行。',
    to: '/docs/concepts/skills',
  },
  {
    label: 'MCP',
    title: '动态服务接入',
    description: '按需注册外部 MCP，通过搜索、检查 Schema 和调用三步完成安全接入。',
    to: '/docs/concepts/dynamic-mcp',
  },
  {
    label: 'TASKS',
    title: '可恢复任务',
    description: '把目标、步骤、阻塞、进度和验证证据持久化，长任务中断后继续执行。',
    to: '/docs/concepts/tasks',
  },
  {
    label: 'RECALL',
    title: '长期知识召回',
    description: '接入 NexusDock Recall，在重要任务开始时加载可靠上下文与 Runbook。',
    to: '/docs/concepts/recalldock',
  },
];

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
  return (
    <>
      <section className={styles.features}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.kicker}>CLEAR BOUNDARIES</span>
              <Heading as="h2">从连接到执行，每一步都清晰可见</Heading>
            </div>
            <p>
              AgentDock 不把所有能力堆进一个黑盒，而是让工具、Skill、动态 MCP、任务状态和长期知识各司其职。
            </p>
          </div>
          <div className={styles.grid}>
            {features.map((feature) => (
              <Feature key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.quickStart}>
        <div className={`container ${styles.quickStartInner}`}>
          <div>
            <span className={styles.kicker}>GET STARTED</span>
            <Heading as="h2">选择适合当前环境的启动方式</Heading>
            <p>先用 Docker 快速体验，或按平台完成长期部署。</p>
          </div>
          <div className={styles.quickLinks}>
            <Link className={styles.quickPrimary} to="/docs/getting-started/docker">
              Docker 快速开始
              <span aria-hidden="true">→</span>
            </Link>
            <Link className={styles.quickSecondary} to="/docs/intro">
              查看全部文档
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
