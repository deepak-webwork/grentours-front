'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ListFilterHeader from '../../components/listing/ListFilterHeader';

export default function VisaListPage() {
    const [visaFilter, setVisaFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [visaDestinations, setVisaDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
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

    const fetchVisas = async (isLoadMore = false) => {
        try {
            const currentOffset = isLoadMore ? offset : 0;
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
            const res = await fetch(`${apiUrl}/api/v1/visa-destinations?limit=${ITEMS_PER_PAGE}&offset=${currentOffset}`);
            const data = await res.json();
            if (data.success && data.destinations) {
                if (isLoadMore) {
                    setVisaDestinations(prev => [...prev, ...data.destinations]);
                } else {
                    setVisaDestinations(data.destinations);
                }
                setHasMore(data.destinations.length === ITEMS_PER_PAGE && visaDestinations.length + data.destinations.length < data.total);
            }
        } catch (err) {
            console.error('Error fetching visas:', err);
        } finally {
            if (isLoadMore) {
                setLoadingMore(false);
            } else {
                setLoading(false);
            }
        }
    };
    
    useEffect(() => {
        fetchVisas();
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
            fetchVisas(true);
        }
    }, [offset]);

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

    const resetFilters = () => {
        setVisaFilter('all');
        setSearchQuery('');
    };

    const filteredVisas = visaDestinations.filter(item => {
        const matchesFilter = visaFilter === 'all' || item.category === visaFilter;
        const matchesSearch = !searchQuery || 
            item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return (
            <div className="packages-wrapper py-5 text-center">
                <link rel="stylesheet" href="/assets/css/visa-style.css" />
                <link rel="stylesheet" href="/assets/css/home-style.css" />
                <link rel="stylesheet" href="/assets/css/packages-style.css" />
                <div className="container-xl py-5">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted fw-semibold">Loading visa destinations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="packages-wrapper py-4">
            <link rel="stylesheet" href="/assets/css/visa-style.css" />
            <link rel="stylesheet" href="/assets/css/home-style.css" />
            <link rel="stylesheet" href="/assets/css/packages-style.css" />
            
            <div className="container-xl">
                {/* Breadcrumbs */}
                <div className="packages-breadcrumb mb-3">
                    <Link href="/">Home</Link> &nbsp;/&nbsp; 
                    <span className="active">Visa Destinations</span>
                </div>

                {/* Page Title Card */}
                <div className="list-header-card p-4 rounded-4 bg-white shadow-sm border border-light mb-4">
                    <div className="list-header-info">
                        <h1 className="h3 fw-bold text-dark mb-1">Visa Destinations</h1>
                        <p className="text-muted mb-0">Showing {filteredVisas.length} visa destinations based on your filters</p>
                    </div>
                </div>

                {/* 2-Column Grid Layout */}
                <div className="row g-4 position-relative">
                    
                    {/* COLUMN 1: SIDEBAR FILTERS */}
                    <aside className={`col-lg-4 filter-sidebar-mobile ${mobileFilterOpen ? 'show' : ''}`}>
                        <div className="filter-card bg-white p-4 rounded-4 shadow-sm border border-light sticky-top" style={{top: '120px'}}>
                            <ListFilterHeader
                                title="Filters"
                                onReset={resetFilters}
                                onClose={() => setMobileFilterOpen(false)}
                            />

                            <div className="filter-drawer-body">
                            {/* Search bar inside filters */}
                            <div className="filter-group mb-4">
                                <label className="form-label small fw-bold text-dark mb-2">Search Country</label>
                                <div className="input-group input-group-sm">
                                    <span className="input-group-text bg-white border-light-subtle"><i className="bi bi-search text-muted"></i></span>
                                    <input 
                                        type="text" 
                                        className="form-control border-light-subtle" 
                                        placeholder="Country name..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Visa Category checklist */}
                            <div className="filter-group mb-4">
                                <span className="small fw-bold text-dark d-block mb-2">Visa Type</span>
                                <div className="d-flex flex-column gap-2">
                                    {[
                                        { key: 'all', label: 'All Visa Types' },
                                        { key: 'e-visa', label: 'E-Visa' },
                                        { key: 'stamped', label: 'Stamped Visa' },
                                        { key: 'arrival', label: 'Visa on Arrival' }
                                    ].map(cat => (
                                        <label key={cat.key} className="checkbox-item d-flex justify-content-between align-items-center cursor-pointer small">
                                            <div className="d-flex align-items-center gap-2">
                                                <input 
                                                    type="radio" 
                                                    name="visaType"
                                                    className="form-check-input m-0 cursor-pointer"
                                                    checked={visaFilter === cat.key}
                                                    onChange={() => setVisaFilter(cat.key)}
                                                />
                                                <span className="text-muted">{cat.label}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            </div>

                            <div className="filter-drawer-footer d-lg-none">
                                <button type="button" className="filter-drawer-apply-btn" onClick={() => setMobileFilterOpen(false)}>
                                    Show {filteredVisas.length} Results
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Semi-transparent backdrop for mobile filter drawer */}
                    {mobileFilterOpen && (
                        <div className="filter-backdrop d-lg-none" onClick={() => setMobileFilterOpen(false)}></div>
                    )}

                    {/* COLUMN 2: VISA LIST (col-lg-8) */}
                    <main className="col-lg-8">
                        <div className="packages-list-container">
                            {filteredVisas.length === 0 ? (
                                <div className="packages-empty-state">
                                    <i className="bi bi-passport"></i>
                                    <h3>No Visa Destinations Found</h3>
                                    <p>Try modifying your filter selections or clearing your search term.</p>
                                    <button className="btn btn-sm btn-success rounded-pill px-4 mt-2 fw-bold" onClick={resetFilters}>
                                        Clear Filters
                                    </button>
                                </div>
                            ) : (
                                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px'}}>
                                    {filteredVisas.map((visa, idx) => (
                                        <Link 
                                            href={`/visa/${visa.slug}`} 
                                            key={idx} 
                                            className="text-decoration-none" 
                                            style={{
                                                display: 'block', 
                                                borderRadius: '16px', 
                                                overflow: 'hidden', 
                                                background: '#fff', 
                                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
                                                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                                            }}
                                        >
                                            <div style={{
                                                position: 'relative',
                                                height: '200px', 
                                                overflow: 'hidden'
                                            }}>
                                                <img 
                                                    src={getImageUrl(visa.img)} 
                                                    alt={visa.name} 
                                                    style={{
                                                        width: '100%', 
                                                        height: '100%', 
                                                        objectFit: 'cover',
                                                        transition: 'transform 0.4s ease'
                                                    }}
                                                    onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} 
                                                    onMouseOver={(e) => { e.target.style.transform = 'scale(1.05)'; }}
                                                    onMouseOut={(e) => { e.target.style.transform = 'scale(1)'; }}
                                                />
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '12px',
                                                    right: '12px',
                                                    background: visa.category === 'e-visa' ? '#24b25a' : 
                                                                 visa.category === 'stamped' ? '#2563eb' : '#f59e0b',
                                                    color: '#fff',
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '11px',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {visa.category === 'e-visa' ? 'E-Visa' : 
                                                     visa.category === 'stamped' ? 'Stamped' : 'On Arrival'}
                                                </div>
                                            </div>
                                            <div style={{padding: '18px'}}>
                                                <div style={{
                                                    fontSize: '18px', 
                                                    fontWeight: '700', 
                                                    color: '#0f172a', 
                                                    marginBottom: '8px'
                                                }}>
                                                    {visa.name}
                                                </div>
                                                <div style={{
                                                    fontSize: '13px', 
                                                    color: '#64748b',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}>
                                                    <i className="bi bi-passport-fill" style={{color: '#24b25a'}}></i>
                                                    {visa.count}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                            
                            {/* Loading More Indicator */}
                            {loadingMore && (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-success" role="status">
                                        <span className="visually-hidden">Loading more visa destinations...</span>
                                    </div>
                                    <p className="mt-3 text-muted fw-semibold">Loading more visa destinations...</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {/* Mobile filter floating trigger button */}
            <div className="d-lg-none position-fixed bottom-0 start-50 translate-middle-x mb-4" style={{ zIndex: 999 }}>
                <button className="btn btn-success shadow-lg rounded-pill px-4 py-2.5 fw-bold d-flex align-items-center gap-2" onClick={() => setMobileFilterOpen(true)}>
                    <i className="bi bi-funnel-fill"></i> Filter
                </button>
            </div>
        </div>
    );
}
