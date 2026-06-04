'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function HomePage() {
    // Offers tabs state: 'tours' or 'hotels'
    const [offersTab, setOffersTab] = useState('tours');

    // Visa destinations filter: 'e-visa', 'stamped', 'arrival'
    const [visaFilter, setVisaFilter] = useState('e-visa');

    // About Us section read-more state
    const [isAboutExpanded, setIsAboutExpanded] = useState(false);

    // YouTube Reels/Video Modal state
    const [activeReel, setActiveReel] = useState(null); // { id, title, desc, isLandscape }

    // MICE Enquiry Modal state
    const [showMiceModal, setShowMiceModal] = useState(false);
    const [miceForm, setMiceForm] = useState({
        company: '',
        contactPerson: '',
        email: '',
        phone: '',
        eventType: '',
        attendees: ''
    });
    const [miceSubmitted, setMiceSubmitted] = useState(false);

    // Quick enquiry form state
    const [enquiryForm, setEnquiryForm] = useState({
        name: '',
        phone: '',
        email: '',
        interest: 'Europe Tours',
        month: 'Select Month',
        message: ''
    });
    const [enquirySubmitted, setEnquirySubmitted] = useState(false);

    // Scroll refs for custom smooth scrolls
    const themeScrollRef = useRef(null);
    const pkgScrollRef = useRef(null);
    const destScrollRef = useRef(null);
    const visaScrollRef = useRef(null);

    const defaultThemes = [
        {
            name: 'Chardham Tours',
            slug: 'spiritual',
            image_url: 'https://imgcdn.flamingotravels.co.in/Images/Website/ExploreDestinationByTheme/chardham-theme.jpg',
            packages_count: 3
        },
        {
            name: 'Super Seller Packages',
            slug: 'bestseller',
            image_url: 'https://imgcdn.flamingotravels.co.in/Images/Website/ExploreDestinationByTheme/trending-scandinavia.jpg',
            packages_count: 21
        },
        {
            name: 'Summer 2026 Tour',
            slug: 'summer',
            image_url: 'https://imgcdn.flamingotravels.co.in/Images/Website/ExploreDestinationByTheme/summer-tours.jpg',
            packages_count: 62
        },
        {
            name: 'Honeymoon',
            slug: 'honeymoon',
            image_url: 'https://imgcdn.flamingotravels.co.in/Images/Website/ExploreDestinationByTheme/honeymoo-tours.jpg',
            packages_count: 59
        },
        {
            name: 'Maharaj Tour',
            slug: 'family',
            image_url: 'https://imgcdn.flamingotravels.co.in/Images/Website/ExploreDestinationByTheme/chef-cooking.jpg',
            packages_count: 5
        },
        {
            name: 'Short Breaks',
            slug: 'short-breaks',
            image_url: 'https://imgcdn.flamingotravels.co.in/Images/Website/ExploreDestinationByTheme/short-breaks-tours.jpg',
            packages_count: 7
        },
        {
            name: 'Exotic Tours',
            slug: 'exotic',
            image_url: '/assets/img/home1/destination-card-img9.jpg',
            packages_count: 13
        },
        {
            name: 'Self Drive',
            slug: 'self-drive',
            image_url: 'https://imgcdn.flamingotravels.co.in/Images/Website/ExploreDestinationByTheme/self-drive-001.jpg',
            packages_count: 6
        },
        {
            name: 'Group Tours',
            slug: 'family',
            image_url: '/assets/img/home1/destination-card-img7.jpg',
            packages_count: 14
        },
        {
            name: 'Fixed Departure',
            slug: 'bestseller',
            image_url: '/assets/img/home1/destination-card-img9.jpg',
            packages_count: 18
        }
    ];

    const [themes, setThemes] = useState(defaultThemes);
    const [packages, setPackages] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [blogsLoading, setBlogsLoading] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        
        Promise.all([
            fetch(`${apiUrl}/api/v1/themes`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.themes) {
                        setThemes(data.themes);
                    }
                })
                .catch(err => console.error('Error fetching themes:', err)),
            fetch(`${apiUrl}/api/v1/packages`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.data) {
                        setPackages(data.data);
                    }
                })
                .catch(err => console.error('Error fetching packages:', err)),
            fetch(`${apiUrl}/api/v1/destinations`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.destinations) {
                        setDestinations(data.destinations);
                    }
                })
                .catch(err => console.error('Error fetching destinations:', err)),
            fetch(`${apiUrl}/api/v1/blogs`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.articles) {
                        setBlogs(data.articles);
                    }
                })
                .catch(err => console.error('Error fetching blogs:', err))
                .finally(() => setBlogsLoading(false))
        ]).finally(() => {
            setLoading(false);
        });
    }, []);

    const getThemeImage = (url) => {
        if (!url) return '/assets/img/grentours_placeholder.png';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        return `${apiUrl}${url}`;
    };

    const getDestinationImage = (url) => {
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

    const getPackageImage = (url) => {
        if (!url) return '/assets/img/grentours_placeholder.png';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        return `${apiUrl}${url}`;
    };

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

    // Open inquiry modal listener
    useEffect(() => {
        const handleOpenModal = () => {
            setShowMiceModal(true);
        };
        window.addEventListener('open-inquiry-modal', handleOpenModal);
        return () => {
            window.removeEventListener('open-inquiry-modal', handleOpenModal);
        };
    }, []);

    // Swiper blog initialization on blogs load
    useEffect(() => {
        if (!blogsLoading && blogs.length > 0 && typeof window !== 'undefined' && window.Swiper) {
            const sliderEl = document.querySelector('.trav-blog-slider');
            if (sliderEl && sliderEl.swiper) {
                sliderEl.swiper.destroy(true, true);
            }
            new window.Swiper(".trav-blog-slider", {
                slidesPerView: 4,
                speed: 800,
                spaceBetween: 16,
                loop: blogs.length >= 4,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                breakpoints: {
                    280: { slidesPerView: 1.3 },
                    576: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    992: { slidesPerView: 4 },
                    1200: { slidesPerView: 4 }
                }
            });
        }
    }, [blogsLoading, blogs]);

    // Custom scroll handlers
    const handleScroll = (ref, offset) => {
        if (ref.current) {
            ref.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    const handleDestScroll = (direction) => {
        if (destScrollRef.current) {
            const firstCard = destScrollRef.current.firstElementChild;
            if (!firstCard) return;
            const gap = 12;
            const cardW = firstCard.offsetWidth + gap;
            const scrollAmount = direction === 'left' ? -cardW * 2 : cardW * 2;
            destScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleVisaScroll = (direction) => {
        if (visaScrollRef.current) {
            const firstCard = visaScrollRef.current.firstElementChild;
            if (!firstCard) return;
            const gap = 18;
            const cardW = firstCard.offsetWidth + gap;
            const scrollAmount = direction === 'left' ? -cardW * 2 : cardW * 2;
            visaScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // YouTube Shorts dataset
    const travelShorts = [
        { id: 'o7_F1bU4yQc', title: 'South Africa Trip', desc: 'South Africa Trip #shorts #southafrica' },
        { id: 'm-WvQkRsw8A', title: 'Australia & New Zealand Tour', desc: 'Australia & New Zealand NRI Special Tour' },
        { id: 'K_QyWc6wL5Y', title: 'Sayonara Sayonara Japan Life', desc: 'Sayonara Sayonara Indians Living Japan Life' },
        { id: 'wN4_rA1L15I', title: 'Things To Do In Iceland', desc: 'Things To Do In Iceland #shorts #iceland' },
        { id: 'F18KzC_xQhQ', title: 'Maldives Paradise 🌴', desc: 'Sparkling crystal-clear waters, white sandy beaches, and luxurious overwater villas of Maldives.' },
        { id: '79bY0_y92tU', title: 'Glacier Express Train 🚂', desc: 'Experience the panoramic alpine train journey through majestic snowy valleys and high passes.' },
        { id: 'U1J-FvL9dD4', title: 'Pamukkale Travertines 💦', desc: 'Marveling at the spectacular milky-white thermal spring terraces and ancient ruins of Turkey.' },
        { id: 'V-E64c2U9Ew', title: 'Stunning Positano 🇮🇹', desc: 'Wandering along the colorful cliffside houses and dramatic coastal views of Italy\'s Amalfi Coast.' }
    ];

    const playRandomShort = () => {
        const randomIndex = Math.floor(Math.random() * travelShorts.length);
        const short = travelShorts[randomIndex];
        setActiveReel({ id: short.id, title: short.title, desc: short.desc, isLandscape: false });
    };

    // Quick enquiry handler
    const handleQuickEnquirySubmit = (e) => {
        e.preventDefault();
        setEnquirySubmitted(true);
        setTimeout(() => setEnquirySubmitted(false), 5000);
        setEnquiryForm({ name: '', phone: '', email: '', interest: 'Europe Tours', month: 'Select Month', message: '' });
    };

    // MICE enquiry handler
    const handleMiceEnquirySubmit = (e) => {
        e.preventDefault();
        setMiceSubmitted(true);
        setTimeout(() => {
            setMiceSubmitted(false);
            setShowMiceModal(false);
        }, 5000);
        setMiceForm({ company: '', contactPerson: '', email: '', phone: '', eventType: '', attendees: '' });
    };

    // Filter packages by type
    const dbTours = packages.filter(p => p.package_type === 'tour');
    const dbHotels = packages.filter(p => p.package_type === 'hotel');

    return (
        <>
            {/* ========================================
                 MAIN 2-COLUMN LAYOUT
            ======================================== */}
            <div className="ft-main-layout">
                <div className="container-xl">
                    <div className="row g-3">
                        
                        {/* ====== RIGHT SIDEBAR col-lg-4 ====== */}
                        <div className="col-lg-4" data-aos="fade-up">
                            <div className="ft-sidebar ft-sidebar-sticky">

                                {/* MICE Corporate Travel Card */}
                                <div className="ft-mice-card" data-aos="fade-up" onClick={() => setShowMiceModal(true)} style={{cursor: 'pointer'}}>
                                    <div className="ft-mice-header">
                                        <div className="mice-top-row">
                                            <div className="mice-big-logo">
                                                <span className="logo-solid-white">M</span>
                                                <span className="logo-outline-white">I</span>
                                                <span className="logo-outline-white">C</span>
                                                <span className="logo-outline-white">E</span>
                                            </div>
                                            <span className="ft-mice-tag">MICE</span>
                                        </div>
                                        <h4 className="mice-sub-title">Corporate Solutions</h4>
                                    </div>
                                    <div className="ft-mice-grid">
                                        <div className="ft-mice-item">
                                            <div className="ft-mice-icon"><i className="bi bi-briefcase-fill"></i></div>
                                            <span>Meetings</span>
                                        </div>
                                        <div className="ft-mice-item">
                                            <div className="ft-mice-icon"><i className="bi bi-trophy-fill"></i></div>
                                            <span>Incentives</span>
                                        </div>
                                        <div className="ft-mice-item">
                                            <div className="ft-mice-icon"><i className="bi bi-megaphone-fill"></i></div>
                                            <span>Conferences</span>
                                        </div>
                                        <div className="ft-mice-item">
                                            <div className="ft-mice-icon"><i className="bi bi-globe2"></i></div>
                                            <span>Exhibitions</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Promo card */}
                                <div className="ft-promo-card">
                                    <div className="ft-promo-img">
                                        <img src="/assets/img/bali-20526.png" alt="Bali Offer Banner" />
                                    </div>
                                </div>

                                {/* Partner/Airline Banner */}
                                <div className="ft-sidebar-ad">
                                    <div className="ft-sidebar-ad-img">
                                        <img src="/assets/img/AIR_Banner_f2_1.webp" alt="Partner Airline Banner" />
                                    </div>
                                </div>

                                {/* Quick Enquiry Form */}
                                <div className="ft-enquiry-card bg-white p-4 rounded-4 shadow-sm border border-light">
                                    <h4 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{color: '#0f172a'}}>
                                        <i className="bi bi-send-fill text-success"></i> Plan Your Custom Trip
                                    </h4>
                                    <p className="text-muted small mb-4">Tell us where you want to go and our travel specialists will curate a personalized itinerary for you.</p>

                                    {enquirySubmitted ? (
                                        <div className="alert alert-success text-center py-4 rounded-3 border-0">
                                            <i className="bi bi-check-circle-fill fs-2 text-success d-block mb-2"></i>
                                            <span className="fw-bold d-block">Inquiry Sent Successfully!</span>
                                            <span className="small text-muted mt-1 d-block">Our agent will call you within 2-4 hours.</span>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleQuickEnquirySubmit}>
                                            <div className="mb-3">
                                                <label className="form-label small fw-semibold text-muted mb-1">Your Name *</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control rounded-3 py-2 border-light-subtle" 
                                                    required 
                                                    placeholder="Enter full name"
                                                    value={enquiryForm.name}
                                                    onChange={(e) => setEnquiryForm({...enquiryForm, name: e.target.value})}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label small fw-semibold text-muted mb-1">Mobile Number *</label>
                                                <input 
                                                    type="tel" 
                                                    className="form-control rounded-3 py-2 border-light-subtle" 
                                                    required 
                                                    placeholder="+91 XXXXX XXXXX"
                                                    value={enquiryForm.phone}
                                                    onChange={(e) => setEnquiryForm({...enquiryForm, phone: e.target.value})}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label small fw-semibold text-muted mb-1">Interested In *</label>
                                                <select 
                                                    className="form-select rounded-3 py-2 border-light-subtle"
                                                    value={enquiryForm.interest}
                                                    onChange={(e) => setEnquiryForm({...enquiryForm, interest: e.target.value})}
                                                >
                                                    <option value="Europe Tours">Europe Tours</option>
                                                    <option value="Bali / Asia Tours">Bali / Asia Tours</option>
                                                    <option value="Maldives Resort stay">Maldives Resort stay</option>
                                                    <option value="Egypt & Nile Cruise">Egypt & Nile Cruise</option>
                                                    <option value="Chardham Yatra">Chardham Yatra</option>
                                                    <option value="Other">Other Exotic Escape</option>
                                                </select>
                                            </div>
                                            <div className="mb-4">
                                                <label className="form-label small fw-semibold text-muted mb-1">Any Specific Requirements?</label>
                                                <textarea 
                                                    className="form-control rounded-3 border-light-subtle" 
                                                    rows="3" 
                                                    placeholder="Enter special meals, dates, room options..."
                                                    value={enquiryForm.message}
                                                    onChange={(e) => setEnquiryForm({...enquiryForm, message: e.target.value})}
                                                />
                                            </div>
                                            <button type="submit" className="btn btn-success w-100 py-2.5 rounded-pill fw-bold text-uppercase" style={{fontSize: '13px', letterSpacing: '0.5px'}}>
                                                Send Enquiry <i className="bi bi-arrow-right ms-1"></i>
                                            </button>
                                        </form>
                                    )}
                                </div>

                            </div>
                        </div>

                        {/* ====== LEFT COLUMN col-lg-8 ====== */}
                        <div className="col-lg-8">
                            <div className="ft-left-col">

                                {/* EXPLORE BY THEME */}
                                <div className="ft-card-section" data-aos="fade-up">
                                    <div className="ft-section-header">
                                        <h2>Explore Tour Packages by Theme</h2>
                                        <Link href="/packages">View All <i className="bi bi-arrow-right"></i></Link>
                                    </div>
                                    <div className="ft-theme-scroll-wrap">
                                        <button className="ft-theme-arrow left" onClick={() => handleScroll(themeScrollRef, -280)}>
                                            <i className="bi bi-chevron-left"></i>
                                        </button>
                                        <div className="ft-theme-scroll" id="themeScrollEl" ref={themeScrollRef}>
                                            {themes.map((theme, idx) => (
                                                <Link key={idx} href={`/packages?theme=${theme.slug}`} className="ft-theme-card">
                                                    <div className="ft-theme-img">
                                                        <img src={getThemeImage(theme.image_url)} alt={theme.name} onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} />
                                                    </div>
                                                    <p>{theme.name}</p>
                                                    <span>{theme.packages_count ?? 0}+ Tours</span>
                                                </Link>
                                            ))}
                                        </div>
                                        <button className="ft-theme-arrow right" onClick={() => handleScroll(themeScrollRef, 280)}>
                                            <i className="bi bi-chevron-right"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* TRAVEL OFFERS */}
                                <div className="ft-card-section" data-aos="fade-up">
                                    <div className="ft-section-header">
                                        <h2>Travel Offers by Green Tours</h2>
                                        <Link href={offersTab === 'tours' ? '/packages' : '/hotels'}>
                                            View All <i className="bi bi-arrow-right"></i>
                                        </Link>
                                    </div>

                                    {/* Tabs: Tour Packages | Hotels */}
                                    <div className="ft-pkg-tabs">
                                        <button className={`ft-pkg-tab ${offersTab === 'tours' ? 'active' : ''}`} onClick={() => setOffersTab('tours')}>
                                            Tour Packages
                                        </button>
                                        <button className={`ft-pkg-tab ${offersTab === 'hotels' ? 'active' : ''}`} onClick={() => setOffersTab('hotels')}>
                                            Hotels
                                        </button>
                                    </div>

                                    {/* Tour Packages row */}
                                    {offersTab === 'tours' && (
                                        <div className="ft-pkg-slider" id="toursRow">
                                            <button className="ft-pkg-slide-btn prev-btn" onClick={() => handleScroll(pkgScrollRef, -290)}>
                                                <i className="bi bi-chevron-left"></i>
                                            </button>
                                            <div className="ft-pkg-row" id="pkgScrollEl" ref={pkgScrollRef}>
                                                {loading ? (
                                                    <>
                                                        {[1, 2, 3, 4].map((i) => (
                                                            <div className="ft-skeleton-card" key={i}>
                                                                <div className="ft-skeleton-card-img"></div>
                                                                <div className="ft-skeleton-card-body">
                                                                    <div className="ft-skeleton-line title"></div>
                                                                    <div className="ft-skeleton-line meta"></div>
                                                                    <div className="ft-skeleton-line meta" style={{ width: '45%' }}></div>
                                                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                                                        <div className="ft-skeleton-line price"></div>
                                                                        <div className="ft-skeleton-line btn"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </>
                                                ) : dbTours.length > 0 ? (
                                                    dbTours.map((pkg) => (
                                                        <div className="ft-pkg-card" key={pkg.id}>
                                                            <div className="ft-pkg-card-img">
                                                                <img src={getPackageImage(pkg.image)} alt={pkg.title} onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} />
                                                                <div className="ft-pkg-badge-wrap">
                                                                    {pkg.tags && pkg.tags.map(tag => (
                                                                        <span key={tag.id} className={`ft-pkg-badge ${tag.color || 'red'}`}>
                                                                            {tag.name}
                                                                        </span>
                                                                    ))}
                                                                    <span className="ft-pkg-badge blue">{pkg.duration_nights} Nights</span>
                                                                </div>
                                                            </div>
                                                            <div className="ft-pkg-card-body">
                                                                <div className="ft-pkg-card-title">{pkg.title}</div>
                                                                <div className="ft-pkg-meta">
                                                                    <span className="ft-pkg-meta-item"><i className="bi bi-geo-alt"></i> {pkg.location || (pkg.destination ? pkg.destination.name : 'Explore')}</span>
                                                                    <span className="ft-pkg-meta-item"><i className="bi bi-moon-stars"></i> {pkg.duration_nights}N / {pkg.duration_days}D</span>
                                                                    <span className="ft-pkg-meta-item"><i className="bi bi-people"></i> Group</span>
                                                                </div>
                                                                <div className="ft-pkg-card-footer">
                                                                    <div>
                                                                        <div className="ft-pkg-price-label">Starting From</div>
                                                                        <div className="ft-pkg-price">₹ {pkg.price.toLocaleString('en-IN')} <span>/ person</span></div>
                                                                    </div>
                                                                    <Link href={`/packages/${pkg.id}`} className="ft-view-btn text-decoration-none text-center d-flex align-items-center justify-content-center">
                                                                        view details
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="w-100 text-center py-4 text-muted">
                                                        No tour packages available at the moment.
                                                    </div>
                                                )}
                                            </div>

                                            <button className="ft-pkg-slide-btn next-btn" onClick={() => handleScroll(pkgScrollRef, 290)}>
                                                <i className="bi bi-chevron-right"></i>
                                            </button>
                                        </div>
                                    )}

                                    {/* Hotels row */}
                                    {offersTab === 'hotels' && (
                                        <div id="hotelsRow" style={{display: 'block'}}>
                                            <div className="ft-pkg-row">
                                                {loading ? (
                                                    <>
                                                        {[1, 2, 3, 4].map((i) => (
                                                            <div className="ft-skeleton-card" key={i}>
                                                                <div className="ft-skeleton-card-img"></div>
                                                                <div className="ft-skeleton-card-body">
                                                                    <div className="ft-skeleton-line title"></div>
                                                                    <div className="ft-skeleton-line meta"></div>
                                                                    <div className="ft-skeleton-line meta" style={{ width: '45%' }}></div>
                                                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                                                        <div className="ft-skeleton-line price"></div>
                                                                        <div className="ft-skeleton-line btn"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </>
                                                ) : dbHotels.length > 0 ? (
                                                    dbHotels.map((pkg) => (
                                                        <div className="ft-pkg-card" key={pkg.id}>
                                                            <div className="ft-pkg-card-img">
                                                                <img src={getPackageImage(pkg.image)} alt={pkg.title} onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} />
                                                                <div className="ft-pkg-badge-wrap">
                                                                    {pkg.tags && pkg.tags.map(tag => (
                                                                        <span key={tag.id} className={`ft-pkg-badge ${tag.color || 'red'}`}>
                                                                            {tag.name}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="ft-pkg-card-body">
                                                                <div className="ft-pkg-card-title">{pkg.title}</div>
                                                                <div className="ft-pkg-meta">
                                                                    <span className="ft-pkg-meta-item"><i className="bi bi-geo-alt"></i> {pkg.location || (pkg.destination ? pkg.destination.name : 'Explore')}</span>
                                                                    <span className="ft-pkg-meta-item"><i className="bi bi-star-fill" style={{color: '#f59e0b'}}></i> {pkg.tags && pkg.tags.length > 0 ? pkg.tags[0].name : 'Hotel'}</span>
                                                                </div>
                                                                <div className="ft-pkg-card-footer">
                                                                    <div>
                                                                        <div className="ft-pkg-price-label">Per Night</div>
                                                                        <div className="ft-pkg-price">₹ {pkg.price.toLocaleString('en-IN')}</div>
                                                                    </div>
                                                                    <Link href={`/packages/${pkg.id}`} className="ft-view-btn text-decoration-none text-center d-flex align-items-center justify-content-center">
                                                                        view details
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="w-100 text-center py-4 text-muted">
                                                        No hotels available at the moment.
                                                    </div>
                                                )}
</div>
                                        </div>
                                    )}

                                </div>

                                {/* TOP DESTINATIONS GRID */}
                                <div className="ft-card-section" data-aos="fade-up">
                                    <div className="ft-section-header">
                                        <h2>Top Trending Travel Destinations</h2>
                                        <Link href="/packages">View All <i className="bi bi-arrow-right"></i></Link>
                                    </div>
                                    <div className="ft-dest-slider">
                                        <button className="ft-dest-slide-btn prev-btn" onClick={() => handleDestScroll('left')}>
                                            <i className="bi bi-chevron-left"></i>
                                        </button>
                                        <div className="ft-dest-row" id="destScrollEl" ref={destScrollRef}>
                                             {(() => {
                                                 if (loading) {
                                                     return [1, 2, 3, 4, 5].map((i) => (
                                                         <div className="ft-skeleton-dest-card" key={i}>
                                                             <div className="ft-skeleton-dest-img"></div>
                                                             <div className="ft-skeleton-dest-meta">
                                                                 <div className="ft-skeleton-line" style={{ width: '80%', height: '14px' }}></div>
                                                                 <div className="ft-skeleton-line" style={{ width: '50%', height: '10px' }}></div>
                                                             </div>
                                                         </div>
                                                     ));
                                                 }
                                                 const trendingDests = destinations.filter(d => d.is_trending);
                                                 const displayDests = trendingDests.length > 0 ? trendingDests : destinations;

                                                 if (displayDests.length === 0) {
                                                     return (
                                                         <div className="w-100 text-center py-4 text-muted">
                                                             No destinations available at the moment.
                                                         </div>
                                                     );
                                                 }

                                                 return displayDests.map((dest, idx) => (
                                                     <Link href={`/packages?q=${encodeURIComponent(dest.name)}`} className="ft-dest-card text-decoration-none" key={idx} style={{ display: 'block' }}>
                                                         <div className="ft-dest-img-wrap">
                                                             <img src={getDestinationImage(dest.image)} alt={dest.name} onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} />
                                                         </div>
                                                         <div className="ft-dest-meta-wrap">
                                                             <div className="ft-dest-meta-row">
                                                                 <span className="ft-dest-name">{dest.name}</span>
                                                                 <span className="ft-dest-price-wrap">
                                                                     <span className="ft-dest-price-label">From</span>
                                                                     <span className="ft-dest-price">
                                                                         {dest.starting_price !== null && dest.starting_price !== undefined ? `₹${dest.starting_price.toLocaleString('en-IN')}` : 'N/A'}
                                                                     </span>
                                                                 </span>
                                                             </div>
                                                             <div className="ft-dest-packages">{dest.packages_count || 0} Packages</div>
                                                         </div>
                                                     </Link>
                                                 ));
                                             })()}
                                         </div>
                                        <button className="ft-dest-slide-btn next-btn" onClick={() => handleDestScroll('right')}>
                                            <i className="bi bi-chevron-right"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* EASY VISA DESTINATIONS */}
                                <div className="ft-card-section" data-aos="fade-up">
                                    <div className="ft-section-header" style={{flexWrap: 'wrap', gap: '10px'}}>
                                        <h2>Easy Visa Destinations</h2>
                                        <div className="visa-tabs" role="tablist" aria-label="Visa destination filters">
                                            <button 
                                                type="button" 
                                                className={`visa-tab ${visaFilter === 'e-visa' ? 'active' : ''}`}
                                                onClick={() => setVisaFilter('e-visa')}
                                            >
                                                Countries - with E Visa
                                            </button>
                                            <button 
                                                type="button" 
                                                className={`visa-tab ${visaFilter === 'stamped' ? 'active' : ''}`}
                                                onClick={() => setVisaFilter('stamped')}
                                            >
                                                Countries required Stamped Visa
                                            </button>
                                            <button 
                                                type="button" 
                                                className={`visa-tab ${visaFilter === 'arrival' ? 'active' : ''}`}
                                                onClick={() => setVisaFilter('arrival')}
                                            >
                                                Visa on arrival countries
                                            </button>
                                        </div>
                                    </div>
                                    <div className="easy-visa-area">
                                        <div className="easy-visa-wrapper">
                                            <button className="ft-dest-slide-btn prev-btn" onClick={() => handleVisaScroll('left')}>
                                                <i className="bi bi-chevron-left"></i>
                                            </button>
                                            <div className="visa-scroll" id="visaScroll" ref={visaScrollRef}>
                                                <div className="visa-inner">
                                                    
                                                    {[
                                                        { name: 'South Africa', count: '21+ Tours', category: 'e-visa', img: '/assets/img/home1/destination-card-img1.jpg' },
                                                        { name: 'Japan', count: '8+ Tours', category: 'stamped', img: '/assets/img/home1/destination-card-img2.jpg' },
                                                        { name: 'Europe', count: '24+ Tours', category: 'stamped', img: '/assets/img/home1/destination-card-img3.jpg' },
                                                        { name: 'New Zealand', count: '34+ Tours', category: 'e-visa', img: '/assets/img/home1/destination-card-img4.jpg' },
                                                        { name: 'Vietnam', count: '12+ Tours', category: 'arrival', img: '/assets/img/home1/destination-card-img5.jpg' },
                                                        { name: 'Bali', count: '18+ Tours', category: 'arrival', img: '/assets/img/home1/destination-card-img6.jpg' },
                                                        { name: 'Turkey', count: '15+ Tours', category: 'e-visa', img: '/assets/img/home1/destination-card-img7.jpg' },
                                                        { name: 'Tanzania', count: '5+ Tours', category: 'stamped', img: '/assets/img/home1/destination-card-img8.jpg' },
                                                        { name: 'Fiji & Bora Bora', count: '2+ Tours', category: 'arrival', img: '/assets/img/home1/destination-card-img9.jpg' }
                                                    ].filter(item => item.category === visaFilter).map((visa, idx) => (
                                                        <Link href={`/packages?q=${encodeURIComponent(visa.name)}`} className="visa-card text-decoration-none" key={idx} style={{display: 'block'}}>
                                                            <div className="visa-card-img">
                                                                <img src={visa.img} alt={visa.name} />
                                                            </div>
                                                            <div className="visa-card-info">
                                                                <p className="visa-card-name">{visa.name}</p>
                                                                <p className="visa-card-count">{visa.count}</p>
                                                            </div>
                                                        </Link>
                                                    ))}

                                                </div>
                                            </div>
                                            <button className="ft-dest-slide-btn next-btn" onClick={() => handleVisaScroll('right')}>
                                                <i className="bi bi-chevron-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ========================================
                 TRAVEL REELS & INSPIRATION
            ======================================== */}
            <div className="reels-section mb-55" data-aos="fade-up">
                <div className="container-xl">
                    <div className="reels-explore-panel">

                        {/* Left Column: Travel Reels */}
                        <div className="panel-left">
                            <div className="panel-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                                <h3 style={{margin: 0}}>Travel reels</h3>
                                <button className="shuffle-reels-btn border-0 text-white" onClick={playRandomShort} style={{cursor: 'pointer'}}>
                                    <i className="bi bi-shuffle"></i> Play Random Short
                                </button>
                            </div>
                            <div className="vertical-reels-row">
                                
                                <div className="v-reel-card" onClick={() => setActiveReel({ id: 'o7_F1bU4yQc', title: 'South Africa Trip', desc: 'South Africa Trip #shorts #southafrica', isLandscape: false })}>
                                    <div className="v-reel-thumbnail">
                                        <img src="/assets/img/home1/destination-card-img1.jpg" alt="South Africa" />
                                        <div className="v-reel-watermark">
                                            <img src="/assets/img/logo.png" alt="Grentours" style={{height: '11px', filter: 'brightness(0) invert(1)'}} onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} />
                                        </div>
                                        <div className="yt-play-btn">
                                            <svg viewBox="0 0 68 48">
                                                <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#f00"></path>
                                                <polygon points="27,15 44,24 27,33" fill="#fff"></polygon>
                                            </svg>
                                        </div>
                                        <div className="v-reel-label">
                                            <span>South Africa Trip<br />#shorts #southafrica</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="v-reel-card" onClick={() => setActiveReel({ id: 'm-WvQkRsw8A', title: 'Australia & New Zealand Tour', desc: 'Australia & New Zealand NRI Special Tour', isLandscape: false })}>
                                    <div className="v-reel-thumbnail">
                                        <img src="/assets/img/home1/destination-card-img9.jpg" alt="Australia & New Zealand" />
                                        <div className="v-reel-watermark">
                                            <img src="/assets/img/logo.png" alt="Grentours" style={{height: '11px', filter: 'brightness(0) invert(1)'}} onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} />
                                        </div>
                                        <div className="yt-play-btn">
                                            <svg viewBox="0 0 68 48">
                                                <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#f00"></path>
                                                <polygon points="27,15 44,24 27,33" fill="#fff"></polygon>
                                            </svg>
                                        </div>
                                        <div className="v-reel-label">
                                            <span>Australia &amp; New<br />Zealand NRI Special<br />Tour</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="v-reel-card" onClick={() => setActiveReel({ id: 'K_QyWc6wL5Y', title: 'Sayonara Sayonara Japan Life', desc: 'Sayonara Sayonara Indians Living Japan Life', isLandscape: false })}>
                                    <div className="v-reel-thumbnail">
                                        <img src="/assets/img/home1/destination-card-img2.jpg" alt="Japan Life" />
                                        <div className="v-reel-watermark">
                                            <img src="/assets/img/logo.png" alt="Grentours" style={{height: '11px', filter: 'brightness(0) invert(1)'}} onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} />
                                        </div>
                                        <div className="yt-play-btn">
                                            <svg viewBox="0 0 68 48">
                                                <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#f00"></path>
                                                <polygon points="27,15 44,24 27,33" fill="#fff"></polygon>
                                            </svg>
                                        </div>
                                        <div className="v-reel-label">
                                            <span>Sayonara Sayonara<br />Indians Living Japan<br />Life</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="v-reel-card" onClick={() => setActiveReel({ id: 'wN4_rA1L15I', title: 'Things To Do In Iceland', desc: 'Things To Do In Iceland #shorts #iceland', isLandscape: false })}>
                                    <div className="v-reel-thumbnail">
                                        <img src="/assets/img/home1/destination-card-img3.jpg" alt="Iceland" />
                                        <div className="v-reel-watermark">
                                            <img src="/assets/img/logo.png" alt="Grentours" style={{height: '11px', filter: 'brightness(0) invert(1)'}} onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} />
                                        </div>
                                        <div className="yt-play-btn">
                                            <svg viewBox="0 0 68 48">
                                                <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#f00"></path>
                                                <polygon points="27,15 44,24 27,33" fill="#fff"></polygon>
                                            </svg>
                                        </div>
                                        <div className="v-reel-label">
                                            <span>Things To Do In Iceland</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Vertical Divider */}
                        <div className="panel-divider"></div>

                        {/* Right Column: Explore Travel Videos */}
                        <div className="panel-right">
                            <div className="panel-header">
                                <h3>Explore Travel Videos</h3>
                            </div>
                            <div className="landscape-videos-scroll">
                                
                                <div className="l-video-card" onClick={() => setActiveReel({ id: 'V-E64c2U9Ew', title: 'Queensland Adventure with Meeta Shah', desc: 'Everything you need to know about Queensland, Australia. Learn about key highlights, beaches, rainforests, and wildlife with our travel expert.', isLandscape: true })}>
                                    <div className="l-video-thumbnail">
                                        <img src="/assets/img/home1/destination-card-img4.jpg" alt="Queensland Adventure" />
                                        <div className="yt-play-btn">
                                            <svg viewBox="0 0 68 48">
                                                <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#f00"></path>
                                                <polygon points="27,15 44,24 27,33" fill="#fff"></polygon>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="l-video-info">
                                        <h4>Queensland Adventure with Meeta ...</h4>
                                        <p>Everything You Need to Know About Queensland. Complete itinerary, guide, and experiences...</p>
                                    </div>
                                </div>

                                <div className="l-video-card" onClick={() => setActiveReel({ id: '79bY0_y92tU', title: 'Japan Podcast with Siddharth Shah', desc: 'Siddharth Shah interviews Meghna Patadia, a Japan travel expert. Meghna shares her love for Japan, top cultural spots, and food recommendations.', isLandscape: true })}>
                                    <div className="l-video-thumbnail">
                                        <img src="/assets/img/home1/destination-card-img5.jpg" alt="Japan Podcast" />
                                        <div className="yt-play-btn">
                                            <svg viewBox="0 0 68 48">
                                                <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#f00"></path>
                                                <polygon points="27,15 44,24 27,33" fill="#fff"></polygon>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="l-video-info">
                                        <h4>Japan Podcast with Siddharth Sha...</h4>
                                        <p>Siddharth Shah interviews Meghna Patadia, a Japan travel expert. Meghna shares her love for Japan and...</p>
                                    </div>
                                </div>

                                <div className="l-video-card" onClick={() => setActiveReel({ id: 'U1J-FvL9dD4', title: 'Top 8 Locations in Singapore', desc: 'Embark on a journey to Singapore. Flamingo Travels\' top 8 must-visit attractions, sights, and hidden gems.', isLandscape: true })}>
                                    <div className="l-video-thumbnail">
                                        <img src="/assets/img/home1/destination-card-img7.jpg" alt="Singapore Locations" />
                                        <div className="yt-play-btn">
                                            <svg viewBox="0 0 68 48">
                                                <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#f00"></path>
                                                <polygon points="27,15 44,24 27,33" fill="#fff"></polygon>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="l-video-info">
                                        <h4>Top 8 Locations in Singapore</h4>
                                        <p>Embark on a journey to Singapore. Flamingo Travels' top 8 must-visit attractions and sights...</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ========================================
                 ABOUT US
            ======================================== */}
            <div className="ft-about-section mb-55 mt-3" data-aos="fade-up">
                <div className="container-xl">
                    <div className="ft-about-card">
                        <div className="row align-items-center g-4">

                            {/* Left: Interactive Video/Awards Cover */}
                            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                                <div className="about-video-card" onClick={() => setActiveReel({ id: 'V-E64c2U9Ew', title: 'Grentours Achievement & Journey', desc: 'Discover our history, awards, and how we cater to thousands of happy families worldwide.', isLandscape: true })} style={{cursor: 'pointer'}}>
                                    <img src="/assets/img/home1/about_awards.png" alt="Grentours Award Ceremony" className="about-video-img" onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} />
                                    <div className="about-video-overlay">
                                        <div className="about-play-btn">
                                            <i className="bi bi-play-fill"></i>
                                        </div>
                                        <span className="about-video-badge">Awards &amp; Milestones</span>
                                    </div>
                                </div>
                            </div>

                            {/* Middle: Inspiring Narrative & Philosophy */}
                            <div className="col-lg-4 col-md-6 text-center text-md-start" data-aos="fade-up" data-aos-delay="200">
                                <div className="about-narrative">
                                    <span className="about-title-label">ABOUT US</span>
                                    <blockquote className="about-quote">
                                        &quot;Travel brings knowledge, Knowledge brings opportunity, Opportunity brings prosperity&quot;
                                        <span className="quote-bar"></span>
                                    </blockquote>
                                    <div className="about-text-wrap">
                                        <p className="about-p">
                                            Started in 1996 from a small set up of 3 team members, today we are a big team of
                                            250 plus team members. We are famous as a premier International Tour Operator,
                                            especially for arranging customized itineraries, providing premium accommodations,
                                            and catering to specialized vegetarian and Jain meals...
                                        </p>
                                        <div className={`about-extended-text ${isAboutExpanded ? 'active' : ''}`} id="aboutExtendedText" style={{
                                            display: isAboutExpanded ? 'block' : 'none',
                                            transition: 'all 0.3s ease-in-out'
                                        }}>
                                            <p className="about-p">
                                                Our mission is to create hassle-free, deeply memorable travel experiences. By
                                                focusing on customer comfort, local expertise, and curated culinary
                                                arrangements, we ensure that every tour feels like a warm, personalized journey.
                                                From individual escapes to grand group departures, our dedicated travel experts
                                                handle every detail with absolute precision.
                                            </p>
                                        </div>
                                        <button className="about-readmore-btn border-0" id="aboutReadMoreBtn" onClick={() => setIsAboutExpanded(!isAboutExpanded)}>
                                            {isAboutExpanded ? 'Read Less ' : 'Read More '}
                                            <i className={`bi ${isAboutExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right: High-Impact 2x2 Stats Grid */}
                            <div className="col-lg-4" data-aos="fade-up" data-aos-delay="300">
                                <div className="about-stats-grid">

                                    {/* Stat 1: Happy Families */}
                                    <div className="stat-card">
                                        <div className="stat-icon-wrap bg-heart-light">
                                            <i className="bi bi-hearts"></i>
                                        </div>
                                        <div className="stat-info">
                                            <h3 className="stat-number">2,10,000+</h3>
                                            <p className="stat-label">Happy Families</p>
                                        </div>
                                    </div>

                                    {/* Stat 2: Employees */}
                                    <div className="stat-card">
                                        <div className="stat-icon-wrap bg-people-light">
                                            <i className="bi bi-people-fill"></i>
                                        </div>
                                        <div className="stat-info">
                                            <h3 className="stat-number">250+</h3>
                                            <p className="stat-label">Employees</p>
                                        </div>
                                    </div>

                                    {/* Stat 3: Experience */}
                                    <div className="stat-card">
                                        <div className="stat-icon-wrap bg-award-light">
                                            <i className="bi bi-patch-check-fill"></i>
                                        </div>
                                        <div className="stat-info">
                                            <h3 className="stat-number">30+</h3>
                                            <p className="stat-label">Years of Experience</p>
                                        </div>
                                    </div>

                                    {/* Stat 4: Locations */}
                                    <div className="stat-card">
                                        <div className="stat-icon-wrap bg-geo-light">
                                            <i className="bi bi-geo-alt-fill"></i>
                                        </div>
                                        <div className="stat-info">
                                            <h3 className="stat-number">59+</h3>
                                            <p className="stat-label">Locations</p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* ========================================
                 LATEST TRAVEL BLOG
            ======================================== */}
            <div className="blog-section mb-55" data-aos="fade-up">
                <div className="container">
                    <div className="trav-blog-wrap">
                        <div className="ft-section-header">
                            <h2>Latest Travel Blog</h2>
                            <Link href="#">View All <i className="bi bi-arrow-right"></i></Link>
                        </div>
                        
                        {blogsLoading ? (
                            <div className="row g-3">
                                {[1, 2, 3, 4].map(idx => (
                                    <div key={idx} className="col-lg-3 col-md-6 col-sm-6">
                                        <div className="ft-skeleton-card" style={{ width: '100%' }}>
                                            <div className="ft-skeleton-card-img" style={{ aspectRatio: '16/10', height: 'auto' }}></div>
                                            <div className="ft-skeleton-card-body">
                                                <div className="ft-skeleton-line title"></div>
                                                <div className="ft-skeleton-line"></div>
                                                <div className="ft-skeleton-line meta"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : blogs.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <i className="bi bi-journal-text fs-1 mb-2 d-block text-muted"></i>
                                <span>No travel blogs available at the moment.</span>
                            </div>
                        ) : (
                            <div className="swiper trav-blog-slider">
                                <div className="swiper-wrapper">
                                    {blogs.map(blog => (
                                        <div key={blog.id} className="swiper-slide">
                                            <Link href={`/blogs/${blog.slug}`} className="trav-blog-card text-decoration-none">
                                                <div className="trav-blog-img">
                                                    <img 
                                                        src={getBlogImage(blog.cover_image)} 
                                                        alt={blog.title} 
                                                        onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }}
                                                    />
                                                </div>
                                                <div className="trav-blog-body">
                                                    <p className="trav-blog-title text-dark fw-bold">{blog.title}</p>
                                                    <p className="trav-blog-summary text-muted">{blog.summary}</p>
                                                    <p className="trav-blog-meta text-muted"><span>{blog.created_at}</span> &bull; {blog.author || 'grentours'}</p>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ========================================
                 TRUST BADGES
            ======================================== */}
            <div className="ft-trust sm-hidden" data-aos="fade-up">
                <div className="container-xl">
                    <div className="ft-trust-inner">
                        <div className="ft-trust-item"><i className="bi bi-patch-check-fill"></i> IATA Certified</div>
                        <div className="ft-trust-item"><i className="bi bi-award-fill"></i> TAAI Member</div>
                        <div className="ft-trust-item"><i className="bi bi-shield-fill-check"></i> ISO 9001:2015</div>
                        <div className="ft-trust-item"><i className="bi bi-trophy-fill"></i> Award Winning</div>
                        <div className="ft-trust-item"><i className="bi bi-people-fill"></i> 5 Lakh+ Travellers</div>
                        <div className="ft-trust-item"><i className="bi bi-star-fill"></i> 4.8/5 Rating</div>
                    </div>
                </div>
            </div>

            {/* Sticky Mobile Bar */}
            <div className="ft-sticky-bottom">
                <button className="s-btn s-primary" onClick={() => alert('Consultation form coming soon!')}>Get Free Quote</button>
                <button className="s-btn s-call" onClick={() => window.open('tel:+919825081806')}><i className="bi bi-telephone-fill"></i> Call Us</button>
            </div>

            {/* ========================================
                 MODALS
            ======================================== */}

            {/* Premium Reels Modal */}
            {activeReel && (
                <div id="reelsModal" className="reels-modal active" style={{display: 'flex'}}>
                    <div className="reels-modal-backdrop" onClick={() => setActiveReel(null)}></div>
                    <div className="reels-modal-content">
                        <button className="reels-modal-close" onClick={() => setActiveReel(null)}><i className="bi bi-x-lg"></i></button>
                        <div className="reels-modal-body">
                            <div className="reels-video-container">
                                <iframe 
                                    id="reelsVideoPlayer" 
                                    src={`https://www.youtube.com/embed/${activeReel.id}?autoplay=1&mute=0&rel=0`} 
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    style={{
                                        maxWidth: activeReel.isLandscape ? '100%' : '315px',
                                        aspectRatio: activeReel.isLandscape ? '16/9' : '9/16',
                                        width: '100%',
                                        height: '100%'
                                    }}
                                />
                            </div>
                            <div className="reels-video-info">
                                <h3>{activeReel.title}</h3>
                                <p>{activeReel.desc}</p>
                                <div className="reels-modal-cta">
                                    <a href="https://wa.me/912261234567" target="_blank" className="ft-btn-primary text-decoration-none">
                                        Book This Experience
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MICE Enquiry Modal */}
            {showMiceModal && (
                <div className="reels-modal active" id="miceModal" style={{display: 'flex'}}>
                    <div className="reels-modal-backdrop" onClick={() => setShowMiceModal(false)}></div>
                    <div className="reels-modal-content" style={{maxWidth: '500px', borderRadius: '12px', background: '#fff', border: '1px solid #ddd', boxShadow: '0 10px 40px rgba(0,0,0,0.2)'}}>
                        <button className="reels-modal-close" onClick={() => setShowMiceModal(false)} style={{color: '#333', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)'}}>
                            <i className="bi bi-x-lg"></i>
                        </button>
                        <div style={{padding: '24px'}}>
                            <span className="ft-mice-tag" style={{marginBottom: '8px', display: 'inline-block'}}>MICE TRAVEL</span>
                            <h3 style={{fontSize: '18px', fontWeight: 700, color: '#222', marginBottom: '6px'}}>Plan Corporate Event</h3>
                            <p style={{marginBottom: '18px', color: '#666', fontSize: '11.5px', lineHeight: 1.5}}>Provide details of your business travel or event and our MICE experts will craft a bespoke, premium itinerary for you.</p>
                            
                            {miceSubmitted ? (
                                <div className="alert alert-success text-center py-4 rounded-3 border-0">
                                    <i className="bi bi-check-circle-fill fs-2 text-success d-block mb-2"></i>
                                    <span className="fw-bold d-block">Corporate Enquiry Received!</span>
                                    <span className="small text-muted mt-1 d-block">Our MICE travel specialist will reach out to you within 2 hours.</span>
                                </div>
                            ) : (
                                <form id="miceEnquiryForm" onSubmit={handleMiceEnquirySubmit}>
                                    <div className="ft-form-group mb-3">
                                        <label style={{color: '#555', fontWeight: 600, fontSize: '11px', marginBottom: '4px', display: 'block'}}>Company Name *</label>
                                        <input 
                                            type="text" 
                                            required 
                                            style={{border: '1.5px solid #e0e0e0', borderRadius: '7px', padding: '9px 12px', fontSize: '12.5px', width: '100%', color: '#333', outline: 'none', background: '#fafafa'}} 
                                            placeholder="e.g. Acme Corp"
                                            value={miceForm.company}
                                            onChange={(e) => setMiceForm({...miceForm, company: e.target.value})}
                                        />
                                    </div>
                                    <div className="ft-form-group mb-3">
                                        <label style={{color: '#555', fontWeight: 600, fontSize: '11px', marginBottom: '4px', display: 'block'}}>Contact Person *</label>
                                        <input 
                                            type="text" 
                                            required 
                                            style={{border: '1.5px solid #e0e0e0', borderRadius: '7px', padding: '9px 12px', fontSize: '12.5px', width: '100%', color: '#333', outline: 'none', background: '#fafafa'}} 
                                            placeholder="Your Full Name"
                                            value={miceForm.contactPerson}
                                            onChange={(e) => setMiceForm({...miceForm, contactPerson: e.target.value})}
                                        />
                                    </div>
                                    <div className="row g-2 mb-3">
                                        <div className="col-md-6">
                                            <div className="ft-form-group">
                                                <label style={{color: '#555', fontWeight: 600, fontSize: '11px', marginBottom: '4px', display: 'block'}}>Work Email *</label>
                                                <input 
                                                    type="email" 
                                                    required 
                                                    style={{border: '1.5px solid #e0e0e0', borderRadius: '7px', padding: '9px 12px', fontSize: '12.5px', width: '100%', color: '#333', outline: 'none', background: '#fafafa'}} 
                                                    placeholder="name@company.com"
                                                    value={miceForm.email}
                                                    onChange={(e) => setMiceForm({...miceForm, email: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="ft-form-group">
                                                <label style={{color: '#555', fontWeight: 600, fontSize: '11px', marginBottom: '4px', display: 'block'}}>Phone Number *</label>
                                                <input 
                                                    type="tel" 
                                                    required 
                                                    style={{border: '1.5px solid #e0e0e0', borderRadius: '7px', padding: '9px 12px', fontSize: '12.5px', width: '100%', color: '#333', outline: 'none', background: '#fafafa'}} 
                                                    placeholder="+91 XXXXX XXXXX"
                                                    value={miceForm.phone}
                                                    onChange={(e) => setMiceForm({...miceForm, phone: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row g-2 mb-3">
                                        <div className="col-md-6">
                                            <div className="ft-form-group">
                                                <label style={{color: '#555', fontWeight: 600, fontSize: '11px', marginBottom: '4px', display: 'block'}}>Event Type *</label>
                                                <select 
                                                    required 
                                                    style={{border: '1.5px solid #e0e0e0', borderRadius: '7px', padding: '9px 12px', fontSize: '12.5px', width: '100%', color: '#333', outline: 'none', background: '#fafafa', cursor: 'pointer'}}
                                                    value={miceForm.eventType}
                                                    onChange={(e) => setMiceForm({...miceForm, eventType: e.target.value})}
                                                >
                                                    <option value="">Select Event Type</option>
                                                    <option value="meeting">Meeting / Summit</option>
                                                    <option value="incentive">Incentive Travel</option>
                                                    <option value="conference">Conference / Seminar</option>
                                                    <option value="exhibition">Exhibition / Expo</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="ft-form-group">
                                                <label style={{color: '#555', fontWeight: 600, fontSize: '11px', marginBottom: '4px', display: 'block'}}>Attendees *</label>
                                                <select 
                                                    required 
                                                    style={{border: '1.5px solid #e0e0e0', borderRadius: '7px', padding: '9px 12px', fontSize: '12.5px', width: '100%', color: '#333', outline: 'none', background: '#fafafa', cursor: 'pointer'}}
                                                    value={miceForm.attendees}
                                                    onChange={(e) => setMiceForm({...miceForm, attendees: e.target.value})}
                                                >
                                                    <option value="">Select Range</option>
                                                    <option value="10-50">10 - 50 Pax</option>
                                                    <option value="50-200">50 - 200 Pax</option>
                                                    <option value="200-500">200 - 500 Pax</option>
                                                    <option value="500+">500+ Pax</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button type="submit" className="ft-mice-cta btn btn-success" style={{marginTop: '10px', width: '100%', color: '#fff', border: 0}}>Submit Inquiry <i className="bi bi-send-fill"></i></button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
