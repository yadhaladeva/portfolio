import { createClient } from '@supabase/supabase-js';

// Supabase Project URL and Public Publishable / Anon Key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dizyqymwvpibkqtntzbe.supabase.co';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let client = null;

if (supabaseUrl && supabasePublishableKey) {
  try {
    client = createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  } catch (err) {
    console.warn('[Supabase] Failed to initialize Supabase client:', err);
  }
} else {
  console.info('[Supabase] VITE_SUPABASE_PUBLISHABLE_KEY is not set. Supabase direct reads will fall back to cache or API.');
}

export const supabase = client;

export const isSupabaseConfigured = () => Boolean(client && supabaseUrl && supabasePublishableKey);

/**
 * Returns the public CDN URL for a file stored in a Supabase Storage bucket.
 * 
 * @param {string} bucket - Bucket name (e.g. 'portfolio-certifications', 'portfolio-resumes')
 * @param {string} path - Object path or filename (e.g. 'cert_123.pdf')
 * @returns {string} Public direct URL
 */
export const getSupabasePublicStorageUrl = (bucket, path) => {
  if (!bucket || !path) return '';
  const cleanPath = path.replace(/^\/+/, '');
  
  if (client) {
    const { data } = client.storage.from(bucket).getPublicUrl(cleanPath);
    if (data?.publicUrl) return data.publicUrl;
  }
  
  const baseUrl = (supabaseUrl || 'https://dizyqymwvpibkqtntzbe.supabase.co').replace(/\/+$/, '');
  return `${baseUrl}/storage/v1/object/public/${bucket}/${cleanPath}`;
};

/**
 * Extracts [bucket, objectPath] from a "supabase://bucket/path" URI.
 * 
 * @param {string} storagePath
 * @returns {{ bucket: string, path: string } | null}
 */
export const parseSupabaseStorageUri = (storagePath) => {
  if (!storagePath || typeof storagePath !== 'string') return null;
  if (!storagePath.startsWith('supabase://')) return null;

  const stripped = storagePath.substring('supabase://'.length);
  const slashIdx = stripped.indexOf('/');
  if (slashIdx > 0 && slashIdx < stripped.length - 1) {
    return {
      bucket: stripped.substring(0, slashIdx),
      path: stripped.substring(slashIdx + 1),
    };
  }
  return null;
};
