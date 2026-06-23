'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ListFilterHeader from '../../components/listing/ListFilterHeader';
import { getMediaUrl } from '../../lib/media';

function PackagesListContent() {
    const searchParams = useSearchParams();

    // Data states
    const [rawPackages, setRawPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const [error, setError] = useState(null);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    useEffect(() => {
        if (mobileFilterOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileFilterOpen]);
    
    const ITEMS_PER_PAGE = 10;

    // Filter states
    const [priceLimit, setPriceLimit] = useState(500000);
    const [selectedThemes, setSelectedThemes] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [selectedDurations, setSelectedDurations] = useState([]);
    const [sortOption, setSortOption] = useState('deals');
    const [searchQuery, setSearchQuery] = useState('');

    // Comparison state
    const [compareList, setCompareList] = useState([]);
    const [showCompareDialog, setShowCompareDialog] = useState(false);

    // Fetch packages function
    const fetchPackages = async (isLoadMore = false) => {
        try {
            const currentOffset = isLoadMore ? offset : 0;
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
            const res = await fetch(`${apiUrl}/api/v1/packages?limit=${ITEMS_PER_PAGE}&offset=${currentOffset}`);
            if (!res.ok) throw new Error("Failed to fetch packages");
            const resData = await res.json();
            if (resData.success) {
                if (isLoadMore) {
                    setRawPackages(prev => [...prev, ...resData.data]);
                } else {
                    setRawPackages(resData.data);
                }
                setHasMore(resData.data.length === ITEMS_PER_PAGE && rawPackages.length + resData.data.length < resData.total);
            } else {
                throw new Error(resData.message || "Failed to load packages");
            }
        } catch (err) {
            console.error("Error loading packages:", err);
            setError(err.message);
        } finally {
            if (isLoadMore) {
                setLoadingMore(false);
            } else {
                setLoading(false);
            }
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchPackages();
    }, []);
    
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
            setLoadingMore(true);
            fetchPackages(true);
        }
    }, [offset]);

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
        
        const getImageUrl = (url) => getMediaUrl(url);

        const themes = Array.isArray(pkg.themes) 
            ? pkg.themes.map(t => t.slug || t.name?.toLowerCase()) 
            : [];

        const badges = Array.isArray(pkg.tags) 
            ? pkg.tags.map(t => t.name) 
            : [];

        const amenities = Array.isArray(pkg.amenities)
            ? pkg.amenities.map(a => a.name)
            : [];

        const attributeValues = Array.isArray(pkg.attribute_values) ? pkg.attribute_values : [];

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
            attributeValues: attributeValues,
            inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions : ["hotels", "meals", "transfers"],
            badges: badges,
            highlights: pkg.highlights || "",
            location: pkg.location || "India",
            city: pkg.city || null,
            state: pkg.state || null,
            country: pkg.country || null,
            continent: pkg.continent || null,
            tourType: pkg.package_type || "Holiday Tour",
            groupSize: "15 People",
            languages: "English, Hindi",
            description: pkg.overview || pkg.description || "",
            amenities: amenities,
            tourPlan: pkg.tourPlan || [],
            images: pkg.images || [getImageUrl(pkg.image)]
        };
    });

    // Gather all unique themes dynamically from all packages
    const allThemesMap = {};
    rawPackages.forEach(pkg => {
        if (Array.isArray(pkg.themes)) {
            pkg.themes.forEach(theme => {
                if (theme.slug) {
                    allThemesMap[theme.slug] = theme.name;
                }
            });
        }
    });
    const allThemes = Object.entries(allThemesMap).map(([key, label]) => ({ key, label }));

    // Gather all attributes and their unique values dynamically from all packages
    const attributesMap = {};
    rawPackages.forEach(pkg => {
        if (Array.isArray(pkg.attribute_values)) {
            pkg.attribute_values.forEach(av => {
                if (av.attribute) {
                    const attrSlug = av.attribute.slug;
                    const attrName = av.attribute.name;
                    if (!attributesMap[attrSlug]) {
                        attributesMap[attrSlug] = {
                            name: attrName,
                            values: new Set()
                        };
                    }
                    attributesMap[attrSlug].values.add(av.value);
                }
            });
        }
    });

    const dynamicAttributes = Object.entries(attributesMap).map(([slug, data]) => ({
        slug,
        name: data.name,
        values: Array.from(data.values).sort()
    }));

    // Handle filter actions
    const handleThemeChange = (themeVal) => {
        setSelectedThemes(prev => 
            prev.includes(themeVal) ? prev.filter(t => t !== themeVal) : [...prev, themeVal]
        );
    };

    const handleAttributeChange = (attrSlug, value) => {
        setSelectedAttributes(prev => {
            const currentVals = prev[attrSlug] || [];
            const newVals = currentVals.includes(value)
                ? currentVals.filter(v => v !== value)
                : [...currentVals, value];
            return {
                ...prev,
                [attrSlug]: newVals
            };
        });
    };

    const handleDurationChange = (durKey) => {
        setSelectedDurations(prev => 
            prev.includes(durKey) ? prev.filter(d => d !== durKey) : [...prev, durKey]
        );
    };

    const resetAllFilters = () => {
        setPriceLimit(500000);
        setSelectedThemes([]);
        setSelectedAttributes({});
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
            const matchesCity = pkg.city && pkg.city.toLowerCase().includes(query);
            const matchesState = pkg.state && pkg.state.toLowerCase().includes(query);
            const matchesCountry = pkg.country && pkg.country.toLowerCase().includes(query);
            const matchesContinent = pkg.continent && pkg.continent.toLowerCase().includes(query);
            const matchesHighlights = pkg.highlights.toLowerCase().includes(query);
            if (!matchesTitle && !matchesLocation && !matchesCity && !matchesState && !matchesCountry && !matchesContinent && !matchesHighlights) return false;
        }

        // Selected Themes
        if (selectedThemes.length > 0) {
            const matchesTheme = pkg.themes.some(t => selectedThemes.includes(t));
            if (!matchesTheme) return false;
        }

        // Selected Dynamic Attributes
        for (const [attrSlug, vals] of Object.entries(selectedAttributes)) {
            if (vals && vals.length > 0) {
                const packageVals = pkg.attributeValues
                    ? pkg.attributeValues.filter(av => av.attribute && av.attribute.slug === attrSlug).map(av => av.value)
                    : [];
                const matches = packageVals.some(v => vals.includes(v));
                if (!matches) return false;
            }
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
                            <ListFilterHeader
                                title="Filters"
                                onReset={resetAllFilters}
                                onClose={() => setMobileFilterOpen(false)}
                            />

                            <div className="filter-drawer-body">
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
                                    {(allThemes.length > 0 ? allThemes : [
                                        { key: 'bestseller', label: 'Bestseller Packages' },
                                        { key: 'family', label: 'Family Group Tours' },
                                        { key: 'honeymoon', label: 'Honeymoon Specials' },
                                        { key: 'summer', label: 'Summer Specials' },
                                        { key: 'spiritual', label: 'Spiritual / Pilgrimage' },
                                        { key: 'exotic', label: 'Exotic & Self Drive' }
                                    ]).map(theme => (
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

                            {/* Dynamic package attributes from backend */}
                            {dynamicAttributes.map(attr => (
                                <div className="filter-group mb-4" key={attr.slug}>
                                    <span className="small fw-bold text-dark d-block mb-2">{attr.name}</span>
                                    <div className="d-flex flex-column gap-2" style={{maxHeight: '160px', overflowY: 'auto'}}>
                                        {attr.values.map(val => (
                                            <label key={val} className="checkbox-item d-flex justify-content-between align-items-center cursor-pointer small">
                                                <div className="d-flex align-items-center gap-2">
                                                    <input 
                                                        type="checkbox" 
                                                        className="form-check-input m-0 cursor-pointer"
                                                        checked={(selectedAttributes[attr.slug] || []).includes(val)}
                                                        onChange={() => handleAttributeChange(attr.slug, val)}
                                                    />
                                                    <span className="text-muted">{val}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}

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

                            <div className="filter-drawer-footer d-lg-none">
                                <button type="button" className="filter-drawer-apply-btn" onClick={() => setMobileFilterOpen(false)}>
                                    Show {sortedPackages.length} Results
                                </button>
                            </div>

                        </div>
                    </aside>

                    {/* Semi-transparent backdrop for mobile filter drawer */}
                    {mobileFilterOpen && (
                        <div className="filter-backdrop d-lg-none" onClick={() => setMobileFilterOpen(false)}></div>
                    )}

                    {/* COLUMN 2: PACKAGE LIST (col-lg-8) */}
                    <main className="col-lg-8">
                        <div className="packages-list-container">
                            {sortedPackages.length === 0 ? (
                                <div className="packages-empty-state">
                                    <i className="bi bi-compass"></i>
                                    <h3>No Packages Found</h3>
                                    <p>Try modifying your filter selections or clearing your search term.</p>
                                    <button className="btn btn-sm btn-success rounded-pill px-4 mt-2 fw-bold" onClick={resetAllFilters}>
                                        Clear Filters
                                    </button>
                                </div>
                            ) : (
                                sortedPackages.map(pkg => (
                                    <article className="package-card-premium" key={pkg.id}>
                                        {/* Card Image */}
                                        <div className="card-img-side">
                                            <img 
                                                src={pkg.image || '/assets/img/grentours_placeholder.png'} 
                                                alt={pkg.title} 
                                                onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} 
                                            />
                                            {pkg.themes && pkg.themes.length > 0 && (
                                                <span className="card-ribbon">{pkg.themes[0]}</span>
                                            )}
                                            {/* Compare Toggle Button */}
                                            <button 
                                                className={`card-wishlist-btn ${compareList.some(item => item.id === pkg.id) ? 'active' : ''}`}
                                                onClick={() => toggleCompare(pkg)}
                                                title="Compare this package"
                                            >
                                                <i className={`bi ${compareList.some(item => item.id === pkg.id) ? 'bi-check-circle-fill' : 'bi-plus-circle'}`}></i>
                                            </button>
                                        </div>

                                        {/* Card Details */}
                                        <div className="card-details-side">
                                            <div>
                                                <div className="card-tags">
                                                    {pkg.badges && pkg.badges.length > 0 ? (
                                                        pkg.badges.map(badge => (
                                                            <span key={badge} className="tag-badge filled">{badge}</span>
                                                        ))
                                                    ) : (
                                                        <span className="tag-badge outline">{pkg.tourType}</span>
                                                    )}
                                                </div>
                                                <h3>
                                                    <Link href={`/packages/${pkg.slug}`}>
                                                        {pkg.title}
                                                    </Link>
                                                </h3>
                                                <div className="card-ratings">
                                                    <span className="rating-stars">
                                                        <i className="bi bi-star-fill text-warning"></i>
                                                    </span>
                                                    <span className="fw-bold text-dark ms-1">{pkg.rating}</span>
                                                    <span className="review-count">({pkg.reviews} reviews)</span>
                                                </div>
                                                <p className="card-highlights">
                                                    {pkg.highlights}
                                                </p>

                                                {/* Compact specifications row */}
                                                <div className="card-specs-row">
                                                    <span className="spec-pill" title="Duration">
                                                        <i className="bi bi-clock-fill text-success"></i> {pkg.durationText}
                                                    </span>
                                                    {pkg.attributeValues.map(av => {
                                                        let icon = "bi-check-circle-fill";
                                                        let colorClass = "text-muted";
                                                        let displayValue = av.value;
                                                        if (av.attribute) {
                                                            if (av.attribute.slug === 'visa-included') {
                                                                icon = "bi-file-earmark-text-fill";
                                                                colorClass = "text-info";
                                                                displayValue = av.value.toLowerCase() === 'yes' ? "Visa Incl." : "Visa Excl.";
                                                            } else if (av.attribute.slug === 'transfers-included') {
                                                                icon = "bi-truck";
                                                                colorClass = "text-primary";
                                                                displayValue = av.value.toLowerCase() === 'yes' ? "Transfers Incl." : "Transfers Excl.";
                                                            } else if (av.attribute.slug === 'meal-type') {
                                                                icon = "bi-egg-fried";
                                                                colorClass = "text-warning";
                                                            } else if (av.attribute.slug === 'tour-type') {
                                                                icon = "bi-people-fill";
                                                                colorClass = "text-secondary";
                                                            }
                                                        }
                                                        return (
                                                            <span key={av.id} className="spec-pill" title={`${av.attribute?.name}: ${av.value}`}>
                                                                <i className={`bi ${icon} ${colorClass}`}></i> {displayValue}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="inclusions-row mt-3">
                                                {pkg.inclusions.map(inc => (
                                                    <span key={inc} className="inclusion-item">
                                                        <i className="bi bi-check-circle-fill"></i> {inc}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Card Actions / Price Side */}
                                        <div className="card-price-side">
                                            <div>
                                                <span className="price-label">Starts From</span>
                                                <div className="price-value">{formatINR(pkg.price)}</div>
                                                <span className="price-subtitle">per person (excl. GST)</span>
                                            </div>
                                            <div className="card-actions-stack">
                                                <Link href={`/packages/${pkg.slug}`} className="action-btn-primary">
                                                    View Details
                                                </Link>
                                                <button className="action-btn-secondary" onClick={() => alert('Opening consultation form...')}>
                                                    Enquire Now
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            )}
                            
                            {/* Loading More Indicator */}
                            {loadingMore && (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-success" role="status">
                                        <span className="visually-hidden">Loading more packages...</span>
                                    </div>
                                    <p className="mt-3 text-muted fw-semibold">Loading more packages...</p>
                                </div>
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
