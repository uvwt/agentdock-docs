import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';

const englishRoot = path.resolve('docs');
const chineseRoot = path.resolve('i18n/zh-CN/docusaurus-plugin-content-docs/current');
const executableFenceLanguages = new Set([
  'bash',
  'sh',
  'shell',
  'powershell',
  'json',
  'yaml',
  'yml',
  'ini',
  'dotenv',
  'http',
  'caddyfile',
]);

async function listMarkdownFiles(root, current = '') {
  const entries = await readdir(path.join(root, current), {withFileTypes: true});
  const files = [];

  for (const entry of entries) {
    const relativePath = path.posix.join(current, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(root, relativePath)));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(relativePath);
    }
  }

  return files.sort();
}

function parseMarkdown(source) {
  const lines = source.split(/\r?\n/);
  const headings = [];
  const fences = [];
  const links = [];
  const frontmatterKeys = [];
  let inFrontmatter = lines[0] === '---';
  let frontmatterClosed = !inFrontmatter;
  let activeFence = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (inFrontmatter && index > 0) {
      if (line === '---') {
        inFrontmatter = false;
        frontmatterClosed = true;
      } else {
        const key = line.match(/^([A-Za-z0-9_-]+):/u)?.[1];
        if (key) frontmatterKeys.push(key);
      }
      continue;
    }

    const fenceMatch = line.match(/^```([^\s`]*)/u);
    if (fenceMatch) {
      if (activeFence) {
        fences.push(activeFence);
        activeFence = null;
      } else {
        activeFence = {language: fenceMatch[1], body: []};
      }
      continue;
    }

    if (activeFence) {
      activeFence.body.push(line);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+/u);
    if (heading) headings.push(heading[1].length);

    for (const match of line.matchAll(/\[[^\]]*\]\(([^)]+)\)/gu)) {
      const target = match[1].trim().replace(/^<|>$/gu, '').split('#', 1)[0];
      if (target) links.push(target);
    }

  }

  if (activeFence) throw new Error('unclosed code fence');
  if (!frontmatterClosed) throw new Error('unclosed frontmatter');

  const technicalTokenPatterns = [
    /\bAGENTDOCK_[A-Z0-9_*]+\b/gu,
    /\b(?:agentdock_context|browser_[a-z0-9_*]+|exec_command|file_edit|file_publish|git_read|git_write|list_dir|list_files|mcp_manage|mcp_tool_call|mcp_tool_inspect|mcp_tool_search|private_note_manage|read_file|recall_[a-z0-9_*]+|search_text|server_info|session_act|session_observe|skill_package|task_manage|view_image|workflow_template_manage)\b/gu,
  ];
  const technicalTokens = technicalTokenPatterns
    .flatMap((pattern) => [...source.matchAll(pattern)].map(([token]) => token))
    .sort();

  return {
    frontmatterKeys,
    headings,
    fenceLanguages: fences.map(({language}) => language),
    executableFences: fences
      .filter(({language}) => executableFenceLanguages.has(language))
      .map(({language, body}) => {
        const normalizedBody = body
          .map((line) => {
            if (line.trimStart().startsWith('#')) return '#';
            return line
              .replace(/<[^>]+>/gu, '<placeholder>')
              .replace(/\s+#\s+.*$/u, '');
          })
          .join('\n');
        return `${language}\n${normalizedBody}`;
      }),
    links,
    technicalTokens,
  };
}

function assertEqual(label, relativePath, english, chinese, failures) {
  if (JSON.stringify(english) === JSON.stringify(chinese)) return;
  failures.push(`${relativePath}: ${label} differs`);
}

async function comparePair(relativePath, englishPath, chinesePath, failures, options = {}) {
  const [englishSource, chineseSource] = await Promise.all([
    readFile(englishPath, 'utf8'),
    readFile(chinesePath, 'utf8'),
  ]);
  const english = parseMarkdown(englishSource);
  const chinese = parseMarkdown(chineseSource);

  assertEqual('frontmatter keys', relativePath, english.frontmatterKeys, chinese.frontmatterKeys, failures);
  assertEqual('heading levels', relativePath, english.headings, chinese.headings, failures);
  assertEqual('code-fence languages', relativePath, english.fenceLanguages, chinese.fenceLanguages, failures);
  assertEqual('executable code blocks', relativePath, english.executableFences, chinese.executableFences, failures);
  if (options.compareLinks !== false) {
    assertEqual('link targets', relativePath, english.links, chinese.links, failures);
  }
  assertEqual('technical tokens', relativePath, english.technicalTokens, chinese.technicalTokens, failures);
}

const [englishFiles, chineseFiles] = await Promise.all([
  listMarkdownFiles(englishRoot),
  listMarkdownFiles(chineseRoot),
]);
const failures = [];
assertEqual('document file paths', 'docs', englishFiles, chineseFiles, failures);

for (const relativePath of englishFiles) {
  if (!chineseFiles.includes(relativePath)) continue;
  await comparePair(
    relativePath,
    path.join(englishRoot, relativePath),
    path.join(chineseRoot, relativePath),
    failures,
  );
}

await comparePair(
  'README',
  path.resolve('README.md'),
  path.resolve('README.zh-CN.md'),
  failures,
  {compareLinks: false},
);

if (failures.length > 0) {
  console.error('i18n consistency check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`i18n consistency check passed: ${englishFiles.length} document pairs and README`);
}
