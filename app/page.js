'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { openEnquiryModal, getApiUrl, submitGeneralEnquiry } from '../lib/submitEnquiry';
import TravelMediaSection from '../components/home/TravelMediaSection';
import { getMediaUrl } from '../lib/media';

export default function HomePage() {
    // Offers tabs state: 'domestic' or 'international'
    const [toursTab, setToursTab] = useState('domestic');
    const [hotelsTab, setHotelsTab] = useState('domestic');

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
    const [miceSubmitting, setMiceSubmitting] = useState(false);
    const [miceError, setMiceError] = useState('');
    const [contactPhone, setContactPhone] = useState('+919825081806');

    // Scroll refs for custom smooth scrolls
    const themeScrollRef = useRef(null);
    const tourScrollRef = useRef(null);
    const hotelScrollRef = useRef(null);
    const destScrollRef = useRef(null);
    const visaScrollRef = useRef(null);

    const [themes, setThemes] = useState([]);
    const [packages, setPackages] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [visaDestinations, setVisaDestinations] = useState([]);
    const [reels, setReels] = useState([]);
    const [videos, setVideos] = useState([]);
    const [advertisements, setAdvertisements] = useState([]);
    const [blogsLoading, setBlogsLoading] = useState(true);
    const [visaLoading, setVisaLoading] = useState(true);
    const [reelsLoading, setReelsLoading] = useState(true);
    const [videosLoading, setVideosLoading] = useState(true);
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
            Promise.all([
                fetch(`${apiUrl}/api/v1/packages?type=tour&limit=12`)
                    .then(res => res.json())
                    .then(data => data.success && data.data ? data.data : [])
                    .catch(err => { console.error('Error fetching tours:', err); return []; }),
                fetch(`${apiUrl}/api/v1/packages?type=hotel&limit=12`)
                    .then(res => res.json())
                    .then(data => data.success && data.data ? data.data : [])
                    .catch(err => { console.error('Error fetching hotels:', err); return []; })
            ])
            .then(([tours, hotels]) => {
                setPackages([...tours, ...hotels]);
            }),
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
                .finally(() => setBlogsLoading(false)),
            fetch(`${apiUrl}/api/v1/visa-destinations`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.destinations) {
                        setVisaDestinations(data.destinations);
                    }
                })
                .catch(err => console.error('Error fetching visas:', err))
                .finally(() => setVisaLoading(false)),
            fetch(`${apiUrl}/api/v1/travel-reels`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.reels) {
                        setReels(data.reels);
                    }
                })
                .catch(err => console.error('Error fetching reels:', err))
                .finally(() => setReelsLoading(false)),
            fetch(`${apiUrl}/api/v1/travel-videos`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.videos) {
                        setVideos(data.videos);
                    }
                })
                .catch(err => console.error('Error fetching videos:', err))
                .finally(() => setVideosLoading(false)),
            fetch(`${apiUrl}/api/v1/homepage/advertisements`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.banners) {
                        setAdvertisements(data.banners);
                    }
                })
                .catch(err => console.error('Error fetching advertisements:', err))
        ]).finally(() => {
            setLoading(false);
        });
    }, []);

    const getThemeImage = (url) => getMediaUrl(url);
    const getDestinationImage = (url) => getMediaUrl(url);
    const getPackageImage = (url) => getMediaUrl(url);
    const getAdImage = (url) => getMediaUrl(url);
    const getBlogImage = (url) => getMediaUrl(url);

    const getEmbedUrl = (reel) => {
        if (!reel) return '';
        if (reel.video_url) {
            const separator = reel.video_url.includes('?') ? '&' : '?';
            return `${reel.video_url}${separator}autoplay=1&mute=0&rel=0`;
        }
        return `https://www.youtube.com/embed/${reel.id}?autoplay=1&mute=0&rel=0`;
    };

    useEffect(() => {
        fetch(`${getApiUrl()}/api/v1/settings`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.settings?.contact_phone) {
                    setContactPhone(data.settings.contact_phone.replace(/\s/g, ''));
                }
            })
            .catch(() => {});
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
                spaceBetween: 20,
                loop: blogs.length >= 4,
                autoplay: {
                    delay: 3500,
                    disableOnInteraction: false,
                },
                navigation: {
                    nextEl: ".blog-swiper-next",
                    prevEl: ".blog-swiper-prev",
                },
                pagination: {
                    el: ".blog-swiper-pagination",
                    clickable: true,
                },
                breakpoints: {
                    280: { slidesPerView: 1.1 },
                    576: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
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

    const playRandomShort = () => {
        const sourceReels = reels;
        if (sourceReels.length === 0) {
            alert('No reels available to play.');
            return;
        }
        const randomIndex = Math.floor(Math.random() * sourceReels.length);
        const short = sourceReels[randomIndex];
        if (short.video_url) {
            setActiveReel({
                id: short.id,
                video_url: short.video_url,
                title: short.title || short.reel_title,
                desc: short.description || short.title || short.reel_title,
                isLandscape: false
            });
        } else {
            setActiveReel({ id: short.id || randomIndex, title: short.title || short.reel_title, desc: short.desc || short.title || short.reel_title, isLandscape: false });
        }
    };

    const handleMiceEnquirySubmit = async (e) => {
        e.preventDefault();
        setMiceError('');
        setMiceSubmitting(true);

        const message = [
            `MICE / Corporate Enquiry`,
            `Company: ${miceForm.company}`,
            `Event Type: ${miceForm.eventType}`,
            `Attendees: ${miceForm.attendees}`,
        ].join('\n');

        try {
            await submitGeneralEnquiry({
                name: miceForm.contactPerson,
                phone: miceForm.phone,
                email: miceForm.email,
                interest: 'MICE / Corporate Travel',
                month: 'Select Month',
                message,
                type: 'general',
            });
            setMiceSubmitted(true);
            setTimeout(() => {
                setMiceSubmitted(false);
                setShowMiceModal(false);
                setMiceForm({ company: '', contactPerson: '', email: '', phone: '', eventType: '', attendees: '' });
            }, 4000);
        } catch (err) {
            setMiceError(err.message || 'Failed to submit enquiry.');
        } finally {
            setMiceSubmitting(false);
        }
    };

    // Filter packages by type and domestic/international (domestic = India, international = outside India)
    const domesticTours = packages.filter(p => p.package_type === 'tour' && p.country && p.country.toLowerCase() === 'india');
    const internationalTours = packages.filter(p => p.package_type === 'tour' && (!p.country || p.country.toLowerCase() !== 'india'));

    const domesticHotels = packages.filter(p => p.package_type === 'hotel' && p.country && p.country.toLowerCase() === 'india');
    const internationalHotels = packages.filter(p => p.package_type === 'hotel' && (!p.country || p.country.toLowerCase() !== 'india'));

    // Distribute ads into Slot 1 (Promo) and Slot 2 (Sidebar) using odd/even indices
    const promoAds = advertisements.filter((_, idx) => idx % 2 === 0);
    const sidebarAds = advertisements.filter((_, idx) => idx % 2 !== 0);

    const promoSlides = [];
    promoAds.forEach(ad => {
        const images = ad.desktop_images && ad.desktop_images.length > 0 ? ad.desktop_images : [];
        images.forEach(img => {
            promoSlides.push({
                image: img,
                link_url: ad.link_url,
                title: ad.title
            });
        });
    });

    const sidebarSlides = [];
    sidebarAds.forEach(ad => {
        const images = ad.desktop_images && ad.desktop_images.length > 0 ? ad.desktop_images : [];
        images.forEach(img => {
            sidebarSlides.push({
                image: img,
                link_url: ad.link_url,
                title: ad.title
            });
        });
    });

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
                                <div className="ft-mice-card" data-aos="fade-up" onClick={() => setShowMiceModal(true)} style={{ cursor: 'pointer' }}>
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

                                {promoSlides && promoSlides.length > 0 && (
                                    <div className="ft-promo-card">
                                        {promoSlides.length > 1 ? (
                                            <Swiper
                                                modules={[Pagination, Autoplay]}
                                                pagination={{ clickable: true }}
                                                autoplay={{ delay: 4000, disableOnInteraction: false }}
                                                className="promo-swiper"
                                                style={{ borderRadius: '12px', overflow: 'hidden' }}
                                            >
                                                {promoSlides.map((slide, i) => (
                                                    <SwiperSlide key={i}>
                                                        <Link href={slide.link_url || '#'} className="d-block w-100 h-100">
                                                            <div className="ft-promo-img">
                                                                 <img src={getAdImage(slide.image)} alt={slide.title} />
                                                            </div>
                                                        </Link>
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                        ) : (
                                            <Link href={promoSlides[0].link_url || '#'} className="d-block w-100 h-100">
                                                <div className="ft-promo-img">
                                                    <img src={getAdImage(promoSlides[0].image)} alt={promoSlides[0].title} />
                                                </div>
                                            </Link>
                                        )}
                                    </div>
                                )}

                                {/* Partner/Airline Banner */}
                                {sidebarSlides && sidebarSlides.length > 0 && (
                                    <div className="ft-sidebar-ad">
                                        {sidebarSlides.length > 1 ? (
                                            <Swiper
                                                modules={[Pagination, Autoplay]}
                                                pagination={{ clickable: true }}
                                                autoplay={{ delay: 4500, disableOnInteraction: false }}
                                                className="sidebar-ad-swiper"
                                                style={{ borderRadius: '12px', overflow: 'hidden' }}
                                            >
                                                {sidebarSlides.map((slide, i) => (
                                                    <SwiperSlide key={i}>
                                                        <Link href={slide.link_url || '#'} className="d-block w-100 h-100">
                                                            <div className="ft-sidebar-ad-img">
                                                                 <img src={getAdImage(slide.image)} alt={slide.title} />
                                                            </div>
                                                        </Link>
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                        ) : (
                                            <Link href={sidebarSlides[0].link_url || '#'} className="d-block w-100 h-100">
                                                <div className="ft-sidebar-ad-img">
                                                    <img src={getAdImage(sidebarSlides[0].image)} alt={sidebarSlides[0].title} />
                                                </div>
                                            </Link>
                                        )}
                                    </div>
                                )}
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
                                            {loading ? (
                                                [1, 2, 3, 4, 5].map((i) => (
                                                    <div className="ft-theme-card skeleton-pulse" key={i} style={{ minWidth: '130px', height: '140px', background: '#e2e8f0', borderRadius: '12px', flexShrink: 0 }}></div>
                                                ))
                                            ) : themes.length > 0 ? (
                                                themes.map((theme, idx) => (
                                                    <Link key={idx} href={`/packages?theme=${theme.slug}`} className="ft-theme-card">
                                                        <div className="ft-theme-img">
                                                            <img src={getThemeImage(theme.image_url)} alt={theme.name} onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} />
                                                        </div>
                                                        <p>{theme.name}</p>
                                                        <span>{theme.packages_count ?? 0}+ Tours</span>
                                                    </Link>
                                                ))
                                            ) : (
                                                <div className="w-100 text-center py-4 text-muted">
                                                    No themes available at the moment.
                                                </div>
                                            )}
                                        </div>
                                        <button className="ft-theme-arrow right" onClick={() => handleScroll(themeScrollRef, 280)}>
                                            <i className="bi bi-chevron-right"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* TOUR PACKAGES */}
                                <div className="ft-card-section" data-aos="fade-up">
                                    <div className="ft-section-header">
                                        <h2>Fixed Group Departure</h2>
                                        <Link href={`/packages?region=${toursTab}`}>
                                            View All <i className="bi bi-arrow-right"></i>
                                        </Link>
                                    </div>

                                    {/* Tabs: Domestic | International */}
                                    <div className="ft-pkg-tabs">
                                        <button className={`ft-pkg-tab ${toursTab === 'domestic' ? 'active' : ''}`} onClick={() => setToursTab('domestic')}>
                                            Domestic
                                        </button>
                                        <button className={`ft-pkg-tab ${toursTab === 'international' ? 'active' : ''}`} onClick={() => setToursTab('international')}>
                                            International
                                        </button>
                                    </div>

                                    {/* Tour Packages row */}
                                    <div className="ft-pkg-slider" id="toursRow">
                                        <button className="ft-pkg-slide-btn prev-btn" onClick={() => handleScroll(tourScrollRef, -290)}>
                                            <i className="bi bi-chevron-left"></i>
                                        </button>
                                        <div className="ft-pkg-row" id="tourScrollEl" ref={tourScrollRef}>
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
                                            ) : (toursTab === 'domestic' ? domesticTours : internationalTours).length > 0 ? (
                                                (toursTab === 'domestic' ? domesticTours : internationalTours).map((pkg) => (
                                                    <Link href={`/packages/${pkg.slug}`} className="ft-pkg-card text-decoration-none" key={pkg.id}>
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
                                                                <span className="ft-pkg-meta-item">
                                                                    <i className="bi bi-people"></i> {
                                                                        (() => {
                                                                            if (pkg.attribute_values && pkg.attribute_values.length > 0) {
                                                                                const tourTypeAttr = pkg.attribute_values.find(
                                                                                    av => av.attribute && (av.attribute.name === 'Tour Type' || av.attribute.slug === 'tour-type')
                                                                                );
                                                                                if (tourTypeAttr) {
                                                                                    return tourTypeAttr.value;
                                                                                }
                                                                            }
                                                                            if (pkg.tags && pkg.tags.length > 0) {
                                                                                const relevantTag = pkg.tags.find(t => 
                                                                                    t.name.toLowerCase().includes('tour') || 
                                                                                    t.name.toLowerCase().includes('special') || 
                                                                                    t.name.toLowerCase().includes('family') || 
                                                                                    t.name.toLowerCase().includes('couple')
                                                                                );
                                                                                if (relevantTag) {
                                                                                    return relevantTag.name;
                                                                                }
                                                                                return pkg.tags[0].name;
                                                                            }
                                                                            return 'Group Tour';
                                                                        })()
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="ft-pkg-card-footer">
                                                                <div>
                                                                    <div className="ft-pkg-price-label">Starting From</div>
                                                                    <div className="ft-pkg-price">₹ {pkg.price.toLocaleString('en-IN')} <span>/ person</span></div>
                                                                </div>
                                                                <span className="ft-view-btn text-decoration-none text-center d-flex align-items-center justify-content-center">
                                                                    view details
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))
                                            ) : (
                                                <div className="w-100 text-center py-4 text-muted">
                                                    No tour packages available at the moment.
                                                </div>
                                            )}
                                        </div>

                                        <button className="ft-pkg-slide-btn next-btn" onClick={() => handleScroll(tourScrollRef, 290)}>
                                            <i className="bi bi-chevron-right"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* HOTELS */}
                                <div className="ft-card-section" data-aos="fade-up">
                                    <div className="ft-section-header">
                                        <h2>Hotels</h2>
                                        <Link href={`/hotels?region=${hotelsTab}`}>
                                            View All <i className="bi bi-arrow-right"></i>
                                        </Link>
                                    </div>

                                    {/* Tabs: Domestic | International */}
                                    <div className="ft-pkg-tabs">
                                        <button className={`ft-pkg-tab ${hotelsTab === 'domestic' ? 'active' : ''}`} onClick={() => setHotelsTab('domestic')}>
                                            Domestic
                                        </button>
                                        <button className={`ft-pkg-tab ${hotelsTab === 'international' ? 'active' : ''}`} onClick={() => setHotelsTab('international')}>
                                            International
                                        </button>
                                    </div>

                                    {/* Hotels row */}
                                    <div className="ft-pkg-slider" id="hotelsRow">
                                        <button className="ft-pkg-slide-btn prev-btn" onClick={() => handleScroll(hotelScrollRef, -290)}>
                                            <i className="bi bi-chevron-left"></i>
                                        </button>
                                        <div className="ft-pkg-row" id="hotelScrollEl" ref={hotelScrollRef}>
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
                                            ) : (hotelsTab === 'domestic' ? domesticHotels : internationalHotels).length > 0 ? (
                                                (hotelsTab === 'domestic' ? domesticHotels : internationalHotels).map((pkg) => (
                                                    <Link href={`/hotels/${pkg.slug}`} className="ft-pkg-card text-decoration-none" key={pkg.id}>
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
                                                                <span className="ft-pkg-meta-item"><i className="bi bi-star-fill" style={{ color: '#f59e0b' }}></i> {pkg.tags && pkg.tags.length > 0 ? pkg.tags[0].name : 'Hotel'}</span>
                                                            </div>
                                                            <div className="ft-pkg-card-footer">
                                                                <div>
                                                                    <div className="ft-pkg-price-label">Per Night</div>
                                                                    <div className="ft-pkg-price">₹ {pkg.price.toLocaleString('en-IN')}</div>
                                                                </div>
                                                                <span className="ft-view-btn text-decoration-none text-center d-flex align-items-center justify-content-center">
                                                                    view details
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))
                                            ) : (
                                                <div className="w-100 text-center py-4 text-muted">
                                                    No hotels available at the moment.
                                                </div>
                                            )}
                                        </div>

                                        <button className="ft-pkg-slide-btn next-btn" onClick={() => handleScroll(hotelScrollRef, 290)}>
                                            <i className="bi bi-chevron-right"></i>
                                        </button>
                                    </div>
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
                                    <div className="ft-section-header" style={{ flexWrap: 'wrap', gap: '10px' }}>
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

                                                    {visaLoading ? (
                                                        [1, 2, 3, 4].map(n => (
                                                            <div className="visa-card skeleton-pulse" key={n} style={{
                                                                minWidth: '220px',
                                                                height: '240px',
                                                                background: '#e2e8f0',
                                                                borderRadius: '12px',
                                                                flexShrink: 0
                                                            }}></div>
                                                        ))
                                                    ) : visaDestinations.filter(item => item.category === visaFilter).length === 0 ? (
                                                        <div className="no-visas-msg" style={{ width: '100%', textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                                            <p>No countries available in this category yet.</p>
                                                        </div>
                                                    ) : (
                                                        visaDestinations.filter(item => item.category === visaFilter).map((visa, idx) => (
                                                            <Link href={`/visa/${visa.slug}`} className="visa-card text-decoration-none" key={idx} style={{ display: 'block' }}>
                                                                <div className="visa-card-img">
                                                                    <img src={getDestinationImage(visa.img)} alt={visa.name} />
                                                                </div>
                                                                <div className="visa-card-info">
                                                                    <p className="visa-card-name">{visa.name}</p>
                                                                    <p className="visa-card-count">{visa.count}</p>
                                                                </div>
                                                            </Link>
                                                        ))
                                                    )}

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

            <TravelMediaSection
                reels={reels}
                videos={videos}
                reelsLoading={reelsLoading}
                videosLoading={videosLoading}
                loading={loading}
                onPlayReel={setActiveReel}
                onPlayRandom={playRandomShort}
            />


            {/* ========================================
                 ABOUT US
            ======================================== */}
            <div className="ft-about-section mb-55 mt-3" data-aos="fade-up">
                <div className="container-xl">
                    <div className="ft-about-card">
                        <div className="row align-items-center g-4">

                            {/* Left: Interactive Video/Awards Cover */}
                            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                                <div className="about-video-card" onClick={() => setActiveReel({ id: 'V-E64c2U9Ew', title: 'Grentours Achievement & Journey', desc: 'Discover our history, awards, and how we cater to thousands of happy families worldwide.', isLandscape: true })} style={{ cursor: 'pointer' }}>
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
                                            <i className="bi bi-heart-fill"></i>
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
                        <div className="ft-section-header flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 mb-4">
                            <div>
                                <h2 className="m-0 font-weight-bold" style={{ fontSize: '1.75rem', color: '#1e293b' }}>Latest Travel Blog</h2>
                                <p className="text-muted m-0 small mt-1">Get travel tips, destination guides, and stories from our experts.</p>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <Link href="/blogs" className="view-all-btn text-decoration-none">
                                    View All <i className="bi bi-arrow-right"></i>
                                </Link>
                                <div className="d-flex gap-2">
                                    <button className="blog-swiper-prev blog-nav-btn" aria-label="Previous slide">
                                        <i className="bi bi-chevron-left"></i>
                                    </button>
                                    <button className="blog-swiper-next blog-nav-btn" aria-label="Next slide">
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
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
                            <div className="blog-slider-container">
                                <Swiper
                                    modules={[Navigation, Pagination, Autoplay]}
                                    spaceBetween={16}
                                    slidesPerView={1}
                                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                                    navigation={{
                                        nextEl: '.blog-swiper-next',
                                        prevEl: '.blog-swiper-prev',
                                    }}
                                    pagination={{
                                        clickable: true,
                                        el: '.blog-swiper-pagination'
                                    }}
                                    breakpoints={{
                                        576: { slidesPerView: 2 },
                                        768: { slidesPerView: 3 },
                                        992: { slidesPerView: 4 }
                                    }}
                                    className="trav-blog-slider"
                                >
                                    {blogs.map(blog => {
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
                                            <SwiperSlide key={blog.id} style={{ height: 'auto', display: 'flex' }}>
                                                <Link href={`/blogs/${blog.slug}`} className="trav-blog-card text-decoration-none">
                                                    <div className="trav-blog-img">
                                                        <span className="blog-category-badge">TRAVEL GUIDE</span>
                                                        <img
                                                            src={getBlogImage(blog.cover_image)}
                                                            alt={blog.title}
                                                            onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }}
                                                        />
                                                    </div>
                                                    <div className="trav-blog-body">
                                                        <p className="trav-blog-title fw-bold">{blog.title}</p>
                                                        <p className="trav-blog-summary">{blog.summary}</p>
                                                        <p className="trav-blog-meta">
                                                            <span>{formattedDate}</span> &bull; {blog.author?.name || 'Grentours'}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </SwiperSlide>
                                        );
                                    })}
                                </Swiper>
                                <div className="blog-swiper-pagination"></div>
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
                <button type="button" className="s-btn s-primary" onClick={openEnquiryModal}>Get Free Quote</button>
                <button type="button" className="s-btn s-call" onClick={() => window.open(`tel:${contactPhone}`)}><i className="bi bi-telephone-fill"></i> Call Us</button>
            </div>

            {/* ========================================
                 MODALS
            ======================================== */}

            {/* Premium Reels Modal */}
            {activeReel && (
                <div id="reelsModal" className="reels-modal active" style={{ display: 'flex' }}>
                    <div className="reels-modal-backdrop" onClick={() => setActiveReel(null)}></div>
                    <div className="reels-modal-content">
                        <button className="reels-modal-close" onClick={() => setActiveReel(null)}><i className="bi bi-x-lg"></i></button>
                        <div className="reels-modal-body">
                            <div className={`reels-video-container ${activeReel.isLandscape ? 'landscape-player' : ''}`}>
                                <iframe
                                    id="reelsVideoPlayer"
                                    src={getEmbedUrl(activeReel)}
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
                                    <a href="https://wa.me/919967023911" target="_blank" className="ft-btn-primary text-decoration-none">
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
                <div className="reels-modal active" id="miceModal" style={{ display: 'flex' }}>
                    <div className="reels-modal-backdrop" onClick={() => setShowMiceModal(false)}></div>
                    <div className="reels-modal-content" style={{ maxWidth: '500px', borderRadius: '12px', background: '#fff', border: '1px solid #ddd', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
                        <button className="reels-modal-close" onClick={() => setShowMiceModal(false)} style={{ color: '#333', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)' }}>
                            <i className="bi bi-x-lg"></i>
                        </button>
                        <div style={{ padding: '24px' }}>
                            <span className="ft-mice-tag" style={{ marginBottom: '8px', display: 'inline-block' }}>MICE TRAVEL</span>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#222', marginBottom: '6px' }}>Plan Corporate Event</h3>
                            <p style={{ marginBottom: '18px', color: '#666', fontSize: '11.5px', lineHeight: 1.5 }}>Provide details of your business travel or event and our MICE experts will craft a bespoke, premium itinerary for you.</p>

                            {miceSubmitted ? (
                                <div className="alert alert-success text-center py-4 rounded-3 border-0">
                                    <i className="bi bi-check-circle-fill fs-2 text-success d-block mb-2"></i>
                                    <span className="fw-bold d-block">Corporate Enquiry Received!</span>
                                    <span className="small text-muted mt-1 d-block">Our MICE travel specialist will reach out to you within 2 hours.</span>
                                </div>
                            ) : (
                                <form id="miceEnquiryForm" onSubmit={handleMiceEnquirySubmit}>
                                    {miceError && (
                                        <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '12px' }}>{miceError}</div>
                                    )}
                                    <div className="ft-form-group mb-3">
                                        <label style={{ color: '#555', fontWeight: 600, fontSize: '11px', marginBottom: '4px', display: 'block' }}>Company Name *</label>
                                        <input
                                            type="text"
                                            required
                                            style={{ border: '1.5px solid #e0e0e0', borderRadius: '7px', padding: '9px 12px', fontSize: '12.5px', width: '100%', color: '#333', outline: 'none', background: '#fafafa' }}
                                            placeholder="e.g. Acme Corp"
                                            value={miceForm.company}
                                            onChange={(e) => setMiceForm({ ...miceForm, company: e.target.value })}
                                        />
                                    </div>
                                    <div className="ft-form-group mb-3">
                                        <label style={{ color: '#555', fontWeight: 600, fontSize: '11px', marginBottom: '4px', display: 'block' }}>Contact Person *</label>
                                        <input
                                            type="text"
                                            required
                                            style={{ border: '1.5px solid #e0e0e0', borderRadius: '7px', padding: '9px 12px', fontSize: '12.5px', width: '100%', color: '#333', outline: 'none', background: '#fafafa' }}
                                            placeholder="Your Full Name"
                                            value={miceForm.contactPerson}
                                            onChange={(e) => setMiceForm({ ...miceForm, contactPerson: e.target.value })}
                                        />
                                    </div>
                                    <div className="row g-2 mb-3">
                                        <div className="col-md-6">
                                            <div className="ft-form-group">
                                                <label style={{ color: '#555', fontWeight: 600, fontSize: '11px', marginBottom: '4px', display: 'block' }}>Work Email *</label>
                                                <input
                                                    type="email"
                                                    required
                                                    style={{ border: '1.5px solid #e0e0e0', borderRadius: '7px', padding: '9px 12px', fontSize: '12.5px', width: '100%', color: '#333', outline: 'none', background: '#fafafa' }}
                                                    placeholder="name@company.com"
                                                    value={miceForm.email}
                                                    onChange={(e) => setMiceForm({ ...miceForm, email: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="ft-form-group">
                                                <label style={{ color: '#555', fontWeight: 600, fontSize: '11px', marginBottom: '4px', display: 'block' }}>Phone Number *</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    style={{ border: '1.5px solid #e0e0e0', borderRadius: '7px', padding: '9px 12px', fontSize: '12.5px', width: '100%', color: '#333', outline: 'none', background: '#fafafa' }}
                                                    placeholder="+91 XXXXX XXXXX"
                                                    value={miceForm.phone}
                                                    onChange={(e) => setMiceForm({ ...miceForm, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row g-2 mb-3">
                                        <div className="col-md-6">
                                            <div className="ft-form-group">
                                                <label style={{ color: '#555', fontWeight: 600, fontSize: '11px', marginBottom: '4px', display: 'block' }}>Event Type *</label>
                                                <select
                                                    required
                                                    style={{ border: '1.5px solid #e0e0e0', borderRadius: '7px', padding: '9px 12px', fontSize: '12.5px', width: '100%', color: '#333', outline: 'none', background: '#fafafa', cursor: 'pointer' }}
                                                    value={miceForm.eventType}
                                                    onChange={(e) => setMiceForm({ ...miceForm, eventType: e.target.value })}
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
                                                <label style={{ color: '#555', fontWeight: 600, fontSize: '11px', marginBottom: '4px', display: 'block' }}>Attendees *</label>
                                                <select
                                                    required
                                                    style={{ border: '1.5px solid #e0e0e0', borderRadius: '7px', padding: '9px 12px', fontSize: '12.5px', width: '100%', color: '#333', outline: 'none', background: '#fafafa', cursor: 'pointer' }}
                                                    value={miceForm.attendees}
                                                    onChange={(e) => setMiceForm({ ...miceForm, attendees: e.target.value })}
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

                                    <button type="submit" className="ft-mice-cta btn btn-success" style={{ marginTop: '10px', width: '100%', color: '#fff', border: 0 }} disabled={miceSubmitting}>
                                        {miceSubmitting ? 'Submitting...' : <>Submit Inquiry <i className="bi bi-send-fill"></i></>}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
