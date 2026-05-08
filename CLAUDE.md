# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**HuntedLead** — статический одностраничный маркетинговый сайт для OSINT-лидогенерации. Развёртывается на Vercel как статика + одна Serverless Function.

## Architecture

Проект минималистичен и не использует фреймворков или систем сборки:

- `index.html` — весь сайт: разметка и весь клиентский JavaScript в одном файле
- `styles/main.css` — все CSS-стили (CSS custom properties, без препроцессоров)
- `api/send-lead.js` — единственная Serverless Function (Vercel), обрабатывает POST-запрос с формы и отправляет заявку в Telegram-бот; использует ES Module синтаксис (`export default`)
- `images/` — изображения для секции features: `разведка.png`, `проверка.png`, `цель.png`
- `logo.svg` — единственный логотип, всегда использовать только его
- `sitemap.xml` / `robots.txt` — SEO-файлы в корне; `robots.txt` статический, `sitemap.xml` генерируется скриптом
- `scripts/generate-sitemap.js` — генератор sitemap: редактировать массив `pages` внутри, затем запустить `node scripts/generate-sitemap.js`

**Data flow заявки (две формы, оба канала):**
```
Форма (index.html) → POST /api/send-lead → Telegram Bot API → Telegram-чат
                   → web3forms API (резервный канал)
```

## Page Structure (section order)

1. `#hero` — Hero
2. `#pain` — Pain points grid
3. `#osint` — Features (OSINT methods), с автопролистыванием через `setInterval` 10 сек
4. `#how` — How it works (шаги)
5. Deeper CTA (без id)
6. `#why` — Bento grid «Почему выбирают нас»
7. `#contacts-info` — Контакты (2-колоночный layout: левая — info, правая — форма)
8. `#faq` — FAQ (2-колоночная сетка, FAQPage JSON-LD schema в `<head>`)
9. `#cases` — Cases
10. `#pricing` — Pricing (3 карточки)
11. `#contact` — Основная форма заявки (CTA секция)

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

## CSS Design Tokens

Все цвета и эффекты через CSS custom properties в `styles/main.css`:

```css
--bg-deep: #06091a          /* основной фон */
--bg-card: rgba(16,22,58,0.6) /* фон карточек */
--accent-blue: #3b7dff      /* основной акцент */
--accent-yellow: #ffd84d    /* жёлтый акцент */
--text-primary: #e8ecf4
--text-secondary: rgba(232,236,244,0.6)
--border: ...               /* слабая граница */
--border-bright: ...        /* яркая граница (синяя) */
```

Шрифты: Onest (заголовки и текст), JetBrains Mono (моно) — Google Fonts.

## Key Implementation Details

**Фоновая анимация** — `<canvas id="bg-canvas">` с 3D-particle эффектом на нативном Canvas API.

**Две независимые формы:**
- `#leadForm` / `#userPhone` / `#userName` → `submitForm()` — основная форма (`#contact`)
- `#contactsLeadForm` / `#contactsPhone` / `#contactsName` → `submitContactsForm()` — форма в секции `#contacts-info`
- Обе функции идентичны по логике, отличаются только ID элементов.

**Телефонная маска** — `keydown`-based (не `input` event), функции `phoneMask(input)` и `setupPhoneMask(input)`:
- Формат `+7 (XXX) XXX-XX-XX`, только российские номера
- Backspace удаляет последнюю цифру из raw-строки, а не символ из форматированной строки
- Валидация: `phone.replace(/\D/g, '').length === 11`
- Применяется к обоим телефонным полям: `#userPhone` и `#contactsPhone`

**Mouse glow эффект** — `.why-card` и `.price-card`: обработчик `mousemove` пишет CSS-переменные `--mouse-x`/`--mouse-y`, `::before`/`::after` использует их в `radial-gradient`. Для `.price-card` — `::after` (т.к. `::before` занят featured-бордером).

**Scroll-reveal анимации** — `IntersectionObserver` с `data-delay` атрибутами на элементах; наблюдает `.feature-item`, `.why-card`, `.contacts-info-right`, `.faq-item` и другие.

**Features slider** — `setInterval` каждые 10 сек переключает активную фичу; клик по `.feature-item` сбрасывает таймер и переключает немедленно.

## Sitemap

При добавлении новой страницы:
1. Добавить объект в массив `pages` в `scripts/generate-sitemap.js`
2. Запустить `node scripts/generate-sitemap.js` — перезапишет `sitemap.xml`
3. Закоммитить оба файла
