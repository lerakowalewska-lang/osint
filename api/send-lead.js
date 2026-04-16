// In-memory rate limiter: max 3 requests per IP per 15 minutes
const rateLimitMap = new Map();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.firstRequest > RATE_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

function escapeMd(str) {
  return str.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
}

const TG_CHAT_ID = '-5268453636';
const ALLOWED_ORIGINS = ['https://huntedlead.com', 'https://www.huntedlead.com'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const origin = req.headers['origin'] || '';
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';

  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Try again later.' });
  }

  const { name, phone, website } = req.body || {};

  // Honeypot: боты заполняют скрытые поля, люди нет
  if (website) {
    return res.status(200).json({ success: true });
  }

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  if (typeof name !== 'string' || name.length > 100) {
    return res.status(400).json({ error: 'Invalid name' });
  }

  if (typeof phone !== 'string' || !/^[\d\s+\-()]{6,20}$/.test(phone)) {
    return res.status(400).json({ error: 'Invalid phone format' });
  }

  const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;

  if (!TG_BOT_TOKEN) {
    console.error('Missing TG_BOT_TOKEN environment variable');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const now = new Date();
  const dateStr = now.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });

  const safeName = escapeMd(name.trim());
  const safePhone = escapeMd(phone.trim());

  const text = `🔥 *Новая заявка с сайта HuntedLead*\n\n👤 *Имя:* ${safeName}\n📞 *Телефон:* ${safePhone}\n🕐 *Время:* ${dateStr} (МСК)`;

  const telegramReq = fetch(
    `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text,
        parse_mode: 'MarkdownV2',
      }),
    }
  );

  const web3formsReq = fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_key: process.env.WEB3FORMS_ACCESS_KEY,
      subject: 'Новая заявка с сайта HuntedLead',
      from_name: 'HuntedLead',
      name: name.trim(),
      phone: phone.trim(),
    }),
  });

  try {
    const [tgResult, w3fResult] = await Promise.allSettled([telegramReq, web3formsReq]);

    let tgOk = false;
    if (tgResult.status === 'fulfilled') {
      const tgData = await tgResult.value.json();
      tgOk = tgData.ok;
      if (!tgOk) console.error('Telegram API error:', tgData.description);
    } else {
      console.error('Telegram request failed:', tgResult.reason);
    }

    if (w3fResult.status === 'fulfilled') {
      const w3fData = await w3fResult.value.json();
      if (!w3fData.success) console.error('Web3Forms error:', w3fData.message);
    } else {
      console.error('Web3Forms request failed:', w3fResult.reason);
    }

    if (tgOk) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: 'Failed to send message' });
    }
  } catch (err) {
    console.error('Send error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
