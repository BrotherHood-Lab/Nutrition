import { useEffect } from 'react';
import { useRouter } from 'next/router';

const BOT_USERNAME = 'Brotherhood_Nutrition_bot';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Глобальная функция, которую вызовет виджет Telegram после успешного логина
    window.onTelegramAuth = async (user) => {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        alert('Не удалось войти. Попробуй ещё раз.');
      }
    };

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', BOT_USERNAME);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.async = true;

    document.getElementById('telegram-login-container').appendChild(script);
  }, [router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#e8e0d0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Georgia, serif',
        gap: '24px',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <h1 style={{ letterSpacing: '2px', fontWeight: 400 }}>Brotherhood Nutrition</h1>
      <p style={{ color: '#9a9482', maxWidth: '360px' }}>
        Войди через Telegram, чтобы увидеть свою программу питания и рецепты.
      </p>
      <div id="telegram-login-container" />
    </div>
  );
}
