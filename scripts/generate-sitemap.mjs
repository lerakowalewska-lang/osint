import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { get } from 'https';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Статические страницы ────────────────────────────────────────────────────
// Ведутся руками. При добавлении новой статической страницы:
//   1. Добавьте объект в этот массив
//   2. Обновите lastmod (YYYY-MM-DD) для изменённых страниц
//   3. Запустите: node scripts/generate-sitemap.js
//
// Статьи блога сюда НЕ добавляются — они живут в WordPress и подтягиваются
// автоматически через REST API (см. fetchBlogPages ниже).
const staticPages = [
  {
    url: 'https://huntedlead.ru/',
    changefreq: 'monthly',
    priority: '1.0',
    lastmod: '2026-04-29',
  },
  {
    url: 'https://huntedlead.ru/industry-it',
    changefreq: 'monthly',
    priority: '0.9',
    lastmod: '2026-05-18',
  },
  {
    url: 'https://huntedlead.ru/industry-distributors',
    changefreq: 'monthly',
    priority: '0.9',
    lastmod: '2026-05-18',
  },
  {
    url: 'https://huntedlead.ru/industry-manufacturing',
    changefreq: 'monthly',
    priority: '0.9',
    lastmod: '2026-05-18',
  },
  {
    url: 'https://huntedlead.ru/industry-consulting',
    changefreq: 'monthly',
    priority: '0.9',
    lastmod: '2026-05-25',
  },
  {
    url: 'https://huntedlead.ru/industry-hrtech',
    changefreq: 'monthly',
    priority: '0.9',
    lastmod: '2026-05-25',
  },
  {
    url: 'https://huntedlead.ru/industry-logistics',
    changefreq: 'monthly',
    priority: '0.9',
    lastmod: '2026-05-25',
  },
  {
    url: 'https://huntedlead.ru/outreach',
    changefreq: 'monthly',
    priority: '0.9',
    lastmod: '2026-06-11',
  },
];
// ────────────────────────────────────────────────────────────────────────────

const BLOG_INDEX = {
  url: 'https://huntedlead.ru/blog',
  changefreq: 'weekly',
  priority: '0.7',
};

const POSTS_API =
  'https://huntedlead.ru/wp-json/wp/v2/posts?per_page=100&status=publish&_fields=link,modified';

function fetchJson(url) {
  return new Promise((ok, fail) => {
    const req = get(url, { headers: { 'User-Agent': 'huntedlead-sitemap' } }, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        return fail(new Error(`HTTP ${res.statusCode} от ${url}`));
      }
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try {
          ok(JSON.parse(body));
        } catch (e) {
          fail(new Error(`Не разобрать JSON от ${url}: ${e.message}`));
        }
      });
    });
    req.on('error', fail);
    req.setTimeout(20000, () => req.destroy(new Error(`Таймаут при запросе ${url}`)));
  });
}

// Статьи блога берём из WordPress, а не из захардкоженного списка: иначе
// каждая новая публикация требует правки кода, и sitemap молча устаревает —
// ровно так пять перенесённых статей остались в карте после переезда на WP.
async function fetchBlogPages() {
  const posts = await fetchJson(POSTS_API);
  if (!Array.isArray(posts) || posts.length === 0) {
    throw new Error('WordPress вернул пустой список статей');
  }
  const newest = posts
    .map((p) => p.modified)
    .sort()
    .reverse()[0];

  return [
    { ...BLOG_INDEX, lastmod: newest.slice(0, 10) },
    ...posts.map((p) => ({
      url: p.link,
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: p.modified.slice(0, 10),
    })),
  ];
}

function buildSitemap(pages) {
  const urls = pages
    .map(
      ({ url, lastmod, changefreq, priority }) => `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

try {
  const blogPages = await fetchBlogPages();
  const pages = [...staticPages, ...blogPages];
  const outputPath = resolve(__dirname, '../sitemap.xml');
  writeFileSync(outputPath, buildSitemap(pages), 'utf-8');
  console.log(
    `sitemap.xml обновлён: ${pages.length} URL ` +
      `(${staticPages.length} статических + ${blogPages.length} из блога)`
  );
} catch (e) {
  // Падаем громко: молча записанный sitemap без блога хуже, чем отсутствие обновления.
  console.error(`Ошибка: ${e.message}`);
  console.error('sitemap.xml НЕ перезаписан.');
  process.exit(1);
}
