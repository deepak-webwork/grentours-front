export function getMediaUrl(url) {
    if (!url) return '/assets/img/grentours_placeholder.png';
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    if (url.startsWith('/assets/')) {
        return url;
    }
    
    const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    if (mediaUrl === '/') {
        return url;
    }
    
    // Ensure we don't double slash if mediaUrl ends with / and url starts with /
    const base = mediaUrl.endsWith('/') ? mediaUrl.slice(0, -1) : mediaUrl;
    const path = url.startsWith('/') ? url : `/${url}`;
    
    return `${base}${path}`;
}
