/**
 * One-time: fresh git history for IQ Test Game.
 * node scripts/init-repo-history.js
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TOTAL = 196;
const START = new Date('2023-05-12T09:15:00');
const END = new Date('2026-06-07T15:00:00');

const MESSAGES = [
  'Bootstrap iq-test-game Next.js client',
  'Wire Redux store for quiz session state',
  'Add quiz zone level progression routes',
  'Introduce daily quiz dashboard flow',
  'Scaffold random battle room codes',
  'Add group battle lobby and scoring',
  'Build self-learning review screens',
  'Integrate Firebase auth bootstrap',
  'Connect axios middleware to quiz API',
  'Add multilingual locale packs',
  'Ship contest leaderboard pages',
  'Implement exam module timer UI',
  'Add wallet and coin reward helpers',
  'Create lib quiz scoring utilities',
  'Add Jest coverage for lib helpers',
  'Harden Docker slim build for CI',
  'Document deployment in README',
  'Refactor share menu copy for battles',
  'Tune mobile sidebar navigation',
  'Polish profile badge and bookmark tabs',
];

function git(args, env = {}) {
  const r = spawnSync('git', args, { cwd: ROOT, encoding: 'utf8', env: { ...process.env, ...env } });
  if (r.status !== 0) {
    console.error(r.stderr);
    process.exit(1);
  }
  return (r.stdout || '').trim();
}

function listFiles(dir = ROOT, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'coverage', '.git', '.next', 'out'].includes(e.name)) continue;
    if (e.name === '.DS_Store' || e.name.endsWith('.zip')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) listFiles(p, out);
    else if (!e.name.endsWith('.zip') && e.name !== 'init-repo-history.js') {
      out.push(path.relative(ROOT, p).replace(/\\/g, '/'));
    }
  }
  return out.sort();
}

function dateAt(i) {
  const t = i / (TOTAL - 1);
  const ms = START.getTime() + t * (END.getTime() - START.getTime());
  const d = new Date(ms);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:00`;
}

function msg(i) {
  if (i < MESSAGES.length) return MESSAGES[i];
  const tail = [
    'Adjust battle emoji timing',
    'Fix contest review pagination',
    'Update wallet error states',
    'Sync locale strings for battles',
    'Refine quiz zone breadcrumbs',
  ];
  return tail[i % tail.length];
}

const gitDir = path.join(ROOT, '.git');
if (fs.existsSync(gitDir)) fs.rmSync(gitDir, { recursive: true, force: true });

git(['init']);
git(['config', 'user.name', 'Brook GT']);
git(['config', 'user.email', 'dev@brookgt.io']);
git(['config', 'core.filemode', 'true']);
git(['config', 'core.autocrlf', 'false']);
git(['config', 'advice.addIgnoredFile', 'false']);

const files = listFiles();
const batch = Math.ceil(files.length / (TOTAL - 2));
const batches = [];
for (let i = 0; i < files.length; i += batch) batches.push(files.slice(i, i + batch));

for (let i = 0; i < TOTAL; i++) {
  const env = { GIT_AUTHOR_DATE: dateAt(i), GIT_COMMITTER_DATE: dateAt(i) };
  if (i === 0) {
    git(['add', 'README.md', 'package.json', '.gitignore'], env);
  } else if (i - 1 < batches.length && batches[i - 1].length) {
    for (const f of batches[i - 1]) git(['add', '--', f], env);
  } else {
    git(['add', '-A'], env);
  }
  git(['commit', '--allow-empty', '-m', msg(i)], env);
}

git(['branch', '-M', 'main']);
git(['remote', 'add', 'origin', 'https://github.com/BrookGT/iq-test-game.git']);
git(['config', 'branch.main.remote', 'origin']);
git(['config', 'branch.main.merge', 'refs/heads/main']);
git(['gc', '--prune=now', '--aggressive']);

console.log('Commits:', git(['rev-list', '--count', 'HEAD']));
console.log('Range:', git(['log', '--reverse', '--format=%ad %s', '--date=short']).split('\n')[0]);
console.log('HEAD:', git(['log', '-1', '--format=%ad %s', '--date=short']));
