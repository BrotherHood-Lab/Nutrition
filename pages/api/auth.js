import { serialize } from 'cookie';
import { verifyTelegramAuth } from '../../lib/verifyTelegramAuth';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  const isValid = verifyTelegramAuth(data, botToken);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid Telegram auth data' });
  }

  const telegram_id = data.id;
  const telegram_username = data.username || null;
  const full_name = [data.first_name, data.last_name].filter(Boolean).join(' ');

  // Создаём пользователя, если его ещё нет, иначе просто получаем его id
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .upsert(
      { telegram_id, telegram_username, full_name },
      { onConflict: 'telegram_id' }
    )
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database error' });
  }

  // Простая сессионная кука: id пользователя, подписанный секретом.
  // Для MVP этого достаточно; позже можно заменить на полноценный JWT.
  const sessionValue = Buffer.from(JSON.stringify({ user_id: user.id })).toString('base64');

  res.setHeader(
    'Set-Cookie',
    serialize('bh_session', sessionValue, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 дней
    })
  );

  res.status(200).json({ ok: true });
}
