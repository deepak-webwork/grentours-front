'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { hotelList, hotelAds } from '../../data/travel-data';

function HotelsListContent() {
    // Filter states
    const [priceLimit, setPriceLimit] = useState(50000);
    const [selectedStars, setSelectedStars] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('rating');

    // Clipboard promo state
    const [copiedCode, setCopiedCode] = useState('');

    const handleStarChange = (starsNum) => {
        setSelectedStars(prev => 
            prev.includes(starsNum) ? prev.filter(s => s !== starsNum) : [...prev, starsNum]
        );
    };

    const handleAmenityChange = (amenityKey) => {
        setSelectedAmenities(prev => 
            prev.includes(amenityKey) ? prev.filter(a => a !== amenityKey) : [...prev, amenityKey]
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

    // Filter Logic
    const filteredHotels = hotelList.filter(hotel => {
        // Price limit
        if (hotel.price > priceLimit) return false;

        // Search Query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesTitle = hotel.title.toLowerCase().includes(query);
            const matchesLocation = hotel.location.toLowerCase().includes(query);
            const matchesHighlights = hotel.highlights.toLowerCase().includes(query);
            if (!matchesTitle && !matchesLocation && !matchesHighlights) return false;
        }

        // Star rating
        if (selectedStars.length > 0) {
            if (!selectedStars.includes(hotel.stars)) return false;
        }

        // Amenities
        if (selectedAmenities.length > 0) {
            const matchesAllAmenities = selectedAmenities.every(a => hotel.amenities.includes(a));
            if (!matchesAllAmenities) return false;
        }

        return true;
    });

    // Sort Logic
    const sortedHotels = [...filteredHotels].sort((a, b) => {
        if (sortOption === 'price-low') {
            return a.price - b.price;
        }
        if (sortOption === 'price-high') {
            return b.price - a.price;
        }
        if (sortOption === 'rating') {
            return b.rating - a.rating;
        }
        // default by reviews
        return b.reviews - a.reviews;
    });

    // Amenity Details
    const amenityMap = {
        wifi: { label: "Free Wifi", icon: "bi-wifi" },
        pool: { label: "Swimming Pool", icon: "bi-water" },
        restaurant: { label: "Restaurant", icon: "bi-egg-fried" },
        spa: { label: "Luxury Spa", icon: "bi-gem" },
        ac: { label: "Air Conditioning", icon: "bi-snow" }
    };

    return (
        <div className="packages-wrapper py-4">
            <div className="container-xl">
                {/* Breadcrumbs */}
                <div className="packages-breadcrumb mb-3">
                    <a href="/">Home</a> &nbsp;/&nbsp; 
                    <span className="active">Hotels &amp; Resorts Listings</span>
                </div>

                {/* Page Title Card */}
                <div className="list-header-card p-4 rounded-4 bg-white shadow-sm border border-light mb-4">
                    <div className="list-header-info">
                        <h1 className="h3 fw-bold text-dark mb-1">Luxury Hotels &amp; Resorts</h1>
                        <p className="text-muted mb-0">Showing {sortedHotels.length} handpicked premium hotel stays</p>
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
                <div className="row g-4">
                    
                    {/* COLUMN 1: SIDEBAR FILTERS (col-lg-4) */}
                    <aside className="col-lg-4">
                        <div className="filter-card bg-white p-4 rounded-4 shadow-sm border border-light sticky-top" style={{top: '120px'}}>
                            <div className="filter-header d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
                                <h2 className="h5 fw-bold mb-0 text-dark"><i className="bi bi-funnel-fill text-success"></i> Filter Hotels</h2>
                                <button className="reset-filter-btn btn btn-sm btn-outline-secondary rounded-pill px-3 py-1" style={{fontSize: '11px'}} onClick={resetFilters}>
                                    Reset All
                                </button>
                            </div>

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
                                    {Object.entries(amenityMap).map(([key, item]) => (
                                        <label key={key} className="checkbox-item d-flex justify-content-between align-items-center cursor-pointer small">
                                            <div className="d-flex align-items-center gap-2">
                                                <input 
                                                    type="checkbox" 
                                                    className="form-check-input m-0 cursor-pointer"
                                                    checked={selectedAmenities.includes(key)}
                                                    onChange={() => handleAmenityChange(key)}
                                                />
                                                <span className="text-muted d-flex align-items-center gap-2">
                                                    <i className={`bi ${item.icon} text-success`}></i> {item.label}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </aside>

                    {/* COLUMN 2: HOTELS LIST & ADS (col-lg-8) */}
                    <main className="col-lg-8">
                        <div className="d-flex flex-column gap-4">
                            
                            {sortedHotels.length === 0 ? (
                                <div className="alert alert-light text-center py-5 rounded-4 shadow-sm border border-light">
                                    <i className="bi bi-building fs-1 text-muted d-block mb-3"></i>
                                    <h4 className="fw-bold text-dark">No Stays Found</h4>
                                    <p className="text-muted small">Try modifying your filter selections or budget limit.</p>
                                    <button className="btn btn-sm btn-success rounded-pill px-4 mt-2 fw-bold" onClick={resetFilters}>
                                        Clear Filters
                                    </button>
                                </div>
                            ) : (
                                sortedHotels.map((hotel, index) => {
                                    // Inject Promo Ads at specific intervals (e.g. after every 3rd hotel)
                                    const showAd = index > 0 && index % 3 === 0;
                                    const adObj = hotelAds[Math.floor(index / 3) % hotelAds.length];

                                    return (
                                        <React.Fragment key={hotel.id}>
                                            {showAd && adObj && (
                                                <div className={`ft-hotel-ad-banner p-4 rounded-4 border-0 text-white shadow-sm position-relative overflow-hidden d-flex flex-column flex-md-row justify-content-between align-items-center gap-4 ${adObj.themeClass}`} style={{
                                                    background: adObj.themeClass === 'gold' 
                                                        ? 'linear-gradient(135deg, #d97706 0%, #78350f 100%)' 
                                                        : 'linear-gradient(135deg, #059669 0%, #064e3b 100%)'
                                                }}>
                                                    <div style={{zIndex: 2, maxWidth: '70%'}}>
                                                        <span className="badge bg-white text-dark px-3 py-1 rounded-pill fw-bold text-uppercase mb-2" style={{fontSize: '9px'}}>{adObj.badge}</span>
                                                        <h4 className="fw-bold text-white mb-2">{adObj.headline}</h4>
                                                        <p className="small text-light mb-0" style={{lineHeight: '1.6'}}>{adObj.subtext}</p>
                                                    </div>
                                                    <div className="flex-shrink-0" style={{zIndex: 2}}>
                                                        <button 
                                                            className="btn btn-light text-dark fw-bold rounded-pill px-4 py-2 text-uppercase shadow-sm"
                                                            style={{fontSize: '12px'}}
                                                            onClick={() => copyPromoCode(adObj.action)}
                                                        >
                                                            {copiedCode === adObj.action ? 'Copied!' : adObj.btnText}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            <article className="ft-list-card bg-white rounded-4 overflow-hidden shadow-sm border border-light d-flex flex-column flex-md-row">
                                                {/* Card Image */}
                                                <div className="card-visual position-relative flex-shrink-0" style={{width: '260px', height: '200px'}}>
                                                    <img src={hotel.image || '/assets/img/grentours_placeholder.png'} alt={hotel.title} className="w-100 h-100" style={{objectFit: 'cover'}} onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} />
                                                    <span className="badge bg-danger position-absolute top-0 start-0 m-3 fw-bold" style={{fontSize: '11px'}}>
                                                        {hotel.stars} Star Stay
                                                    </span>
                                                </div>

                                                {/* Card Details */}
                                                <div className="card-info-side p-4 flex-grow-1 d-flex flex-column justify-content-between">
                                                    <div>
                                                        <div className="d-flex align-items-center gap-2 mb-2">
                                                            <div className="d-flex align-items-center gap-0.5 text-warning" style={{fontSize: '11px'}}>
                                                                {Array.from({ length: hotel.stars }).map((_, i) => (
                                                                    <i key={i} className="bi bi-star-fill"></i>
                                                                ))}
                                                            </div>
                                                            <div className="d-flex align-items-center gap-1 text-muted ms-2" style={{fontSize: '11px'}}>
                                                                <span className="fw-bold text-dark">{hotel.rating}</span>
                                                                <span>({hotel.reviews} customer reviews)</span>
                                                            </div>
                                                        </div>
                                                        <h3 className="h5 fw-bold text-dark mb-2">{hotel.title}</h3>
                                                        <p className="text-muted small text-truncate-2 mb-3" style={{height: '38px'}}>
                                                            {hotel.highlights}
                                                        </p>
                                                    </div>

                                                    <div className="d-flex flex-wrap gap-3 mb-0 pt-2 border-top border-light-subtle" style={{fontSize: '11px'}}>
                                                        {hotel.amenities.map(a => {
                                                            const details = amenityMap[a];
                                                            if (!details) return null;
                                                            return (
                                                                <span key={a} className="text-muted d-flex align-items-center gap-1">
                                                                    <i className={`bi ${details.icon} text-success`}></i> {details.label}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Price & Book Section */}
                                                <div className="card-price-side p-4 bg-light bg-opacity-50 border-start border-light-subtle d-flex flex-column justify-content-between align-items-end text-end" style={{width: '200px'}}>
                                                    <div>
                                                        <span className="text-muted small d-block">Price / Night</span>
                                                        <div className="h4 fw-bold text-success my-1">₹ {hotel.price.toLocaleString('en-IN')}</div>
                                                        <span className="text-muted d-block" style={{fontSize: '10px'}}>excl. local room taxes</span>
                                                    </div>
                                                    <div className="w-100 d-flex flex-column gap-2 mt-3">
                                                        <button className="btn btn-sm btn-success rounded-pill fw-bold w-100 py-1.5" style={{fontSize: '12px'}} onClick={() => alert(`Initiating room booking flow for ${hotel.title}...`)}>
                                                            Book Stay
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-success rounded-pill fw-bold w-100 py-1.5" style={{fontSize: '12px'}} onClick={() => alert('Opening consultation form...')}>
                                                            Send Inquiry
                                                        </button>
                                                    </div>
                                                </div>
                                            </article>
                                        </React.Fragment>
                                    );
                                })
                            )}

                        </div>
                    </main>

                </div>
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
