import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Конфигурация страниц ────────────────────────────────────────────────────
// При добавлении новой страницы:
//   1. Добавьте объект в этот массив
//   2. Обновите lastmod (YYYY-MM-DD) для изменённых страниц
//   3. Запустите: node scripts/generate-sitemap.js
const pages = [
  {
    url: 'https://huntedlead.ru/',
    changefreq: 'monthly',
    priority: '1.0',
    lastmod: '2026-04-29',
  },
  // Пример добавления новой страницы:
  // {
  //   url: 'https://huntedlead.ru/about/',
  //   changefreq: 'monthly',
  //   priority: '0.8',
  //   lastmod: 'YYYY-MM-DD',
  // },
];
// ────────────────────────────────────────────────────────────────────────────

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

const outputPath = resolve(__dirname, '../sitemap.xml');
writeFileSync(outputPath, buildSitemap(pages), 'utf-8');
console.log(`sitemap.xml обновлён (${pages.length} страниц)`);
