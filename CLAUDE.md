# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.


## Project Overview

**HuntedLead** — многостраничный маркетинговый сайт для OSINT-лидогенерации. Хостится на Beget (Apache + PHP): статические HTML-страницы, один PHP-обработчик формы и WordPress в подпапке под блог. Маршрутизация — через `.htaccess`. Сайт SEO-оптимизирован: отраслевые страницы под ключевые запросы, JSON-LD схемы, canonical URL, sitemap.

> `vercel.json` в корне — рудимент от прежнего хостинга и ни на что не влияет. Реальная маршрутизация описана только в `.htaccess`.

## Architecture

Проект минималистичен и не использует фреймворков или систем сборки:

- `index.html` — главная страница: разметка и весь клиентский JavaScript в одном файле
- `industry-*.html` — шесть отраслевых страниц (`it`, `manufacturing`, `distributors`, `consulting`, `hrtech`, `logistics`)
- `outreach.html` — страница услуги аутрича (`/outreach`)
- `wp-blog/` — WordPress под блог; в git лежит только кастомная тема `wp-content/themes/huntedlead`
- `404.html` — кастомная страница ошибки 404 (помечена `noindex`)
- `styles/main.css` — все CSS-стили (CSS custom properties, без препроцессоров); используется на всех страницах
- `api/send-lead.php` — обработчик формы: принимает POST и отправляет заявку в Telegram-бот. Токен — в `api/tg-config.php` (в git только `tg-config.example.php`)
- `images/` — `osint-razvedka.webp`, `osint-proverka.webp`, `osint-cel.webp` для секции features (WebP с альфа-каналом, 1000×1000); `images/og/` — карточки og:image 1200×630 для коммерческих страниц
- `logo.svg` — единственный логотип, всегда использовать только его
- `sitemap.xml` / `robots.txt` — SEO-файлы в корне; `robots.txt` статический, `sitemap.xml` генерируется скриптом
- `scripts/generate-sitemap.mjs` — генератор sitemap. Статические страницы — в массиве `staticPages` внутри файла; статьи блога подтягиваются из WordPress через REST API, руками их добавлять не нужно. Запуск: `node scripts/generate-sitemap.mjs` (нужен доступ в сеть; при ошибке скрипт падает и НЕ перезаписывает sitemap.xml)

**Data flow заявки (форма на каждой странице):**
```
Форма (любая страница) → POST /api/send-lead → api/send-lead.php → Telegram Bot API → Telegram-чат
```
Поле `source` в теле запроса передаёт идентификатор страницы (например `'industry-it'`), чтобы в Telegram было видно, откуда пришла заявка.

## Pages

| Файл | URL | Статус | Индексация |
|---|---|---|---|
| `index.html` | `/` | Живая | Да |
| `industry-it.html` | `/industry-it` | Живая | Да |
| `industry-manufacturing.html` | `/industry-manufacturing` | Живая | Да |
| `industry-distributors.html` | `/industry-distributors` | Живая | Да |
| `industry-consulting.html` | `/industry-consulting` | Живая | Да |
| `industry-hrtech.html` | `/industry-hrtech` | Живая | Да |
| `industry-logistics.html` | `/industry-logistics` | Живая | Да |
| `outreach.html` | `/outreach` | Живая | Да |
| WordPress | `/blog`, `/blog/<slug>` | Живая | Да |
| `404.html` | `/404` | Живая | Нет (noindex) |

Статических файлов блога (`blog.html`, `blog-*.html`) больше нет: статьи перенесены в WordPress, старые URL отдают 301 из `.htaccess`. Не воссоздавать.

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

Нет системы сборки и пакетных зависимостей.

Страницы используют абсолютные пути (`/images/...`, `/industry-it`), поэтому открывать
`index.html` через `file://` бесполезно — поднимите простой HTTP-сервер из корня репозитория:

```bash
python -m http.server 8765
# затем http://127.0.0.1:8765/index.html
```

Так работает вся вёрстка и клиентский JS. Не работают только вещи, которые
обеспечивает Apache на проде: маршруты без `.html`, редиректы, `/api/send-lead`
и весь `/blog` (WordPress).

### Деплой

Файлы выкладываются на Beget в корень сайта. Отдельного шага сборки нет,
но при изменении списка страниц надо перегенерировать sitemap:

```bash
node scripts/generate-sitemap.mjs
```

## Environment Variables

Токен Telegram-бота лежит в `api/tg-config.php` на сервере (в git его нет —
есть только `api/tg-config.example.php`). `TG_CHAT_ID` захардкожен в
`api/send-lead.php`.

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

**Навигация** — разметка меню лежит статически в каждой HTML-странице и в
`wp-blog/wp-content/themes/huntedlead/header.php`. `nav.js` отвечает только за
поведение: дропдаун «Ниши», бургер, залипающая шапка, плавный скролл по якорям.
Раньше меню собиралось JS-ом — из-за этого в исходном HTML главной была всего
одна внутренняя ссылка, и краулеры (в первую очередь Яндекс) не видели нишевые
страницы. **При добавлении нового пункта меню его нужно добавить в 9 местах:**
8 статических страниц + `header.php` темы блога.


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

## Кроссбраузерность

Сайт должен работать в Chrome, Firefox, Safari (macOS + iOS) и Edge.

**Обязательные правила при написании CSS:**

- `backdrop-filter` — всегда писать пару: сначала `-webkit-backdrop-filter`, затем `backdrop-filter`
- `transform-style: preserve-3d` — писать с префиксом: `-webkit-transform-style` + `transform-style`
- `backface-visibility` — писать с префиксом: `-webkit-backface-visibility` + `backface-visibility`
- Скрытие элементов с анимацией — **не использовать** `visibility: hidden` в связке с `transform` и `opacity` (Safari баг). Использовать `max-height: 0 + overflow: hidden + opacity: 0` вместо `visibility`
- `gap` в flex — поддерживается с Safari 14.1+; для критичных мест добавить `row-gap`/`column-gap` как fallback
- Цвета — использовать `rgba()`, не `oklch()` и не `color-mix()` (нет поддержки в старых Safari)
- Не анимировать `display` — использовать `opacity`, `max-height`, `clip-path` или JS-классы

**Чеклист перед коммитом CSS-изменений:**
- [ ] Добавлен `-webkit-` префикс для `backdrop-filter`, `transform-style`, `backface-visibility`
- [ ] Скрытые/показываемые элементы не используют `visibility` + `transform` в Safari-несовместимом виде
- [ ] Анимации протестированы или логически проверены для Safari (особенно flex, position: absolute, transitions)
