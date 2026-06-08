'use client';

import React, { useState, useEffect, Suspense, useCallback, useRef } from 'react';
import Link from 'next/link';
import ListFilterHeader from '../../components/listing/ListFilterHeader';

function HotelsListContent() {
    // Filter states
    const [priceLimit, setPriceLimit] = useState(50000);
    const [selectedStars, setSelectedStars] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('rating');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    // Data states
    const [hotels, setHotels] = useState([]);
    const [availableAmenities, setAvailableAmenities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    
    const ITEMS_PER_PAGE = 10;
    
    // Debounce timer
    const debounceTimer = useRef(null);

    useEffect(() => {
        if (mobileFilterOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileFilterOpen]);

    // Clipboard promo state
    const [copiedCode, setCopiedCode] = useState('');

    // Fetch hotels from API
    const fetchHotels = async (isLoadMore = false) => {
        if (!isLoadMore) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }
        
        try {
            const params = new URLSearchParams();
            params.append('limit', ITEMS_PER_PAGE);
            params.append('offset', isLoadMore ? offset : 0);
            if (searchQuery) params.append('search', searchQuery);
            if (priceLimit) params.append('max_price', priceLimit);
            if (selectedStars.length > 0) params.append('stars', selectedStars.join(','));
            if (selectedAmenities.length > 0) params.append('amenities', selectedAmenities.join(','));
            
            let sortParam = 'rating';
            if (sortOption === 'price-low') sortParam = 'price_low';
            if (sortOption === 'price-high') sortParam = 'price_high';
            if (sortOption === 'reviews') sortParam = 'reviews';
            params.append('sort', sortParam);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
            const res = await fetch(`${apiUrl}/api/v1/hotels?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                if (isLoadMore) {
                    setHotels(prev => [...prev, ...data.data]);
                } else {
                    setHotels(data.data);
                    if (data.filters?.amenities) {
                        setAvailableAmenities(data.filters.amenities);
                    }
                }
                setHasMore(data.data.length === ITEMS_PER_PAGE && hotels.length + data.data.length < data.total);
            }
        } catch (error) {
            console.error('Error fetching hotels:', error);
        } finally {
            if (!isLoadMore) {
                setLoading(false);
            } else {
                setLoadingMore(false);
            }
        }
    };

    // Initial fetch and filter changes (with debounce for search)
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        
        if (searchQuery) {
            // Debounce search
            debounceTimer.current = setTimeout(() => {
                setOffset(0);
                fetchHotels();
            }, 300);
        } else {
            // Immediate for other filters
            setOffset(0);
            fetchHotels();
        }
        
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [priceLimit, selectedStars, selectedAmenities, searchQuery, sortOption]);
    
    // Handle scroll to load more
    useEffect(() => {
        const handleScroll = () => {
            if (loading || loadingMore || !hasMore) return;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            if (scrollTop + windowHeight >= documentHeight - 500) {
                setOffset(prev => prev + ITEMS_PER_PAGE);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, loadingMore, hasMore]);
    
    // Fetch more when offset changes
    useEffect(() => {
        if (offset > 0) {
            fetchHotels(true);
        }
    }, [offset]);

    const handleStarChange = (starsNum) => {
        setSelectedStars(prev => 
            prev.includes(starsNum) ? prev.filter(s => s !== starsNum) : [...prev, starsNum]
        );
    };

    const handleAmenityChange = (amenityId) => {
        setSelectedAmenities(prev => 
            prev.includes(amenityId) ? prev.filter(a => a !== amenityId) : [...prev, amenityId]
        );
    };

    const resetFilters = () => {
        setPriceLimit(50000);
        setSelectedStars([]);
        setSelectedAmenities([]);
        setSearchQuery('');
        setSortOption('rating');
    };

    const copyPromoCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(''), 3000);
    };

    // Amenity map (for icons)
    const getAmenityIcon = (amenityName) => {
        const lowerName = amenityName.toLowerCase();
        if (lowerName.includes('wifi')) return 'bi-wifi';
        if (lowerName.includes('pool') || lowerName.includes('swim')) return 'bi-water';
        if (lowerName.includes('restaurant') || lowerName.includes('food')) return 'bi-egg-fried';
        if (lowerName.includes('spa')) return 'bi-gem';
        if (lowerName.includes('air') || lowerName.includes('ac')) return 'bi-snow';
        return 'bi-check-circle';
    };

    return (
        <div className="packages-wrapper py-4">
            <link rel="stylesheet" href="/assets/css/packages-style.css" />
            <div className="container-xl">
                {/* Breadcrumbs */}
                <div className="packages-breadcrumb mb-3">
                    <Link href="/">Home</Link> &nbsp;/&nbsp; 
                    <span className="active">Hotels &amp; Resorts Listings</span>
                </div>

                {/* Page Title Card */}
                <div className="list-header-card p-4 rounded-4 bg-white shadow-sm border border-light mb-4">
                    <div className="list-header-info">
                        <h1 className="h3 fw-bold text-dark mb-1">Luxury Hotels &amp; Resorts</h1>
                        <p className="text-muted mb-0">Showing {hotels.length} handpicked premium hotel stays</p>
                    </div>
                    <div className="list-header-controls d-flex align-items-center gap-3">
                        <div className="sort-select-wrapper d-flex align-items-center gap-2">
                            <label className="text-muted small fw-semibold mb-0" style={{whiteSpace: 'nowrap'}}>
                                <i className="bi bi-sort-down-alt"></i> Sort by:
                            </label>
                            <select 
                                className="form-select form-select-sm rounded-3" 
                                value={sortOption} 
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="rating">Top Customer Ratings</option>
                                <option value="reviews">Popularity &amp; Reviews</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2-Column Layout */}
                <div className="row g-4 position-relative">
                    
                    {/* COLUMN 1: SIDEBAR FILTERS (col-lg-4) */}
                    <aside className={`col-lg-4 filter-sidebar-mobile ${mobileFilterOpen ? 'show' : ''}`}>
                        <div className="filter-card bg-white p-4 rounded-4 shadow-sm border border-light sticky-top" style={{top: '120px'}}>
                            <ListFilterHeader
                                title="Filters"
                                onReset={resetFilters}
                                onClose={() => setMobileFilterOpen(false)}
                            />

                            <div className="filter-drawer-body">
                            {/* Search Query */}
                            <div className="filter-group mb-4">
                                <label className="form-label small fw-bold text-dark mb-2">Search Destination / Hotel</label>
                                <div className="input-group input-group-sm">
                                    <span className="input-group-text bg-white border-light-subtle"><i className="bi bi-search text-muted"></i></span>
                                    <input 
                                        type="text" 
                                        className="form-control border-light-subtle" 
                                        placeholder="Hotel name, city, location..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Price range filter */}
                            <div className="filter-group mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="small fw-bold text-dark">Max Price per Night</span>
                                    <span className="badge bg-light text-success fw-bold">₹ {priceLimit.toLocaleString('en-IN')}</span>
                                </div>
                                <input 
                                    type="range" 
                                    className="form-range custom-range-slider" 
                                    min="3000" 
                                    max="50000" 
                                    step="500" 
                                    value={priceLimit}
                                    onChange={(e) => setPriceLimit(Number(e.target.value))}
                                />
                                <div className="d-flex justify-content-between text-muted" style={{fontSize: '10px'}}>
                                    <span>₹ 3K</span>
                                    <span>₹ 50K</span>
                                </div>
                            </div>

                            {/* Star Rating checklist */}
                            <div className="filter-group mb-4">
                                <span className="small fw-bold text-dark d-block mb-2">Star Rating</span>
                                <div className="d-flex flex-column gap-2">
                                    {[5, 4, 3].map(stars => (
                                        <label key={stars} className="checkbox-item d-flex justify-content-between align-items-center cursor-pointer small">
                                            <div className="d-flex align-items-center gap-2">
                                                <input 
                                                    type="checkbox" 
                                                    className="form-check-input m-0 cursor-pointer"
                                                    checked={selectedStars.includes(stars)}
                                                    onChange={() => handleStarChange(stars)}
                                                />
                                                <span className="text-muted d-flex align-items-center gap-0.5">
                                                    {Array.from({ length: stars }).map((_, i) => (
                                                        <i key={i} className="bi bi-star-fill text-warning" style={{fontSize: '11px'}}></i>
                                                    ))}
                                                    <span className="ms-1">{stars} Star Stay</span>
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Amenities Checklist */}
            <div className="filter-group">
                <span className="small fw-bold text-dark d-block mb-2">Hotel Amenities</span>
                <div className="d-flex flex-column gap-2">
                    {availableAmenities.map((amenity) => (
                        <label key={amenity.id} className="checkbox-item d-flex justify-content-between align-items-center cursor-pointer small">
                            <div className="d-flex align-items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    className="form-check-input m-0 cursor-pointer"
                                    checked={selectedAmenities.includes(amenity.id)}
                                    onChange={() => handleAmenityChange(amenity.id)}
                                />
                                <span className="text-muted d-flex align-items-center gap-2">
                                    <i className={`bi ${getAmenityIcon(amenity.name)} text-success`}></i> {amenity.name}
                                </span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
                            </div>

                            <div className="filter-drawer-footer d-lg-none">
                                <button type="button" className="filter-drawer-apply-btn" onClick={() => setMobileFilterOpen(false)}>
                                    Show {hotels.length} Results
                                </button>
                            </div>

        </div>
    </aside>

    {mobileFilterOpen && (
        <div className="filter-backdrop d-lg-none" onClick={() => setMobileFilterOpen(false)} />
    )}

    {/* COLUMN 2: HOTELS LIST & ADS (col-lg-8) */}
    <main className="col-lg-8">
        <div className="packages-list-container">
            
            {loading ? (
                <div className="packages-empty-state">
                    <div className="spinner-border text-success"></div>
                    <h3 className="mt-3">Loading Hotels...</h3>
                </div>
            ) : hotels.length === 0 ? (
                <div className="packages-empty-state">
                    <i className="bi bi-building"></i>
                    <h3>No Stays Found</h3>
                    <p>Try modifying your filter selections or budget limit.</p>
                    <button className="btn btn-sm btn-success rounded-pill px-4 mt-2 fw-bold" onClick={resetFilters}>
                        Clear Filters
                    </button>
                </div>
            ) : (
                hotels.map((hotel, index) => {
                    return (
                        <React.Fragment key={hotel.id}>
                            <article className="package-card-premium">
                                {/* Card Image */}
                                <div className="card-img-side">
                                    <img 
                                        src={hotel.image || '/assets/img/grentours_placeholder.png'} 
                                        alt={hotel.title} 
                                        onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} 
                                    />
                                    <span className="card-ribbon orange">{hotel.stars} Star Stay</span>
                                </div>

                                {/* Card Details */}
                                <div className="card-details-side">
                                    <div>
                                        <div className="card-tags">
                                            <span className="tag-badge outline text-success border-success-subtle">{hotel.location}</span>
                                        </div>
                                        <h3>
                                            <Link href={`/hotels/${hotel.slug}`} className="text-dark fw-bold text-decoration-none">
                                                {hotel.title}
                                            </Link>
                                        </h3>
                                        <div className="card-ratings">
                                            <span className="rating-stars">
                                                {Array.from({ length: hotel.stars }).map((_, i) => (
                                                    <i key={i} className="bi bi-star-fill text-warning"></i>
                                                ))}
                                            </span>
                                            <span className="fw-bold text-dark ms-1">{hotel.rating}</span>
                                            <span className="review-count">({hotel.reviews} customer reviews)</span>
                                        </div>
                                        <p className="card-highlights">
                                            {hotel.highlights}
                                        </p>

                                        {/* Compact specifications row */}
                                        <div className="card-specs-row">
                                            <span className="spec-pill" title="Location">
                                                <i className="bi bi-geo-alt-fill text-danger"></i> {hotel.location}
                                            </span>
                                            {hotel.amenities.slice(0, 3).map(a => (
                                                <span key={a.id} className="spec-pill" title={a.name}>
                                                    <i className={`bi ${getAmenityIcon(a.name)} text-success`}></i> {a.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="inclusions-row mt-3">
                                        {hotel.amenities.slice(0, 3).map(a => (
                                            <span key={a.id} className="inclusion-item">
                                                <i className={`bi ${getAmenityIcon(a.name)}`}></i> {a.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Price & Book Section */}
                                <div className="card-price-side">
                                    <div>
                                        <span className="price-label">Price / Night</span>
                                        <div className="price-value">₹ {hotel.price.toLocaleString('en-IN')}</div>
                                        <span className="price-subtitle">excl. local room taxes</span>
                                    </div>
                                    <div className="card-actions-stack">
                                        <Link href={`/hotels/${hotel.slug}`} className="action-btn-primary text-decoration-none text-center">
                                            View Details
                                        </Link>
                                        <Link href={`/hotels/${hotel.slug}#inquiry`} className="action-btn-secondary text-decoration-none text-center">
                                            Send Inquiry
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        </React.Fragment>
                    );
                })
            )}
            
            {/* Loading More Indicator */}
            {loadingMore && (
                <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading more hotels...</span>
                    </div>
                    <p className="mt-3 text-muted fw-semibold">Loading more hotels...</p>
                </div>
            )}

                        </div>
                    </main>

                </div>
            </div>

            <div className="d-lg-none position-fixed bottom-0 start-50 translate-middle-x mb-4" style={{ zIndex: 999 }}>
                <button type="button" className="btn btn-success shadow-lg rounded-pill px-4 py-2.5 fw-bold d-flex align-items-center gap-2" onClick={() => setMobileFilterOpen(true)}>
                    <i className="bi bi-funnel-fill" /> Filter &amp; Sort
                </button>
            </div>
        </div>
    );
}

export default function HotelsListPage() {
    return (
        <Suspense fallback={<div className="container py-5 text-center"><div className="spinner-border text-success"></div><p className="mt-2 text-muted">Loading hotel listings...</p></div>}>
            <HotelsListContent />
        </Suspense>
    );
}
