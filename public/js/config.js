/* Supabase connection (public, read-only).
 * The publishable key is SAFE to expose: the p3d_* tables only allow SELECT
 * for anonymous visitors (Row Level Security). Never put a secret/service_role key here. */
window.P3D_CONFIG = {
  SUPABASE_URL: 'https://cxresrjjlzruyerkqqqy.supabase.co',
  SUPABASE_KEY: 'sb_publishable_lyO2s8UewUmXqA2uCPWLlA_kra7091D',
  CACHE_KEY: 'p3d_catalogue_v1',
  CACHE_TTL_MS: 10 * 60 * 1000,   // 10 min: serve cache instantly, refresh in background
  TIMEOUT_MS: 6000                // if Supabase is slow/paused, fall back to /products.json
};
