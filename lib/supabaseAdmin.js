import { createClient } from '@supabase/supabase-js';

// ВНИМАНИЕ: service role key даёт полный доступ к базе, минуя RLS.
// Использовать ТОЛЬКО в серверном коде (api routes), никогда не в браузере.
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
