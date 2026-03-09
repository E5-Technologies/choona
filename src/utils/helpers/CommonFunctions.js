export function extractSongIdFromUrl(url) {
  try {
    if (!url || typeof url !== 'string') {
      return null;
    }

    const trimmedUrl = url.trim();

    // 1. Try to get the 'i' parameter (standard for specific songs in albums)
    const match = trimmedUrl.match(/[?&]i=([0-9]+)/);
    if (match && match[1]) {
      return match[1];
    }

    // 2. Try to get the ID from the end of the URL
    const parts = trimmedUrl.split('/');
    const lastPart = parts[parts.length - 1];

    if (lastPart) {
      const cleanId = lastPart.split(/[?#&]/)[0];
      if (/^[0-9]+$/.test(cleanId)) {
        return cleanId;
      }
    }

    return null;
  } catch (error) {
    console.log('extractSongIdFromUrl: Error parsing URL:', url, error);
    return null;
  }
}