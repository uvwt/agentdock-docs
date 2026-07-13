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
    title: '统一工具边界',
    description: '文件、命令、Git、浏览器和桌面能力采用明确接口，便于审计、验证和长期维护。',
    to: '/docs/intro',
  },
  {
    number: '02',
    title: 'Skill 与动态 MCP',
    description: 'Skill 描述可移植流程，动态 MCP 承载外部服务能力，两者职责清晰且互不混杂。',
    to: '/docs/concepts/skills',
  },
  {
    number: '03',
    title: '任务与长期召回',
    description: '把多步骤任务进度和验证证据持久化，并通过 NexusDock Recall 复用可靠经验。',
    to: '/docs/concepts/tasks',
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
