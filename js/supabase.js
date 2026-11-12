
// ======================================
// Supabase 接続設定
// ======================================

// SupabaseのプロジェクトURL
const SUPABASE_URL = 'https://jqkggsujrqhuldymgiou.supabase.co';

// SupabaseのPublishable key
const SUPABASE_ANON_KEY = 'sb_publishable_l7OygEF0zX_zhCh_W9X5tA_XRdjO6Yt';

// Supabaseクライアントを作成
const { createClient } = window.supabase;

const supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

console.log('Supabaseの初期化が完了しました！');
