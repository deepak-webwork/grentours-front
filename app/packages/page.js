'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function PackagesListContent() {
    const searchParams = useSearchParams();

    // Data states
    const [rawPackages, setRawPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    // Filter states
    const [priceLimit, setPriceLimit] = useState(500000);
    const [selectedThemes, setSelectedThemes] = useState([]);
    const [selectedDepartures, setSelectedDepartures] = useState([]);
    const [selectedDurations, setSelectedDurations] = useState([]);
    const [sortOption, setSortOption] = useState('deals');
    const [searchQuery, setSearchQuery] = useState('');

    // Comparison state
    const [compareList, setCompareList] = useState([]);
    const [showCompareDialog, setShowCompareDialog] = useState(false);

    // Fetch packages dynamically
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
                const res = await fetch(`${apiUrl}/api/v1/packages`);
                if (!res.ok) throw new Error("Failed to fetch packages");
                const resData = await res.json();
                if (resData.success) {
                    setRawPackages(resData.data);
                } else {
                    throw new Error(resData.message || "Failed to load packages");
                }
            } catch (err) {
                console.error("Error loading packages:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    // Initial load from URL search params
    useEffect(() => {
        const themeParam = searchParams.get('theme');
        if (themeParam && themeParam !== 'all') {
            setSelectedThemes([themeParam]);
        } else {
            setSelectedThemes([]);
        }

        const qParam = searchParams.get('q');
        if (qParam) {
            setSearchQuery(qParam);
        } else {
            setSearchQuery('');
        }
    }, [searchParams]);

    // Helpers
    const formatINR = (num) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(num);
    };

    // Normalize packages from dynamic API structure to match frontend expectations
    const tourPackagesList = rawPackages.map(pkg => {
        const durationDays = pkg.duration_days || 5;
        const durationNights = pkg.duration_nights || (durationDays - 1);
        
        const getImageUrl = (url) => {
            if (!url) return '/assets/img/grentours_placeholder.png';
            if (url.startsWith('http://') || url.startsWith('https://')) {
                return url;
            }
            if (url.startsWith('/assets/') || url.startsWith('assets/')) {
                return url.startsWith('/') ? url : `/${url}`;
            }
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
            return `${apiUrl}${url.startsWith('/') ? '' : '/'}${url}`;
        };

        const themes = Array.isArray(pkg.themes) 
            ? pkg.themes.map(t => t.slug || t.name?.toLowerCase()) 
            : [];

        const badges = Array.isArray(pkg.tags) 
            ? pkg.tags.map(t => t.name) 
            : [];

        const amenities = Array.isArray(pkg.amenities)
            ? pkg.amenities.map(a => a.name)
            : [];

        // Distribute departure cities deterministically for filter realism
        const staticDepartures = ['Mumbai', 'New Delhi', 'Bengaluru', 'Ahmedabad', 'Kolkata', 'Hyderabad', 'Chennai'];
        const departures = staticDepartures.filter((_, idx) => (pkg.id + idx) % 2 === 0 || idx === 0);

        return {
            id: pkg.id,
            slug: pkg.slug,
            title: pkg.title || "Holiday Package",
            price: parseFloat(pkg.price || 0),
            rating: pkg.rating || 4.8,
            reviews: pkg.reviews || 15,
            duration: durationDays,
            durationText: `${durationDays} Days / ${durationNights} Nights`,
            image: getImageUrl(pkg.image),
            themes: themes,
            departures: departures,
            inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions : ["hotels", "meals", "transfers"],
            badges: badges,
            highlights: pkg.highlights || "",
            location: pkg.location || "India",
            tourType: pkg.package_type || "Holiday Tour",
            groupSize: "15 People",
            languages: "English, Hindi",
            description: pkg.overview || pkg.description || "",
            amenities: amenities,
            tourPlan: pkg.tourPlan || [],
            images: pkg.images || [getImageUrl(pkg.image)]
        };
    });

    // Handle filter actions
    const handleThemeChange = (themeVal) => {
        setSelectedThemes(prev => 
            prev.includes(themeVal) ? prev.filter(t => t !== themeVal) : [...prev, themeVal]
        );
    };

    const handleDepartureChange = (cityVal) => {
        setSelectedDepartures(prev => 
            prev.includes(cityVal) ? prev.filter(c => c !== cityVal) : [...prev, cityVal]
        );
    };

    const handleDurationChange = (durKey) => {
        setSelectedDurations(prev => 
            prev.includes(durKey) ? prev.filter(d => d !== durKey) : [...prev, durKey]
        );
    };

    const resetAllFilters = () => {
        setPriceLimit(500000);
        setSelectedThemes([]);
        setSelectedDepartures([]);
        setSelectedDurations([]);
        setSortOption('deals');
        setSearchQuery('');
    };

    // Filter logic
    const filteredPackages = tourPackagesList.filter(pkg => {
        // Price limit
        if (pkg.price > priceLimit) return false;

        // Search Query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesTitle = pkg.title.toLowerCase().includes(query);
            const matchesLocation = pkg.location.toLowerCase().includes(query);
            const matchesHighlights = pkg.highlights.toLowerCase().includes(query);
            if (!matchesTitle && !matchesLocation && !matchesHighlights) return false;
        }

        // Selected Themes
        if (selectedThemes.length > 0) {
            const matchesTheme = pkg.themes.some(t => selectedThemes.includes(t));
            if (!matchesTheme) return false;
        }

        // Selected Departures
        if (selectedDepartures.length > 0) {
            const matchesDeparture = pkg.departures.some(d => selectedDepartures.includes(d));
            if (!matchesDeparture) return false;
        }

        // Selected Durations
        if (selectedDurations.length > 0) {
            let durationMatch = false;
            if (selectedDurations.includes('under-5') && pkg.duration < 5) durationMatch = true;
            if (selectedDurations.includes('5-8') && pkg.duration >= 5 && pkg.duration <= 8) durationMatch = true;
            if (selectedDurations.includes('8-11') && pkg.duration >= 8 && pkg.duration <= 11) durationMatch = true;
            if (selectedDurations.includes('11-above') && pkg.duration > 11) durationMatch = true;
            if (!durationMatch) return false;
        }

        return true;
    });

    // Sort logic
    const sortedPackages = [...filteredPackages].sort((a, b) => {
        if (sortOption === 'price-low') {
            return a.price - b.price;
        }
        if (sortOption === 'price-high') {
            return b.price - a.price;
        }
        if (sortOption === 'rating') {
            return b.rating - a.rating;
        }
        if (sortOption === 'duration') {
            return b.duration - a.duration;
        }
        // default (deals / popularity)
        return b.reviews - a.reviews;
    });

    // Comparison actions
    const toggleCompare = (pkg) => {
        setCompareList(prev => {
            if (prev.some(item => item.id === pkg.id)) {
                return prev.filter(item => item.id !== pkg.id);
            }
            if (prev.length >= 3) {
                alert("You can compare up to 3 packages maximum!");
                return prev;
            }
            return [...prev, pkg];
        });
    };

    const clearCompare = () => {
        setCompareList([]);
    };

    // Loading State
    if (loading) {
        return (
            <div className="packages-wrapper py-5 text-center">
                <link rel="stylesheet" href="/assets/css/packages-style.css" />
                <div className="container-xl py-5">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted fw-semibold">Loading holiday packages...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="packages-wrapper py-5 text-center">
                <link rel="stylesheet" href="/assets/css/packages-style.css" />
                <div className="container-xl py-5">
                    <i className="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
                    <h3 className="mt-3 fw-bold">Failed to Load Packages</h3>
                    <p className="text-muted">{error}</p>
                    <button className="btn btn-success rounded-pill px-4 mt-2" onClick={() => window.location.reload()}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="packages-wrapper py-4">
            <link rel="stylesheet" href="/assets/css/packages-style.css" />
            <div className="container-xl">
                {/* Breadcrumbs */}
                <div className="packages-breadcrumb mb-3">
                    <Link href="/">Home</Link> &nbsp;/&nbsp; 
                    <span className="active">Holiday Packages Listings</span>
                </div>

                {/* Page Title Card */}
                <div className="list-header-card p-4 rounded-4 bg-white shadow-sm border border-light mb-4">
                    <div className="list-header-info">
                        <h1 className="h3 fw-bold text-dark mb-1">Perfect Holiday Packages</h1>
                        <p className="text-muted mb-0">Showing {sortedPackages.length} tour packages based on your filters</p>
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
                                <option value="deals">Deals &amp; Popularity</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Reviews &amp; Ratings</option>
                                <option value="duration">Duration (Days)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2-Column Grid Layout */}
                <div className="row g-4 position-relative">
                    
                    {/* COLUMN 1: SIDEBAR FILTERS */}
                    <aside className={`col-lg-4 filter-sidebar-mobile ${mobileFilterOpen ? 'show' : ''}`}>
                        <div className="filter-card bg-white p-4 rounded-4 shadow-sm border border-light sticky-top" style={{top: '120px'}}>
                            <div className="filter-header d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
                                <h2 className="h5 fw-bold mb-0 text-dark">
                                    <i className="bi bi-funnel-fill text-success"></i> Filter Search
                                </h2>
                                <div className="d-flex align-items-center gap-2">
                                    <button className="reset-filter-btn btn btn-sm btn-outline-secondary rounded-pill px-3 py-1" style={{fontSize: '11px'}} onClick={resetAllFilters}>
                                        Reset All
                                    </button>
                                    <button className="btn-close d-lg-none" onClick={() => setMobileFilterOpen(false)}></button>
                                </div>
                            </div>

                            {/* Search bar inside filters */}
                            <div className="filter-group mb-4">
                                <label className="form-label small fw-bold text-dark mb-2">Search Query</label>
                                <div className="input-group input-group-sm">
                                    <span className="input-group-text bg-white border-light-subtle"><i className="bi bi-search text-muted"></i></span>
                                    <input 
                                        type="text" 
                                        className="form-control border-light-subtle" 
                                        placeholder="City, theme, keywords..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Price range filter */}
                            <div className="filter-group mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="small fw-bold text-dark">Max Budget</span>
                                    <span className="badge bg-light text-success fw-bold">{formatINR(priceLimit)}</span>
                                </div>
                                <input 
                                    type="range" 
                                    className="form-range custom-range-slider" 
                                    min="20000" 
                                    max="500000" 
                                    step="5000" 
                                    value={priceLimit}
                                    onChange={(e) => setPriceLimit(Number(e.target.value))}
                                />
                                <div className="d-flex justify-content-between text-muted" style={{fontSize: '10px'}}>
                                    <span>₹ 20K</span>
                                    <span>₹ 5.0L</span>
                                </div>
                            </div>

                            {/* Theme checklist */}
                            <div className="filter-group mb-4">
                                <span className="small fw-bold text-dark d-block mb-2">Holiday Theme</span>
                                <div className="d-flex flex-column gap-2">
                                    {[
                                        { key: 'bestseller', label: 'Bestseller Packages' },
                                        { key: 'family', label: 'Family Group Tours' },
                                        { key: 'honeymoon', label: 'Honeymoon Specials' },
                                        { key: 'summer', label: 'Summer Specials' },
                                        { key: 'spiritual', label: 'Spiritual / Pilgrimage' },
                                        { key: 'exotic', label: 'Exotic & Self Drive' }
                                    ].map(theme => (
                                        <label key={theme.key} className="checkbox-item d-flex justify-content-between align-items-center cursor-pointer small">
                                            <div className="d-flex align-items-center gap-2">
                                                <input 
                                                    type="checkbox" 
                                                    className="form-check-input m-0 cursor-pointer"
                                                    checked={selectedThemes.includes(theme.key)}
                                                    onChange={() => handleThemeChange(theme.key)}
                                                />
                                                <span className="text-muted">{theme.label}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Departure checklist */}
                            <div className="filter-group mb-4">
                                <span className="small fw-bold text-dark d-block mb-2">Departure City</span>
                                <div className="d-flex flex-column gap-2" style={{maxHeight: '160px', overflowY: 'auto'}}>
                                    {['Mumbai', 'New Delhi', 'Bengaluru', 'Ahmedabad', 'Kolkata', 'Hyderabad', 'Chennai'].map(city => (
                                        <label key={city} className="checkbox-item d-flex justify-content-between align-items-center cursor-pointer small">
                                            <div className="d-flex align-items-center gap-2">
                                                <input 
                                                    type="checkbox" 
                                                    className="form-check-input m-0 cursor-pointer"
                                                    checked={selectedDepartures.includes(city)}
                                                    onChange={() => handleDepartureChange(city)}
                                                />
                                                <span className="text-muted">{city}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Duration checklist */}
                            <div className="filter-group">
                                <span className="small fw-bold text-dark d-block mb-2">Tour Duration</span>
                                <div className="d-flex flex-column gap-2">
                                    {[
                                        { key: 'under-5', label: 'Under 5 Days' },
                                        { key: '5-8', label: '5 to 8 Days' },
                                        { key: '8-11', label: '8 to 11 Days' },
                                        { key: '11-above', label: '11 Days & Above' }
                                    ].map(dur => (
                                        <label key={dur.key} className="checkbox-item d-flex justify-content-between align-items-center cursor-pointer small">
                                            <div className="d-flex align-items-center gap-2">
                                                <input 
                                                    type="checkbox" 
                                                    className="form-check-input m-0 cursor-pointer"
                                                    checked={selectedDurations.includes(dur.key)}
                                                    onChange={() => handleDurationChange(dur.key)}
                                                />
                                                <span className="text-muted">{dur.label}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </aside>

                    {/* Semi-transparent backdrop for mobile filter drawer */}
                    {mobileFilterOpen && (
                        <div className="filter-backdrop d-lg-none" onClick={() => setMobileFilterOpen(false)}></div>
                    )}

                    {/* COLUMN 2: PACKAGE LIST (col-lg-8) */}
                    <main className="col-lg-8">
                        <div className="d-flex flex-column gap-3">
                            {sortedPackages.length === 0 ? (
                                <div className="alert alert-light text-center py-5 rounded-4 shadow-sm border border-light">
                                    <i className="bi bi-compass fs-1 text-muted d-block mb-3"></i>
                                    <h4 className="fw-bold text-dark">No Packages Found</h4>
                                    <p className="text-muted small">Try modifying your filter selections or clearing your search term.</p>
                                    <button className="btn btn-sm btn-success rounded-pill px-4 mt-2 fw-bold" onClick={resetAllFilters}>
                                        Clear Filters
                                    </button>
                                </div>
                            ) : (
                                sortedPackages.map(pkg => (
                                    <article className="ft-list-card bg-white rounded-4 overflow-hidden shadow-sm border border-light d-flex flex-column flex-md-row" key={pkg.id}>
                                        {/* Card Image */}
                                        <div className="card-visual position-relative flex-shrink-0">
                                            <img src={pkg.image || '/assets/img/grentours_placeholder.png'} alt={pkg.title} className="w-100 h-100" style={{objectFit: 'cover'}} onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} />
                                            {pkg.badges && pkg.badges.length > 0 && (
                                                <span className="badge bg-danger position-absolute top-0 start-0 m-3 fw-bold" style={{fontSize: '11px'}}>
                                                    {pkg.badges[0]}
                                                </span>
                                            )}
                                            {/* Compare checkbox */}
                                            <div className="position-absolute bottom-0 start-0 m-3 px-2 py-1 rounded bg-dark bg-opacity-70 text-white d-flex align-items-center gap-1.5" style={{fontSize: '11px'}}>
                                                <input 
                                                    type="checkbox" 
                                                    className="form-check-input m-0 cursor-pointer"
                                                    style={{width: '13px', height: '13px'}}
                                                    checked={compareList.some(item => item.id === pkg.id)}
                                                    onChange={() => toggleCompare(pkg)}
                                                />
                                                <span className="cursor-pointer" onClick={() => toggleCompare(pkg)}>Compare</span>
                                            </div>
                                        </div>

                                        {/* Card Details */}
                                        <div className="card-info-side p-4 flex-grow-1 d-flex flex-column justify-content-between">
                                            <div>
                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                    <span className="badge bg-light text-success rounded-pill px-2 py-1 border border-success-subtle fw-semibold" style={{fontSize: '10px'}}>
                                                        {pkg.durationText}
                                                    </span>
                                                    <div className="d-flex align-items-center gap-1 text-warning" style={{fontSize: '11px'}}>
                                                        <i className="bi bi-star-fill"></i>
                                                        <span className="fw-bold text-dark">{pkg.rating}</span>
                                                        <span className="text-muted">({pkg.reviews})</span>
                                                    </div>
                                                </div>
                                                <h3 className="h5 fw-bold text-dark mb-2">
                                                    <Link href={`/packages/${pkg.id}`} className="text-decoration-none text-dark hover-success">
                                                        {pkg.title}
                                                    </Link>
                                                </h3>
                                                <p className="text-muted small text-truncate-2 mb-3">
                                                    {pkg.highlights}
                                                </p>
                                            </div>

                                            <div className="d-flex flex-wrap gap-2 mb-0 pt-2 border-top border-light-subtle" style={{fontSize: '11px'}}>
                                                {pkg.inclusions.map(inc => (
                                                    <span key={inc} className="text-muted d-flex align-items-center gap-1">
                                                        <i className="bi bi-check-circle-fill text-success" style={{fontSize: '9px'}}></i> {inc}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Card Actions / Price Side */}
                                        <div className="card-price-side p-4 bg-light bg-opacity-50 border-start border-light-subtle d-flex flex-column justify-content-between align-items-end text-end">
                                            <div>
                                                <span className="text-muted small d-block">Starts From</span>
                                                <div className="h4 fw-bold text-success my-1">{formatINR(pkg.price)}</div>
                                                <span className="text-muted d-block" style={{fontSize: '10px'}}>per person (excl. GST)</span>
                                            </div>
                                            <div className="w-100 d-flex flex-column gap-2 mt-3">
                                                <Link href={`/packages/${pkg.id}`} className="btn btn-sm btn-success rounded-pill fw-bold w-100 py-1.5" style={{fontSize: '12px'}}>
                                                    View Details
                                                </Link>
                                                <button className="btn btn-sm btn-outline-success rounded-pill fw-bold w-100 py-1.5" style={{fontSize: '12px'}} onClick={() => alert('Opening consultation form...')}>
                                                    Enquire Now
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    </main>

                </div>
            </div>

            {/* Mobile filter floating trigger button */}
            <div className="d-lg-none position-fixed bottom-0 start-50 translate-middle-x mb-4" style={{ zIndex: 999 }}>
                <button className="btn btn-success shadow-lg rounded-pill px-4 py-2.5 fw-bold d-flex align-items-center gap-2" onClick={() => setMobileFilterOpen(true)}>
                    <i className="bi bi-funnel-fill"></i> Filter &amp; Sort
                </button>
            </div>

            {/* Floating Comparison Drawer */}
            {compareList.length > 0 && (
                <div className="comparison-drawer show position-fixed bottom-0 start-0 w-100 bg-white border-top shadow-lg p-3" style={{zIndex: 999}}>
                    <div className="container-xl d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-3">
                            <span className="fw-bold text-dark small">{compareList.length} / 3 packages selected</span>
                            <div className="d-flex gap-2">
                                {compareList.map(item => (
                                    <div key={item.id} className="badge bg-light text-dark p-2 border border-light-subtle d-flex align-items-center gap-2 rounded-3">
                                        <span className="text-truncate" style={{maxWidth: '120px'}}>{item.title}</span>
                                        <button className="btn-close p-0" style={{fontSize: '8px'}} onClick={() => toggleCompare(item)}></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-success rounded-pill px-4 fw-bold" onClick={() => setShowCompareDialog(true)}>
                                Compare Now
                            </button>
                            <button className="btn btn-sm btn-light rounded-pill px-3" onClick={clearCompare}>
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Compare Modal */}
            {showCompareDialog && (
                <div className="modal fade show d-block" style={{background: 'rgba(0,0,0,0.5)', zIndex: 1050}}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content rounded-4 border-0 shadow-lg">
                            <div className="modal-header border-bottom p-3">
                                <h5 className="modal-title fw-bold">Package Comparison</h5>
                                <button type="button" className="btn-close" onClick={() => setShowCompareDialog(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="row g-3">
                                    {compareList.map(item => (
                                        <div className="col-md-4" key={item.id}>
                                            <div className="card h-100 rounded-3 border border-light-subtle">
                                                <img src={item.image || '/assets/img/grentours_placeholder.png'} alt={item.title} className="card-img-top" style={{height: '120px', objectFit: 'cover'}} onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} />
                                                <div className="card-body p-3">
                                                    <h6 className="fw-bold mb-2 text-dark">{item.title}</h6>
                                                    <div className="text-success fw-bold mb-2">{formatINR(item.price)}</div>
                                                    <ul className="list-unstyled small text-muted d-flex flex-column gap-1 border-top pt-2">
                                                        <li><strong>Duration:</strong> {item.durationText}</li>
                                                        <li><strong>Rating:</strong> {item.rating} ({item.reviews} reviews)</li>
                                                        <li><strong>Themes:</strong> {item.themes.join(', ')}</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer border-top p-3 justify-content-between">
                                <span className="small text-muted">Direct side-by-side package analysis complete.</span>
                                <button type="button" className="btn btn-sm btn-success rounded-pill px-4" onClick={() => setShowCompareDialog(false)}>
                                    Close Comparison
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function PackagesListPage() {
    return (
        <Suspense fallback={<div className="container py-5 text-center"><div className="spinner-border text-success"></div><p className="mt-2 text-muted">Loading packages...</p></div>}>
            <PackagesListContent />
        </Suspense>
    );
}

