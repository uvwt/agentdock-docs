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
    label: 'START',
    title: '安装并连接',
    description: '按 macOS、Windows、Linux 或 Docker 指南完成安装，并把 MCP 地址填入客户端。',
    to: '/docs/getting-started/install',
  },
  {
    label: 'WORK',
    title: '处理文件和代码',
    description: '让 Agent 读取项目、执行命令、修改文件并操作 Git，完成后提供真实验证。',
    to: '/docs/reference/tools',
  },
  {
    label: 'SKILLS',
    title: '使用 Skill',
    description: '安装可信 Skill，把成熟工作方法、依赖和安全边界交给 Agent 使用。',
    to: '/docs/concepts/skills',
  },
  {
    label: 'BROWSER',
    title: '操作浏览器',
    description: '打开网页、点击、输入、截图，并同时检查页面、控制台和网络错误。',
    to: '/docs/guides/browser-control',
  },
  {
    label: 'MCP',
    title: '连接外部服务',
    description: '按需接入其他 MCP Server，凭据放在独立环境中，不写入注册信息。',
    to: '/docs/concepts/dynamic-mcp',
  },
  {
    label: 'TASKS',
    title: '跟踪复杂任务',
    description: '保存目标、步骤、进度和验证结果，中断后继续，不把“执行结束”误当成完成。',
    to: '/docs/concepts/tasks',
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
              <span className={styles.kicker}>WHAT YOU CAN DO</span>
              <Heading as="h2">从安装到完成真实任务</Heading>
            </div>
            <p>
              先完成最短安装，再按需要启用 Skill、浏览器、外部 MCP 和长期任务能力。
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
            <Heading as="h2">按当前系统完成安装</Heading>
            <p>普通用户优先选择 macOS、Windows 或 Linux 原生安装；已经使用 Docker 时再选择容器方式。</p>
          </div>
          <div className={styles.quickLinks}>
            <Link className={styles.quickPrimary} to="/docs/getting-started/install">
              选择安装方式
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
