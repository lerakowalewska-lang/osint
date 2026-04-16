export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
  const TG_CHAT_ID = '-5268453636';

  const now = new Date();
  const dateStr = now.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });

  const text = `🔥 *Новая заявка с сайта HuntedLead*\n\n👤 *Имя:* ${name}\n📞 *Телефон:* ${phone}\n🕐 *Время:* ${dateStr} (МСК)`;

  try {
    const [tgResponse, w3fResponse] = await Promise.all([
      fetch(
        `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TG_CHAT_ID,
            text: text,
            parse_mode: 'Markdown',
          }),
        }
      ),
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '5090c20e-e3ed-4d8b-b5d2-5009b600bf4a',
          name,
          phone,
          subject: 'Новая заявка с сайта HuntedLead',
          from_name: 'HuntedLead',
        }),
      }),
    ]);

    let tgOk = false;
    let w3fOk = false;

    try {
      const tgData = await tgResponse.json();
      tgOk = !!tgData.ok;
      if (!tgOk) console.error('Telegram API error:', tgData.description);
    } catch (e) {
      console.error('Telegram response parse error:', e.message);
    }

    try {
      const w3fData = await w3fResponse.json();
      w3fOk = !!w3fData.success;
      if (!w3fOk) console.error('Web3Forms error:', w3fData.message, '| status:', w3fResponse.status);
    } catch (e) {
      console.error('Web3Forms response parse error:', e.message, '| status:', w3fResponse.status);
    }

    if (tgOk || w3fOk) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: 'Failed to send message' });
    }
  } catch (err) {
    console.error('Send error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
