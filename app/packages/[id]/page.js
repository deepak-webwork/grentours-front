'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { tourPackages } from '../../../data/travel-data';

export default function PackageDetailPage() {
    const params = useParams();
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
    const [openDayIndex, setOpenDayIndex] = useState(0);
    
    // Ticket state
    const [tickets, setTickets] = useState({
        adult: 1,
        youth: 0,
        child: 0
    });
    const [bookingMessage, setBookingMessage] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [bookingSubmitted, setBookingSubmitted] = useState(false);

    useEffect(() => {
        const fetchPackageDetail = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
                const res = await fetch(`${apiUrl}/api/v1/packages/${params.id}`);
                if (!res.ok) throw new Error("Package details could not be loaded");
                const resData = await res.json();
                if (resData.success && resData.data) {
                    const data = resData.data;
                    const durationDays = data.duration_days || 5;
                    const durationNights = data.duration_nights || (durationDays - 1);
                    
                    const getImageUrl = (url) => {
                        if (!url) return '/assets/img/grentours_placeholder.png';
                        if (url.startsWith('http://') || url.startsWith('https://')) {
                            return url;
                        }
                        if (url.startsWith('/assets/') || url.startsWith('assets/')) {
                            return url.startsWith('/') ? url : `/${url}`;
                        }
                        return `${apiUrl}${url.startsWith('/') ? '' : '/'}${url}`;
                    };

                    const images = Array.isArray(data.images) && data.images.length > 0 
                        ? data.images.map(img => getImageUrl(img)) 
                        : [getImageUrl(data.image)];

                    const normalized = {
                        id: data.id,
                        slug: data.slug,
                        title: data.title || "Holiday Package",
                        price: parseFloat(data.price || 0),
                        rating: data.rating || 4.8,
                        reviews: data.reviews || 15,
                        duration: durationDays,
                        durationText: `${durationDays} Days / ${durationNights} Nights`,
                        image: getImageUrl(data.image),
                        images: images,
                        location: data.location || "India",
                        tourType: data.package_type || "Guided Group Tour",
                        groupSize: "15 People",
                        languages: "English, Hindi",
                        description: data.overview || data.description || "",
                        tripHighlights: data.tripHighlights || [],
                        amenities: Array.isArray(data.amenities) ? data.amenities.map(a => a.name) : [],
                        tourPlan: Array.isArray(data.tourPlan) ? data.tourPlan : []
                    };
                    setPkg(normalized);
                } else {
                    throw new Error(resData.message || "Failed to load details");
                }
            } catch (err) {
                console.error("Error loading package details:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (params.id) {
            fetchPackageDetail();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <link rel="stylesheet" href="/assets/css/packages-style.css" />
                <div className="spinner-border text-success"></div>
                <p className="mt-2 text-muted">Loading tour details...</p>
            </div>
        );
    }

    if (error || !pkg) {
        return (
            <div className="container py-5 text-center">
                <link rel="stylesheet" href="/assets/css/packages-style.css" />
                <i className="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
                <h3 className="mt-3 fw-bold">Package Not Found</h3>
                <p className="text-muted">{error || "The requested package could not be retrieved."}</p>
                <Link href="/packages" className="btn btn-success rounded-pill px-4 mt-2">
                    Back to Packages
                </Link>
            </div>
        );
    }


    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const galleryImages = pkg.images || [pkg.image];
    // If only 1 image exists, generate scenic backups for luxury feel
    if (galleryImages.length === 1) {
        galleryImages.push(
            "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1527668752968-14de719262a0?auto=format&fit=crop&w=800&q=80"
        );
    }

    const slideGallery = (direction) => {
        if (direction === 'next') {
            setActiveGalleryIndex((activeGalleryIndex + 1) % galleryImages.length);
        } else {
            setActiveGalleryIndex((activeGalleryIndex - 1 + galleryImages.length) % galleryImages.length);
        }
    };

    const modTicket = (type, change) => {
        setTickets(prev => {
            const newVal = Math.max(0, prev[type] + change);
            if (type === 'adult' && newVal < 1) return prev; // At least 1 adult required
            return { ...prev, [type]: newVal };
        });
    };

    const handleBookingSubmit = (e) => {
        e.preventDefault();
        setBookingSubmitted(true);
        setTimeout(() => setBookingSubmitted(false), 6000);
        setBookingMessage('');
        setBookingDate('');
    };

    // Bottom popular tours suggestions (filter out current package)
    const popularTours = tourPackages.filter(p => p.id !== pkg.id).slice(0, 3);

    // Dynamic map iframe url
    const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(pkg.location)}&t=&z=12&ie=UTF8&iwloc=&output=embed`;

    // Map amenities to icons
    const amenityIconMap = {
        "4-Star Hotels": "bi-building-fill",
        "5-Star Nile Cruise": "bi-ship-egg-fill",
        "Deluxe Hotels": "bi-building",
        "Houseboat Stay": "bi-house-fill",
        "Safari Lodge": "bi-tree-fill",
        "Comfort Hotels": "bi-building-down",
        "Safe Stays": "bi-shield-fill-check",
        "Boutique Stays": "bi-gem",
        "Free Wifi": "bi-wifi",
        "Expert Guide": "bi-person-badge-fill",
        "Breakfast Included": "bi-egg-fried",
        "Indian Meals": "bi-cup-hot-fill",
        "All Meals": "bi-egg-fried",
        "All Meals Included": "bi-egg-fried",
        "Entrance Fees": "bi-ticket-detailed-fill",
        "Airport Transfers": "bi-car-front-fill",
        "All Transfers": "bi-truck",
        "Private AC Car": "bi-car-front",
        "AC Coach": "bi-bus-front",
        "Comfortable Coach": "bi-bus-front-fill",
        "Travel Insurance": "bi-shield-fill-plus",
        "Flight Tickets": "bi-airplane-fill",
        "All Flights Included": "bi-airplane-fill"
    };

    return (
        <div className="details-wrapper py-4">
            <link rel="stylesheet" href="/assets/css/packages-style.css" />
            <div className="container-xl">
                
                {/* Breadcrumbs */}
                <div className="details-breadcrumb mb-3">
                    <Link href="/">Home</Link> &nbsp;/&nbsp; 
                    <Link href="/packages">Tour Packages</Link> &nbsp;/&nbsp; 
                    <span className="active">{pkg.title}</span>
                </div>

                {/* Title & Meta Row */}
                <div className="details-header-section mb-4" data-aos="fade-up">
                    <div className="details-title-row d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                        <div className="details-title-col">
                            <h1 className="h3 fw-bold text-dark mb-2" id="pkgTitle">{pkg.title}</h1>
                            <div className="details-meta-row d-flex flex-wrap align-items-center gap-3" style={{fontSize: '13px'}}>
                                <span className="details-price-tag text-success fw-bold fs-5" id="pkgPrice">From {formatCurrency(pkg.price)} / Person</span>
                                <div className="details-meta-item text-muted">
                                    <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                                    <span id="pkgLocation">{pkg.location}</span>
                                </div>
                                <div className="details-meta-item text-muted">
                                    <i className="bi bi-star-fill text-warning me-1"></i>
                                    <span id="pkgRating">{pkg.rating} ({pkg.reviews} Reviews)</span>
                                </div>
                            </div>
                        </div>
                        <div className="details-header-actions d-flex gap-2">
                            <button className="header-action-btn btn btn-sm btn-outline-secondary rounded-pill px-3 py-1.5 fw-semibold" onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert("Link copied to clipboard! Share it with friends.");
                            }}>
                                <i className="bi bi-share-fill me-1"></i> Share
                            </button>
                            <button className="header-action-btn btn btn-sm btn-outline-danger rounded-pill px-3 py-1.5 fw-semibold" onClick={() => alert("Downloading PDF Brochure...")}>
                                <i className="bi bi-file-earmark-pdf-fill me-1"></i> Download PDF
                            </button>
                        </div>
                    </div>
                </div>

                {/* Gallery Slider Block */}
                <div className="gallery-container mb-4 rounded-4 overflow-hidden shadow-sm" data-aos="fade-up">
                    <div className="gallery-main-frame position-relative" style={{height: '420px', width: '100%'}}>
                        <button className="gallery-nav-arrow gallery-nav-prev position-absolute start-0 top-50 translate-middle-y ms-3 btn btn-light rounded-circle" onClick={() => slideGallery('prev')} style={{zIndex: 5}}>
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        <img 
                            id="mainGalleryImg" 
                            src={galleryImages[activeGalleryIndex] || '/assets/img/grentours_placeholder.png'} 
                            alt={`${pkg.title} view ${activeGalleryIndex + 1}`} 
                            className="w-100 h-100" 
                            style={{objectFit: 'cover'}} 
                            onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }}
                        />
                        <button className="gallery-nav-arrow gallery-nav-next position-absolute end-0 top-50 translate-middle-y me-3 btn btn-light rounded-circle" onClick={() => slideGallery('next')} style={{zIndex: 5}}>
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                    <div className="gallery-thumbs-row d-flex gap-2 p-2 bg-light border-top" id="thumbsRow" style={{overflowX: 'auto'}}>
                        {galleryImages.map((imgUrl, idx) => (
                            <img 
                                key={idx}
                                src={imgUrl || '/assets/img/grentours_placeholder.png'} 
                                alt="thumb" 
                                className={`gallery-thumb-item rounded cursor-pointer ${idx === activeGalleryIndex ? 'active border border-success border-2' : ''}`}
                                style={{width: '80px', height: '55px', objectFit: 'cover', opacity: idx === activeGalleryIndex ? 1 : 0.6}}
                                onClick={() => setActiveGalleryIndex(idx)}
                                onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }}
                            />
                        ))}
                    </div>
                </div>

                {/* Key Info Bar */}
                <div className="tour-quick-info-bar d-flex flex-wrap gap-3 bg-white p-3 rounded-4 shadow-sm border border-light mb-4" data-aos="fade-up">
                    {[
                        { label: "Duration", val: `${pkg.duration} Days / ${pkg.duration - 1} Nights`, icon: "bi-clock" },
                        { label: "Type", val: pkg.tourType || "Guided Group Tour", icon: "bi-compass" },
                        { label: "Group Size", val: pkg.groupSize || "15 People", icon: "bi-people" },
                        { label: "Languages", val: pkg.languages || "English, Hindi", icon: "bi-translate" }
                    ].map((item, index) => (
                        <div className="quick-info-item d-flex align-items-center gap-3 px-3 py-1 flex-grow-1" key={index} style={{borderRight: index < 3 ? '1px solid #f1f5f9' : 'none', minWidth: '180px'}}>
                            <div className="quick-info-icon text-success fs-3"><i className={`bi ${item.icon}`}></i></div>
                            <div className="quick-info-text">
                                <span className="quick-info-label text-muted small d-block">{item.label}</span>
                                <span className="quick-info-val fw-bold text-dark" style={{fontSize: '14px'}}>{item.val}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2-Column Grid Content */}
                <div className="row g-4">
                    
                    {/* Left Column Content (col-lg-8) */}
                    <div className="col-lg-8">
                        <div className="d-flex flex-column gap-4">
                            
                            {/* About Card */}
                            <div className="details-card bg-white p-4 rounded-4 shadow-sm border border-light" data-aos="fade-up">
                                <h2 className="h4 fw-bold text-dark mb-3">About This Tour</h2>
                                <p className="about-tour-text text-muted mb-0" style={{lineHeight: '1.7', fontSize: '14.5px'}}>
                                    {pkg.description}
                                </p>
                            </div>

                            {/* Highlights Card */}
                            <div className="details-card bg-white p-4 rounded-4 shadow-sm border border-light" data-aos="fade-up">
                                <h2 className="h4 fw-bold text-dark mb-3">Trip Highlights</h2>
                                <ul className="highlights-list list-unstyled d-flex flex-column gap-2 mb-0">
                                    {(pkg.tripHighlights || [
                                        "Fully guided city tours covering major attractions",
                                        "Premium transport support with professional local guide",
                                        "Handpicked standard accommodations with scenic views",
                                        "Included breakfast meals and selected sightseeing entries"
                                    ]).map((h, i) => (
                                        <li key={i} className="d-flex align-items-start gap-2.5 small text-muted">
                                            <i className="bi bi-check-circle-fill text-success fs-6 mt-0.5"></i>
                                            <span>{h}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Amenities Card */}
                            <div className="details-card bg-white p-4 rounded-4 shadow-sm border border-light" data-aos="fade-up">
                                <h2 className="h4 fw-bold text-dark mb-3">Amenities Included</h2>
                                <div className="amenities-grid d-grid gap-3" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))'}}>
                                    {(pkg.amenities || ["Breakfast Included", "Expert Guide", "Airport Transfers", "Safe Stays"]).map((am, i) => {
                                        const iconClass = amenityIconMap[am] || "bi-check-all";
                                        return (
                                            <div className="amenity-item d-flex align-items-center gap-2 bg-light bg-opacity-50 p-2.5 rounded-3 border border-light-subtle" key={i}>
                                                <i className={`bi ${iconClass} text-success fs-5`}></i>
                                                <span className="small text-dark fw-semibold">{am}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Tour Plan Accordion Card */}
                            <div className="details-card bg-white p-4 rounded-4 shadow-sm border border-light" data-aos="fade-up">
                                <h2 className="h4 fw-bold text-dark mb-2">Tour Plan &amp; Itinerary</h2>
                                <p className="text-muted small mb-4">Carefully curated day-by-day plans built to give you the perfect blend of guided sightseeing experiences and relaxing free time.</p>
                                
                                <div className="tour-plan-stack d-flex flex-column gap-3">
                                    {(pkg.tourPlan || [
                                        { day: "Day 01", title: "Arrival & Welcome Reception", desc: `Arrive at the destination airport. Meet our local representative and enjoy a seamless air-conditioned transfer to your premium hotel. Check-in and relax.` },
                                        { day: "Day 02", title: "City Sightseeing & Landmark Tour", desc: `After breakfast, proceed for a comprehensive guided tour of the city's top landmarks, historical markets, and beautiful gardens.` },
                                        { day: "Day 03", title: "Excursion & Scenic Drive", desc: `Enjoy a full day excursion into the surrounding countryside or special adventure zones. Includes lunch and scenic stops.` },
                                        { day: "Day 04", title: "Departure & Flight Back", desc: `Free time for shopping before transfer to airport for departure flight. Return home with sweet memories.` }
                                    ]).map((plan, i) => {
                                        const isOpen = openDayIndex === i;
                                        return (
                                            <div className="tour-plan-day rounded-3 overflow-hidden border border-light-subtle" key={i}>
                                                <div 
                                                    className={`day-header p-3 d-flex justify-content-between align-items-center cursor-pointer ${isOpen ? 'bg-success text-white' : 'bg-light text-dark'}`}
                                                    onClick={() => setOpenDayIndex(isOpen ? -1 : i)}
                                                    style={{fontWeight: 700, fontSize: '14.5px'}}
                                                >
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className={`badge ${isOpen ? 'bg-white text-success' : 'bg-success text-white'} px-2 py-1`}>{plan.day}</span>
                                                        <span>{plan.title}</span>
                                                    </div>
                                                    <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                                </div>
                                                {isOpen && (
                                                    <div className="day-body p-3 bg-white text-muted small" style={{lineHeight: '1.7'}}>
                                                        {plan.desc}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Location Map Card */}
                            <div className="details-card bg-white p-4 rounded-4 shadow-sm border border-light" data-aos="fade-up">
                                <h2 className="h4 fw-bold text-dark mb-3">Location Map</h2>
                                <div className="map-container-box rounded-3 overflow-hidden border" style={{height: '300px'}}>
                                    <iframe 
                                        src={mapSrc} 
                                        width="100%" 
                                        height="100%" 
                                        style={{border: 0}} 
                                        allowFullScreen="" 
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Right Column Sidebar (col-lg-4) */}
                    <div className="col-lg-4">
                        <aside className="details-sidebar-col sticky-top" style={{top: '120px'}}>
                            
                            {/* Booking Card */}
                            <div className="booking-sticky-card bg-white p-4 rounded-4 shadow-sm border border-light" data-aos="fade-up">
                                <h3 className="h5 fw-bold text-dark mb-3">Book Tour / Send Inquiry</h3>
                                
                                {bookingSubmitted ? (
                                    <div className="alert alert-success text-center py-4 rounded-3 border-0">
                                        <i className="bi bi-check-circle-fill fs-2 text-success d-block mb-2"></i>
                                        <span className="fw-bold d-block">Request Received!</span>
                                        <span className="small text-muted d-block mt-1">Our agent will call you with a custom quote for {tickets.adult} Adults and {tickets.youth + tickets.child} Children.</span>
                                    </div>
                                ) : (
                                    <form onSubmit={handleBookingSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label small fw-semibold text-muted mb-1">Travel Date *</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white border-light-subtle"><i className="bi bi-calendar3 text-muted"></i></span>
                                                <input 
                                                    type="date" 
                                                    className="form-control border-light-subtle" 
                                                    required 
                                                    value={bookingDate} 
                                                    onChange={(e) => setBookingDate(e.target.value)} 
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label small fw-semibold text-muted mb-2 d-block">Number of Tickets</label>
                                            <div className="ticket-counters-box bg-light bg-opacity-50 p-2.5 rounded-3 border border-light-subtle d-flex flex-column gap-2.5">
                                                
                                                {/* Adult */}
                                                <div className="ticket-counter-row d-flex justify-content-between align-items-center">
                                                    <div className="ticket-label">
                                                        <span className="d-block fw-bold text-dark" style={{fontSize: '13px'}}>Adult</span>
                                                        <small className="text-muted" style={{fontSize: '10px'}}>(12+ yrs)</small>
                                                    </div>
                                                    <div className="ticket-controls d-flex align-items-center gap-2">
                                                        <button type="button" className="btn btn-sm btn-outline-secondary rounded-circle px-2 py-0" onClick={() => modTicket('adult', -1)}>-</button>
                                                        <span className="fw-bold px-1" style={{fontSize: '13px'}}>{tickets.adult}</span>
                                                        <button type="button" className="btn btn-sm btn-outline-secondary rounded-circle px-2 py-0" onClick={() => modTicket('adult', 1)}>+</button>
                                                    </div>
                                                </div>

                                                {/* Youth */}
                                                <div className="ticket-counter-row d-flex justify-content-between align-items-center">
                                                    <div className="ticket-label">
                                                        <span className="d-block fw-bold text-dark" style={{fontSize: '13px'}}>Youth</span>
                                                        <small className="text-muted" style={{fontSize: '10px'}}>(6-12 yrs)</small>
                                                    </div>
                                                    <div className="ticket-controls d-flex align-items-center gap-2">
                                                        <button type="button" className="btn btn-sm btn-outline-secondary rounded-circle px-2 py-0" onClick={() => modTicket('youth', -1)}>-</button>
                                                        <span className="fw-bold px-1" style={{fontSize: '13px'}}>{tickets.youth}</span>
                                                        <button type="button" className="btn btn-sm btn-outline-secondary rounded-circle px-2 py-0" onClick={() => modTicket('youth', 1)}>+</button>
                                                    </div>
                                                </div>

                                                {/* Child */}
                                                <div className="ticket-counter-row d-flex justify-content-between align-items-center">
                                                    <div className="ticket-label">
                                                        <span className="d-block fw-bold text-dark" style={{fontSize: '13px'}}>Child</span>
                                                        <small className="text-muted" style={{fontSize: '10px'}}>(2-6 yrs)</small>
                                                    </div>
                                                    <div className="ticket-controls d-flex align-items-center gap-2">
                                                        <button type="button" className="btn btn-sm btn-outline-secondary rounded-circle px-2 py-0" onClick={() => modTicket('child', -1)}>-</button>
                                                        <span className="fw-bold px-1" style={{fontSize: '13px'}}>{tickets.child}</span>
                                                        <button type="button" className="btn btn-sm btn-outline-secondary rounded-circle px-2 py-0" onClick={() => modTicket('child', 1)}>+</button>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label small fw-semibold text-muted mb-1">Write Message</label>
                                            <textarea 
                                                className="form-control border-light-subtle rounded-3" 
                                                rows="3" 
                                                placeholder="Enter special requirements, dietary choices, or custom routing..."
                                                value={bookingMessage}
                                                onChange={(e) => setBookingMessage(e.target.value)}
                                            />
                                        </div>

                                        <button type="submit" className="btn btn-success w-100 py-2.5 rounded-pill fw-bold text-uppercase" style={{fontSize: '13px', letterSpacing: '0.5px'}}>
                                            Send Inquiry <i className="bi bi-arrow-right ms-1"></i>
                                        </button>
                                    </form>
                                )}
                            </div>

                        </aside>
                    </div>

                </div>

                {/* Popular Tours Section */}
                <div className="popular-tours-section mt-5" data-aos="fade-up">
                    <h2 className="h4 fw-bold text-dark mb-1">Our Popular Tours</h2>
                    <p className="text-muted small mb-4">Explore some of our other highly recommended holiday tour packages globally.</p>
                    <div className="row g-4" id="popularToursGrid">
                        {popularTours.map(item => (
                            <div className="col-md-4" key={item.id}>
                                <div className="card h-100 rounded-4 overflow-hidden border-light-subtle shadow-sm">
                                    <img src={item.image || '/assets/img/grentours_placeholder.png'} alt={item.title} className="card-img-top" style={{height: '180px', objectFit: 'cover'}} onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} />
                                    <div className="card-body p-3.5 d-flex flex-column justify-content-between">
                                        <div>
                                            <h5 className="fw-bold mb-2 text-dark text-truncate-2" style={{height: '44px', fontSize: '14.5px'}}>{item.title}</h5>
                                            <div className="d-flex justify-content-between text-muted mb-3" style={{fontSize: '11px'}}>
                                                <span><i className="bi bi-geo-alt-fill text-danger me-1"></i>{item.location.split(',')[1] || item.location}</span>
                                                <span><i className="bi bi-clock me-1"></i>{item.durationText}</span>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center pt-2.5 border-top border-light-subtle">
                                            <span className="text-success fw-bold" style={{fontSize: '14.5px'}}>{formatCurrency(item.price)}</span>
                                            <Link href={`/packages/${item.id}`} className="btn btn-xs btn-success rounded-pill fw-bold px-3 py-1" style={{fontSize: '11px'}}>
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
