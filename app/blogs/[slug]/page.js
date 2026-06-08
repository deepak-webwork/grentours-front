'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function BlogDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug;

    const [blog, setBlog] = useState(null);
    const [recentBlogs, setRecentBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!slug) return;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

        // Fetch detail article and recent list
        Promise.all([
            fetch(`${apiUrl}/api/v1/blogs/${slug}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Article not found');
                    }
                    return res.json();
                }),
            fetch(`${apiUrl}/api/v1/blogs`)
                .then(res => res.json())
                .catch(() => ({ success: false }))
        ])
        .then(([detailData, listData]) => {
            if (detailData.success && detailData.article) {
                setBlog(detailData.article);
                // Set meta tags dynamically
                if (typeof document !== 'undefined') {
                    document.title = detailData.article.meta_title || `${detailData.article.title} | grentours`;
                }
            } else {
                setError('Failed to load article content');
            }

            if (listData.success && listData.articles) {
                // Filter out current article from recent listing
                const filtered = listData.articles
                    .filter(a => a.slug !== slug)
                    .slice(0, 3);
                setRecentBlogs(filtered);
            }
        })
        .catch(err => {
            console.error('Error fetching blog details:', err);
            setError(err.message || 'Error occurred while loading blog');
        })
        .finally(() => {
            setLoading(false);
        });
    }, [slug]);

    const getBlogImage = (url) => {
        if (!url) return '/assets/img/grentours_placeholder.png';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        if (url.startsWith('/assets/')) {
            return url;
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        return `${apiUrl}${url}`;
    };

    if (error) {
        return (
            <div className="container py-5 text-center my-5">
                <div className="card shadow-sm border-0 p-5 max-w-500 mx-auto rounded-4">
                    <i className="bi bi-exclamation-triangle-fill text-warning fs-1 mb-3"></i>
                    <h2 className="fw-bold mb-2">Oops! Article Not Found</h2>
                    <p className="text-muted mb-4">The blog post you are looking for does not exist, has been removed, or has its URL modified.</p>
                    <Link href="/" className="btn btn-success px-4 py-2 rounded-pill shadow-sm">
                        <i className="bi bi-house-door-fill me-2"></i>
                        Return to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container py-5 my-3">
                <div className="row g-4">
                    {/* Left Detail Content Skeleton */}
                    <div className="col-lg-8">
                        <div className="mb-4">
                            <div className="ft-skeleton-line title mb-3" style={{ height: '38px', width: '90%' }}></div>
                            <div className="ft-skeleton-line meta" style={{ height: '14px', width: '40%' }}></div>
                        </div>
                        <div className="ft-skeleton-card-img mb-4 rounded-4" style={{ height: '400px', width: '100%' }}></div>
                        <div className="ft-skeleton-card-body p-0">
                            <div className="ft-skeleton-line mb-3" style={{ height: '16px', width: '95%' }}></div>
                            <div className="ft-skeleton-line mb-3" style={{ height: '16px', width: '92%' }}></div>
                            <div className="ft-skeleton-line mb-3" style={{ height: '16px', width: '90%' }}></div>
                            <div className="ft-skeleton-line mb-4" style={{ height: '16px', width: '70%' }}></div>
                            
                            <div className="ft-skeleton-line mb-3" style={{ height: '24px', width: '40%', marginTop: '30px' }}></div>
                            <div className="ft-skeleton-line mb-3" style={{ height: '16px', width: '95%' }}></div>
                            <div className="ft-skeleton-line mb-3" style={{ height: '16px', width: '93%' }}></div>
                            <div className="ft-skeleton-line mb-3" style={{ height: '16px', width: '88%' }}></div>
                        </div>
                    </div>

                    {/* Right Sidebar Skeleton */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm p-4 mb-4 rounded-4">
                            <div className="ft-skeleton-line mb-3" style={{ height: '20px', width: '50%' }}></div>
                            <div className="d-flex align-items-center mb-3">
                                <div className="rounded-circle bg-light me-3" style={{ width: '60px', height: '60px', animation: 'ft-skeleton-pulse 1.5s infinite ease-in-out' }}></div>
                                <div className="flex-grow-1">
                                    <div className="ft-skeleton-line mb-2" style={{ height: '14px', width: '70%' }}></div>
                                    <div className="ft-skeleton-line" style={{ height: '10px', width: '50%' }}></div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="card border-0 shadow-sm p-4 mb-4 rounded-4" style={{ height: '350px' }}>
                            <div className="ft-skeleton-card-img h-100 w-100 rounded-3"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="blog-detail-section py-5 bg-light-subtle">
            <div className="container-xl">
                {/* Breadcrumbs */}
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href="/" className="text-success text-decoration-none">Home</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Blog</li>
                    </ol>
                </nav>

                <div className="row g-4">
                    {/* Main Content Area */}
                    <div className="col-lg-8">
                        <article className="blog-article bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light">
                            {/* Article Header */}
                            <header className="mb-4">
                                <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-semibold mb-3">Travel Tips</span>
                                <h1 className="fw-extrabold text-dark display-6 mb-3 lh-sm">{blog.title}</h1>
                                
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 py-3 border-top border-bottom border-light">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="avatar bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                                            {(blog.author || 'g').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <span className="fw-semibold text-dark d-block leading-tight">{blog.author || 'grentours'}</span>
                                            <small className="text-muted">Travel Specialist</small>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-3 text-muted small">
                                        <span><i className="bi bi-calendar3 me-1"></i> {blog.created_at}</span>
                                        <span><i className="bi bi-clock me-1"></i> 6 min read</span>
                                    </div>
                                </div>
                            </header>

                            {/* Cover Image */}
                            <div className="blog-cover-wrap mb-4 overflow-hidden rounded-4 shadow-sm">
                                <img 
                                    src={getBlogImage(blog.cover_image)} 
                                    alt={blog.title} 
                                    className="img-fluid w-100"
                                    style={{ maxHeight: '480px', objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }}
                                />
                            </div>

                            {/* Summary / Introduction */}
                            {blog.summary && (
                                <div className="lead fw-normal text-muted mb-4 border-start border-success border-4 ps-3 py-1">
                                    {blog.summary}
                                </div>
                            )}

                            {/* HTML Content Body */}
                            <div 
                                className="blog-content-body text-secondary lh-lg"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />
                        </article>
                    </div>

                    {/* Sidebar Area */}
                    <div className="col-lg-4">
                        <aside className="blog-sidebar position-sticky" style={{ top: '100px' }}>
                            {/* Author Card */}
                            <div className="card border border-light bg-white p-4 shadow-sm rounded-4 mb-4 text-center">
                                <div className="mx-auto rounded-circle bg-success-subtle d-flex align-items-center justify-content-center text-success fw-bold mb-3 fs-3" style={{ width: '70px', height: '70px' }}>
                                    {(blog.author || 'G').charAt(0).toUpperCase()}
                                </div>
                                <h5 className="fw-bold mb-1">{blog.author || 'grentours'}</h5>
                                <p className="text-muted small mb-3">Writer & Explore Advisor at grentours</p>
                                <p className="small text-secondary mb-0">Crafting tailored guidelines and itineraries to ensure your family trips are unforgettable and hassle-free.</p>
                            </div>

                            {/* Advertisement Slot 1: Swiss Alps (Dynamic link pointing to PKG-SWS-002) */}
                            <div className="card border-0 overflow-hidden shadow-sm rounded-4 mb-4 bg-dark text-white position-relative" style={{ height: '320px' }}>
                                <img 
                                    src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80" 
                                    alt="Swiss Alps Ad" 
                                    className="w-100 h-100 object-fit-cover opacity-75"
                                />
                                <div className="card-img-overlay d-flex flex-column justify-content-end p-4 bg-gradient-dark">
                                    <span className="badge bg-danger rounded-pill align-self-start mb-2 px-3 py-2 small">Special Deal</span>
                                    <h4 className="fw-bold mb-1">Splendid Swiss Alps Rail Tour</h4>
                                    <p className="small mb-3 text-light-muted">8 Days starting from ₹1,85,000</p>
                                    <Link href="/packages/2" className="btn btn-success rounded-pill fw-semibold py-2 px-4 shadow">
                                        Book Swiss Tour
                                    </Link>
                                </div>
                            </div>

                            {/* Recent/Trending Blogs List */}
                            {recentBlogs.length > 0 && (
                                <div className="card border border-light bg-white p-4 shadow-sm rounded-4 mb-4">
                                    <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom border-light">Popular Stories</h5>
                                    <div className="d-flex flex-column gap-3">
                                        {recentBlogs.map(rBlog => (
                                            <Link href={`/blogs/${rBlog.slug}`} key={rBlog.id} className="d-flex align-items-center gap-3 text-decoration-none text-dark group-hover-success">
                                                <img 
                                                    src={getBlogImage(rBlog.cover_image)} 
                                                    alt={rBlog.title} 
                                                    className="rounded-3"
                                                    style={{ width: '70px', height: '55px', objectFit: 'cover' }}
                                                    onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }}
                                                />
                                                <div className="flex-grow-1">
                                                    <p className="mb-0 fw-semibold text-clamp-2 small leading-tight text-dark">{rBlog.title}</p>
                                                    <span className="text-muted small fs-7">{rBlog.created_at}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Advertisement Slot 2: Maldives (Dynamic link pointing to PKG-MLD-003) */}
                            <div className="card border-0 overflow-hidden shadow-sm rounded-4 mb-4 bg-dark text-white position-relative" style={{ height: '320px' }}>
                                <img 
                                    src="https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=600&q=80" 
                                    alt="Maldives Resort Ad" 
                                    className="w-100 h-100 object-fit-cover opacity-75"
                                />
                                <div className="card-img-overlay d-flex flex-column justify-content-end p-4 bg-gradient-dark">
                                    <span className="badge bg-warning text-dark rounded-pill align-self-start mb-2 px-3 py-2 small">Honeymoon Choice</span>
                                    <h4 className="fw-bold mb-1">Premium Maldives Water Villa</h4>
                                    <p className="small mb-3 text-light-muted">4 Days starting from ₹1,25,000</p>
                                    <Link href="/packages/3" className="btn btn-warning rounded-pill fw-semibold py-2 px-4 shadow text-dark">
                                        Explore Resort
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>

            {/* Custom styling scoped specifically to make HTML content render beautifully */}
            <style jsx global>{`
                .bg-gradient-dark {
                    background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0) 100%);
                }
                .text-light-muted {
                    color: rgba(255, 255, 255, 0.85);
                }
                .fs-7 {
                    font-size: 0.78rem;
                }
                .text-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .group-hover-success:hover p {
                    color: #198754 !important;
                }
                .blog-content-body h2, .blog-content-body h3, .blog-content-body h4 {
                    color: #212529;
                    font-weight: 700;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                }
                .blog-content-body p {
                    margin-bottom: 1.5rem;
                    color: #495057;
                }
                .blog-content-body ul, .blog-content-body ol {
                    margin-bottom: 1.5rem;
                    padding-left: 2rem;
                }
                .blog-content-body li {
                    margin-bottom: 0.5rem;
                    color: #495057;
                }
            `}</style>
        </div>
    );
}
