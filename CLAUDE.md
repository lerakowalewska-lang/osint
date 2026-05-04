# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**HuntedLead** — статический одностраничный маркетинговый сайт для OSINT-лидогенерации. Развёртывается на Vercel как статика + одна Serverless Function.

## Architecture

Проект минималистичен и не использует фреймворков или систем сборки:

- `index.html` — весь сайт: разметка, стили-переменные и весь клиентский JavaScript в одном файле
- `styles/main.css` — все CSS-стили (CSS custom properties, без препроцессоров)
- `api/send-lead.js` — единственная Serverless Function (Vercel), обрабатывает POST-запрос с формы и отправляет заявку в Telegram-бот
- `sitemap.xml` / `robots.txt` — SEO-файлы в корне; `robots.txt` статический, `sitemap.xml` генерируется скриптом
- `scripts/generate-sitemap.js` — генератор sitemap: редактировать массив `pages` внутри, затем запустить `node scripts/generate-sitemap.js`

**Data flow заявки:**
```
Форма (index.html) → POST /api/send-lead → Telegram Bot API → Telegram-чат
```

## Development

Нет системы сборки и пакетных зависимостей. Для локальной разработки:

```bash
# Установить Vercel CLI (один раз)
npm i -g vercel

# Запустить локальный dev-сервер с поддержкой /api/ маршрутов
vercel dev
```

Без Vercel CLI можно открывать `index.html` напрямую в браузере — всё работает, кроме отправки формы (нет `/api/`).

## Environment Variables

Для работы функции `api/send-lead.js` нужны переменные окружения (задаются в Vercel Dashboard или `.env.local` для `vercel dev`):

| Переменная | Описание |
|---|---|
| `TG_BOT_TOKEN` | Токен Telegram-бота |

`TG_CHAT_ID` захардкожен в `api/send-lead.js` — `-5268453636`.

## Key Implementation Details

- Фоновая анимация — `<canvas id="bg-canvas">` с WebGL-подобным 3D-particle эффектом, реализована через нативный Canvas API в `index.html`
- Форма собирает только **имя** (`#userName`) и **телефон** (`#userPhone`), отправляет через `fetch('/api/send-lead', { method: 'POST' })`
- `api/send-lead.js` использует ES Module синтаксис (`export default`) — это важно для совместимости с Vercel
- Шрифты подключаются через Google Fonts: Outfit (заголовки), Space Grotesk (текст), JetBrains Mono (моно)

## Sitemap

При добавлении новой страницы:
1. Добавить объект в массив `pages` в `scripts/generate-sitemap.js`
2. Запустить `node scripts/generate-sitemap.js` — перезапишет `sitemap.xml`
3. Закоммитить оба файла
