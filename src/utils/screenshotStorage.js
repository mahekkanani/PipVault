import { supabase } from '../lib/supabase.js';

const BUCKET = 'screenshots';

function sanitizeFileName(name) {
  return name.replace(/[^a-z0-9._-]/gi, '-').toLowerCase();
}

export async function uploadScreenshot({ file, fallback, userId, folder }) {
  if (!file) return fallback || '';

  const fileName = `${crypto.randomUUID()}-${sanitizeFileName(file.name || 'screenshot')}`;
  const path = `${userId}/${folder}/${fileName}`;

  try {
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) throw error;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  } catch (error) {
    console.warn('Screenshot upload failed. Saving base64 fallback instead:', error);
    return fallback || '';
  }
}

export async function deleteStoredScreenshot(url) {
  const publicMarker = `/storage/v1/object/public/${BUCKET}/`;

  if (!url || url.startsWith('data:') || !url.includes(publicMarker)) return;

  try {
    const path = decodeURIComponent(url.split(publicMarker)[1].split('?')[0]);
    if (!path) return;

    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) throw error;
  } catch (error) {
    console.warn('Unable to delete stored screenshot:', error);
  }
}
