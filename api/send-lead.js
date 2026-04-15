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

  const text = `🔥 *Новая заявка с сайта LeadHunt*\n\n👤 *Имя:* ${name}\n📞 *Телефон:* ${phone}\n🕐 *Время:* ${dateStr} (МСК)`;

  try {
    const tgResponse = await fetch(
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
    );

    const tgData = await tgResponse.json();

    if (tgData.ok) {
      return res.status(200).json({ success: true });
    } else {
      console.error('Telegram API error:', tgData.description);
      return res.status(500).json({ error: 'Failed to send message' });
    }
  } catch (err) {
    console.error('Send error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
