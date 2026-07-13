import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  number: string;
  title: string;
  description: string;
  to: string;
};

const features: FeatureItem[] = [
  {
    number: '01',
    title: '工具能力',
    description: '按文件、命令、Git、任务、Skill、动态 MCP、浏览器和 Recall 浏览全部内置工具。',
    to: '/docs/reference/tools',
  },
  {
    number: '02',
    title: '配置参考',
    description: '查看环境变量、CLI 参数、认证、NexusDock、浏览器和独立环境配置。',
    to: '/docs/reference/configuration',
  },
  {
    number: '03',
    title: '扩展与恢复',
    description: '通过 Skill、动态 MCP、可恢复任务和 NexusDock Recall 组织长期工作流。',
    to: '/docs/concepts/skills',
  },
];

function Feature({number, title, description, to}: FeatureItem): ReactNode {
  return (
    <article className={styles.card}>
      <span className={styles.number}>{number}</span>
      <Heading as="h2" className={styles.title}>
        {title}
      </Heading>
      <p className={styles.description}>{description}</p>
      <Link className={styles.link} to={to}>
        了解更多 →
      </Link>
    </article>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.grid}>
          {features.map((feature) => (
            <Feature key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
