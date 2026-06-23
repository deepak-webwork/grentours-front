'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ListFilterHeader from '../../components/listing/ListFilterHeader';
import { getMediaUrl } from '../../lib/media';

export default function BlogsListPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
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

    const fetchBlogs = async (isLoadMore = false) => {
        try {
            const currentOffset = isLoadMore ? offset : 0;
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
            const res = await fetch(`${apiUrl}/api/v1/blogs?limit=${ITEMS_PER_PAGE}&offset=${currentOffset}`);
            const data = await res.json();
            if (data.success && data.articles) {
                if (isLoadMore) {
                    setBlogs(prev => [...prev, ...data.articles]);
                } else {
                    setBlogs(data.articles);
                }
                setHasMore(data.articles.length === ITEMS_PER_PAGE && blogs.length + data.articles.length < data.total);
            }
        } catch (err) {
            console.error('Error fetching blogs:', err);
        } finally {
            if (isLoadMore) {
                setLoadingMore(false);
            } else {
                setLoading(false);
            }
        }
    };
    
    useEffect(() => {
        fetchBlogs();
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
            fetchBlogs(true);
        }
    }, [offset]);

    const getBlogImage = (url) => getMediaUrl(url);

    const filteredBlogs = blogs.filter(blog => {
        return !searchQuery || 
            blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (blog.summary && blog.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    });

    const resetFilters = () => {
        setSearchQuery('');
    };

    if (loading) {
        return (
            <div className="packages-wrapper py-5 text-center">
                <link rel="stylesheet" href="/assets/css/packages-style.css" />
                <div className="container-xl py-5">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted fw-semibold">Loading travel blogs...</p>
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
                    <span className="active">Travel Blogs</span>
                </div>

                {/* Page Header Card */}
                <div className="list-header-card p-4 rounded-4 bg-white shadow-sm border border-light mb-4">
                    <div className="list-header-info">
                        <h1 className="h3 fw-bold text-dark mb-1">Travel Blogs</h1>
                        <p className="text-muted mb-0">Showing {filteredBlogs.length} travel blogs</p>
                    </div>
                </div>

                {/* 2-Column Layout */}
                <div className="row g-4 position-relative">
                    {/* Sidebar */}
                    <aside className={`col-lg-4 filter-sidebar-mobile ${mobileFilterOpen ? 'show' : ''}`}>
                        <div className="filter-card bg-white p-4 rounded-4 shadow-sm border border-light sticky-top" style={{top: '120px'}}>
                            <ListFilterHeader
                                title="Filters"
                                onReset={resetFilters}
                                onClose={() => setMobileFilterOpen(false)}
                            />

                            <div className="filter-drawer-body">
                            <div className="filter-group mb-4">
                                <label className="form-label small fw-bold text-dark mb-2">Search Blogs</label>
                                <div className="input-group input-group-sm">
                                    <span className="input-group-text bg-white border-light-subtle"><i className="bi bi-search text-muted"></i></span>
                                    <input 
                                        type="text" 
                                        className="form-control border-light-subtle" 
                                        placeholder="Search by title or description..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            </div>

                            <div className="filter-drawer-footer d-lg-none">
                                <button type="button" className="filter-drawer-apply-btn" onClick={() => setMobileFilterOpen(false)}>
                                    Show {filteredBlogs.length} Results
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Semi-transparent backdrop for mobile filter drawer */}
                    {mobileFilterOpen && (
                        <div className="filter-backdrop d-lg-none" onClick={() => setMobileFilterOpen(false)}></div>
                    )}

                    {/* Blog Cards List */}
                    <main className="col-lg-8">
                        <div className="packages-list-container">
                            {filteredBlogs.length === 0 ? (
                                <div className="packages-empty-state">
                                    <i className="bi bi-journal-text"></i>
                                    <h3>No Blogs Found</h3>
                                    <p>Try modifying your search query or check back later for new articles.</p>
                                    <button className="btn btn-sm btn-success rounded-pill px-4 mt-2 fw-bold" onClick={resetFilters}>
                                        Clear Filters
                                    </button>
                                </div>
                            ) : (
                                filteredBlogs.map(blog => {
                                    const formattedDate = (() => {
                                        try {
                                            const d = new Date(blog.created_at);
                                            if (isNaN(d.getTime())) return blog.created_at;
                                            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                        } catch (e) {
                                            return blog.created_at;
                                        }
                                    })();

                                    return (
                                        <article key={blog.id} className="package-card-premium" style={{ marginBottom: '20px' }}>
                                            {/* Card Image */}
                                            <div className="card-img-side">
                                                <img 
                                                    src={getBlogImage(blog.cover_image)} 
                                                    alt={blog.title} 
                                                    onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} 
                                                />
                                                <span className="card-ribbon">Blog</span>
                                            </div>

                                            {/* Card Details */}
                                            <div className="card-details-side">
                                                <div>
                                                    <div className="card-tags">
                                                        <span className="tag-badge outline">Travel Guide</span>
                                                    </div>
                                                    <h3>
                                                        <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                                                    </h3>
                                                    <div className="card-ratings">
                                                        <span className="rating-stars">
                                                            <i className="bi bi-person-circle text-muted"></i>
                                                        </span>
                                                        <span className="fw-bold text-dark ms-1">{blog.author?.name || 'Grentours'}</span>
                                                        <span className="review-count">{formattedDate}</span>
                                                    </div>
                                                    <p className="card-highlights">{blog.summary}</p>
                                                </div>

                                                <div className="inclusions-row mt-3">
                                                    <span className="inclusion-item">
                                                        <i className="bi bi-clock-fill"></i> 5 min read
                                                    </span>
                                                    <span className="inclusion-item">
                                                        <i className="bi bi-bookmark-fill"></i> Travel Tips
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Card Actions Side */}
                                            <div className="card-price-side">
                                                <div className="card-actions-stack">
                                                    <Link href={`/blogs/${blog.slug}`} className="action-btn-primary">
                                                        Read Article
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })
                            )}
                            
                            {/* Loading More Indicator */}
                            {loadingMore && (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-success" role="status">
                                        <span className="visually-hidden">Loading more blogs...</span>
                                    </div>
                                    <p className="mt-3 text-muted fw-semibold">Loading more blogs...</p>
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
