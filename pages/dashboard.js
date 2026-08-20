import { supabaseAdmin } from '../lib/supabaseAdmin';

export async function getServerSideProps({ req }) {
  const cookie = req.cookies['bh_session'];
  if (!cookie) {
    return { redirect: { destination: '/', permanent: false } };
  }

  let userId;
  try {
    userId = JSON.parse(Buffer.from(cookie, 'base64').toString()).user_id;
  } catch {
    return { redirect: { destination: '/', permanent: false } };
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (!user) {
    return { redirect: { destination: '/', permanent: false } };
  }

  const { data: program } = await supabaseAdmin
    .from('nutrition_programs')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'активна')
    .maybeSingle();

  return { props: { user, program: program || null } };
}

export default function Dashboard({ user, program }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#e8e0d0',
        fontFamily: 'Georgia, serif',
        padding: '40px 24px',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <h1 style={{ fontWeight: 400 }}>Привет, {user.full_name || user.telegram_username}</h1>

      {program ? (
        <div style={{ marginTop: '24px' }}>
          <p>Цель: {program.goal}</p>
          <p>Калории в день: {program.daily_calories}</p>
          <p>
            БЖУ: {program.daily_protein_g} / {program.daily_fat_g} / {program.daily_carbs_g}
          </p>
        </div>
      ) : (
        <p style={{ marginTop: '24px', color: '#9a9482' }}>
          Твоя программа питания ещё не готова — скоро появится здесь.
        </p>
      )}
    </div>
  );
}
