# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.


## Project Overview

**HuntedLead** — многостраничный маркетинговый сайт для OSINT-лидогенерации. Развёртывается на Vercel как статика + одна Serverless Function. Сайт SEO-оптимизирован: отраслевые страницы под ключевые запросы, JSON-LD схемы, canonical URL, sitemap.

## Architecture

Проект минималистичен и не использует фреймворков или систем сборки:

- `index.html` — главная страница: разметка и весь клиентский JavaScript в одном файле
- `industry-it.html` — отраслевая страница для IT-компаний и SaaS (`/industry-it`)
- `404.html` — кастомная страница ошибки 404 (помечена `noindex`)
- `styles/main.css` — все CSS-стили (CSS custom properties, без препроцессоров); используется на всех страницах
- `api/send-lead.js` — единственная Serverless Function (Vercel), обрабатывает POST-запрос с формы и отправляет заявку в Telegram-бот; использует ES Module синтаксис (`export default`)
- `images/` — изображения для секции features: `разведка.png`, `проверка.png`, `цель.png`
- `logo.svg` — единственный логотип, всегда использовать только его
- `sitemap.xml` / `robots.txt` — SEO-файлы в корне; `robots.txt` статический, `sitemap.xml` генерируется скриптом
- `scripts/generate-sitemap.js` — генератор sitemap: редактировать массив `pages` внутри, затем запустить `node scripts/generate-sitemap.js`

**Data flow заявки (форма на каждой странице):**
```
Форма (любая страница) → POST /api/send-lead → Telegram Bot API → Telegram-чат
                       → web3forms API (резервный канал)
```
Поле `source` в теле запроса передаёт идентификатор страницы (например `'industry-it'`), чтобы в Telegram было видно, откуда пришла заявка.

## Pages

| Файл | URL | Статус | Индексация |
|---|---|---|---|
| `index.html` | `/` | Живая | Да |
| `industry-it.html` | `/industry-it` | Живая | Да |
| `404.html` | `/404` | Живая | Нет (noindex) |

### Структура главной страницы (`index.html`)

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

### Структура отраслевых страниц (`industry-*.html`)

Шаблон страницы для конкретной отрасли. Секции:
1. `#hero` — Hero с отраслевым H1 и подзаголовком
2. `#pain` — Pain points, специфичные для отрасли
3. `#osint` — Features slider (3 фичи, те же изображения)
4. `#how` — How it works (шаги, адаптированный пример для отрасли)
5. Deeper CTA (без id)
6. `#services` — Услуги (`.services-grid` с `.service-card`)
7. `#why` — Why us (bento grid)
8. `#faq` — FAQ, специфичный для отрасли
9. `#pricing` — Pricing (те же 3 тарифа)
10. `#contact` — Форма заявки

**SEO на отраслевых страницах:**
- Уникальные `<title>`, `<meta description>`, Open Graph теги
- `<link rel="canonical">` на саму страницу
- JSON-LD: `FAQPage` + `BreadcrumbList` + `ProfessionalService`
- `source` в форме = slug страницы (например `'industry-it'`)

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

**Формы на главной (index.html) — две независимые:**
- `#leadForm` / `#userPhone` / `#userName` → `submitForm()` — основная форма (`#contact`)
- `#contactsLeadForm` / `#contactsPhone` / `#contactsName` → `submitContactsForm()` — форма в секции `#contacts-info`
- Обе функции идентичны по логике, отличаются только ID элементов.

**Форма на отраслевых страницах — одна:**
- `#leadForm` / `#userPhone` / `#userName` → `submitForm()` — единственная форма в `#contact`
- Передаёт `source: 'industry-it'` (или slug конкретной страницы) в тело запроса `/api/send-lead`

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
