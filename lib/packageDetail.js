export function getImageUrl(url, apiUrl) {
    if (!url) return '/assets/img/grentours_placeholder.png';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/assets/') || url.startsWith('assets/')) {
        return url.startsWith('/') ? url : `/${url}`;
    }
    
    const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL || apiUrl || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    if (mediaUrl === '/') {
        return url;
    }
    
    const base = mediaUrl.endsWith('/') ? mediaUrl.slice(0, -1) : mediaUrl;
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${base}${path}`;
}

export function getMapEmbedSrc(mapEmbed, location) {
    if (mapEmbed) {
        const trimmed = String(mapEmbed).trim();
        const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
        if (srcMatch) return srcMatch[1];
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    }
    if (location) {
        return `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
    }
    return null;
}

export function parseHighlights(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.filter(Boolean);
    return String(raw)
        .split('\n')
        .map((line) => line.replace(/^[\s*\-•]+/, '').trim())
        .filter(Boolean);
}

export function normalizePackageDetail(data, apiUrl) {
    const durationDays = data.duration_days || 0;
    const durationNights = data.duration_nights ?? Math.max(0, durationDays - 1);
    const images = Array.isArray(data.images) && data.images.length > 0
        ? data.images.map((img) => getImageUrl(img, apiUrl))
        : [getImageUrl(data.image, apiUrl)];

    return {
        id: data.id,
        slug: data.slug,
        title: data.title || 'Holiday Package',
        price: parseFloat(data.price || 0),
        rating: parseFloat(data.rating || data.average_rating || 4.5),
        reviews: data.reviews || data.reviews_count || 0,
        stars: data.stars || data.star_rating || null,
        duration: durationDays,
        durationNights,
        durationText: durationDays
            ? `${durationDays} Days / ${durationNights} Nights`
            : null,
        image: getImageUrl(data.image, apiUrl),
        images,
        location: data.location || 'India',
        city: data.city,
        state: data.state,
        country: data.country,
        packageType: data.package_type || 'tour',
        mapEmbed: data.map_embed || null,
        mapSrc: getMapEmbedSrc(data.map_embed, data.location || 'India'),
        description: data.overview || data.description || '',
        tripHighlights: parseHighlights(data.tripHighlights || data.highlights),
        amenities: Array.isArray(data.amenities)
            ? data.amenities.map((a) => (typeof a === 'string' ? a : a.name)).filter(Boolean)
            : [],
        inclusions: Array.isArray(data.inclusions) ? data.inclusions.filter(Boolean) : [],
        exclusions: Array.isArray(data.exclusions) ? data.exclusions.filter(Boolean) : [],
        tourPlan: Array.isArray(data.tourPlan) ? data.tourPlan : [],
        faqs: Array.isArray(data.faqs) ? data.faqs.filter((f) => f.question && f.answer) : [],
        tags: Array.isArray(data.tags) ? data.tags : [],
        themes: Array.isArray(data.themes) ? data.themes : [],
        departureDate: data.departure_date || null,
    };
}

export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount || 0);
}

export const AMENITY_ICON_MAP = {
    'Free Wifi': 'bi-wifi',
    'Wifi': 'bi-wifi',
    'Swimming Pool': 'bi-water',
    'Pool': 'bi-water',
    'Restaurant': 'bi-egg-fried',
    'Spa': 'bi-gem',
    'Air Conditioning': 'bi-snow',
    'Breakfast Included': 'bi-egg-fried',
    'Expert Guide': 'bi-person-badge-fill',
    'Airport Transfers': 'bi-car-front-fill',
    '4-Star Hotels': 'bi-building-fill',
    '5-Star Hotels': 'bi-building-fill',
    'Safe Stays': 'bi-shield-fill-check',
};

export function getAmenityIcon(name) {
    if (AMENITY_ICON_MAP[name]) return AMENITY_ICON_MAP[name];
    const lower = (name || '').toLowerCase();
    if (lower.includes('wifi')) return 'bi-wifi';
    if (lower.includes('pool') || lower.includes('swim')) return 'bi-water';
    if (lower.includes('spa')) return 'bi-gem';
    if (lower.includes('breakfast') || lower.includes('meal')) return 'bi-egg-fried';
    if (lower.includes('transfer') || lower.includes('car')) return 'bi-car-front-fill';
    if (lower.includes('star') || lower.includes('hotel')) return 'bi-building-fill';
    return 'bi-check-circle-fill';
}
