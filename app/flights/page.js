'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

// Import swiper styles if needed locally
import 'swiper/css';
import 'swiper/css/pagination';

const TRIP_TYPE_MAP = {
    'one-way': 'one_way',
    'round-trip': 'round_trip',
    'multi-city': 'multi_city',
};

const TRAVEL_CLASS_MAP = {
    'Economy': 'economy',
    'Premium Economy': 'premium_economy',
    'Business': 'business',
    'First Class': 'first_class',
};

const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function todayDateString() {
    return new Date().toISOString().split('T')[0];
}

export default function FlightsPage() {
    // Trip Type: 'round-trip' | 'one-way' | 'multi-city'
    const [tripType, setTripType] = useState('round-trip');

    // Flight Form Fields
    const [leavingFrom, setLeavingFrom] = useState('');
    const [goingTo, setGoingTo] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [adults, setAdults] = useState('1');
    const [children, setChildren] = useState('0');
    const [infants, setInfants] = useState('0');
    const [travelClass, setTravelClass] = useState('Economy');

    // Contact Information Fields
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [userMessage, setUserMessage] = useState('');

    // Submission States
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    // Dynamic Advertisements State
    const [advertisements, setAdvertisements] = useState([]);
    const [adsLoading, setAdsLoading] = useState(true);

    // Fetch advertisements on page load
    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        fetch(`${apiUrl}/api/v1/homepage/advertisements`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.banners) {
                    setAdvertisements(data.banners);
                }
            })
            .catch(err => console.error('Error fetching advertisements:', err))
            .finally(() => setAdsLoading(false));
    }, []);

    // Helper to resolve image paths
    const getAdImage = (url) => {
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

    // Distribute ads into Promo and Sidebar slots (even/odd indices)
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

    const validateFlightForm = () => {
        const trimmedName = name.trim();
        const trimmedFrom = leavingFrom.trim();
        const trimmedTo = goingTo.trim();
        const trimmedPhone = phone.trim();
        const trimmedEmail = email.trim();
        const today = todayDateString();

        if (!trimmedFrom) return 'Please enter where you are leaving from.';
        if (!trimmedTo) return 'Please enter your flight destination.';
        if (trimmedFrom.toLowerCase() === trimmedTo.toLowerCase()) {
            return 'Destination must be different from origin.';
        }
        if (!departureDate) return 'Please select a departure date.';
        if (departureDate < today) return 'Departure date cannot be in the past.';
        if (tripType === 'round-trip') {
            if (!returnDate) return 'Please select a return date for your round trip.';
            if (returnDate <= departureDate) return 'Return date must be after departure date.';
        }
        if (!trimmedName || trimmedName.length < 2) return 'Please enter your full name (at least 2 characters).';
        if (!trimmedPhone) return 'Please enter your phone number.';
        if (!PHONE_REGEX.test(trimmedPhone)) return 'Please enter a valid phone number (7–20 digits).';
        if (trimmedEmail && !EMAIL_REGEX.test(trimmedEmail)) return 'Please enter a valid email address.';
        if (parseInt(infants, 10) > parseInt(adults, 10)) {
            return 'Number of infants cannot exceed number of adults.';
        }
        if (userMessage.length > 2000) return 'Special requests must be 2000 characters or less.';
        return '';
    };

    const handleFlightInquirySubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        const validationError = validateFlightForm();
        if (validationError) {
            setErrorMsg(validationError);
            return;
        }

        setIsSubmitting(true);

        const payload = {
            name: name.trim(),
            mobile: phone.trim(),
            email: email.trim() || null,
            leaving_from: leavingFrom.trim(),
            going_to: goingTo.trim(),
            departure_date: departureDate,
            return_date: tripType === 'round-trip' ? returnDate : null,
            travel_class: TRAVEL_CLASS_MAP[travelClass],
            adults: parseInt(adults, 10),
            children: parseInt(children, 10),
            infants: parseInt(infants, 10),
            trip_type: TRIP_TYPE_MAP[tripType],
            message: userMessage.trim() || null,
        };

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
            const response = await fetch(`${apiUrl}/api/v1/enquiries/flight`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSubmittedData({
                    id: data.data?.id ? `GR-FLT-${data.data.id}` : 'GR-FLT-PENDING',
                    leavingFrom,
                    goingTo,
                    departureDate,
                    returnDate,
                    travelClass,
                    adults,
                    children,
                    infants,
                    name,
                    phone
                });
            } else {
                const errorDetails = data.errors
                    ? Object.values(data.errors).flat().join(' ')
                    : '';
                setErrorMsg(errorDetails || data.message || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            console.error('Submission error:', err);
            setErrorMsg('Failed to connect to the server. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            {/* Import Custom Flights Stylesheet */}
            <link rel="stylesheet" href="/assets/css/flights-style.css" />

            {/* Flights Hero banner */}
            <div className="flights-hero">
                <div className="container-xl">
                    <div className="flights-hero-container">
                        <span className="flights-hero-badge">Worldwide Flight Bookings</span>
                        <h1 className="flights-hero-title">Custom Flight Inquiries & Quotes</h1>
                        <p className="flights-hero-subtitle">
                            Compare premium airlines, secure flexible ticketing, and receive personalized assistance from our certified travel specialists.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container-xl">
                <div className="flights-detail-layout">
                {/* LEFT COLUMN: Inquiry form / success confirmation */}
                <div>
                    <Link href="/" className="visa-back-link">
                        <i className="bi bi-arrow-left"></i> Back to Home
                    </Link>

                    {!submittedData ? (
                        <div className="flights-section-card">
                            <h2 className="flights-section-title">
                                <i className="bi bi-send-fill"></i> Find Best Flight Rates
                            </h2>

                            {errorMsg && (
                                <div className="alert alert-danger py-2" role="alert" style={{ fontSize: '0.9rem', borderRadius: '8px' }}>
                                    <i className="bi bi-exclamation-triangle-fill mr-2"></i> {errorMsg}
                                </div>
                            )}

                            <form onSubmit={handleFlightInquirySubmit}>
                                {/* Segmented Trip Type buttons */}
                                <div className="trip-type-selector">
                                    <button 
                                        type="button" 
                                        className={`trip-type-btn ${tripType === 'one-way' ? 'active' : ''}`}
                                        onClick={() => setTripType('one-way')}
                                    >
                                        <i className="bi bi-arrow-right-short"></i> One Way
                                    </button>
                                    <button 
                                        type="button" 
                                        className={`trip-type-btn ${tripType === 'round-trip' ? 'active' : ''}`}
                                        onClick={() => setTripType('round-trip')}
                                    >
                                        <i className="bi bi-arrow-left-right"></i> Round Trip
                                    </button>
                                    <button 
                                        type="button" 
                                        className={`trip-type-btn ${tripType === 'multi-city' ? 'active' : ''}`}
                                        onClick={() => setTripType('multi-city')}
                                    >
                                        <i className="bi bi-grid-1x2"></i> Multi-City
                                    </button>
                                </div>

                                {/* From / To inputs */}
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="flight-form-label">Leaving From</label>
                                        <div className="flight-input-icon-wrap">
                                            <input 
                                                type="text" 
                                                className="flight-form-input" 
                                                placeholder="Enter Origin City or Airport" 
                                                value={leavingFrom}
                                                onChange={(e) => setLeavingFrom(e.target.value)}
                                                required
                                            />
                                            <i className="bi bi-geo-alt"></i>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="flight-form-label">Going To</label>
                                        <div className="flight-input-icon-wrap">
                                            <input 
                                                type="text" 
                                                className="flight-form-input" 
                                                placeholder="Enter Destination City or Airport" 
                                                value={goingTo}
                                                onChange={(e) => setGoingTo(e.target.value)}
                                                required
                                            />
                                            <i className="bi bi-geo-alt-fill"></i>
                                        </div>
                                    </div>
                                </div>

                                {/* Departure & Return Dates */}
                                <div className="row g-3 mt-2">
                                    <div className="col-md-6">
                                        <label className="flight-form-label">Departure Date</label>
                                        <div className="flight-input-icon-wrap">
                                            <input 
                                                type="date" 
                                                className="flight-form-input" 
                                                value={departureDate}
                                                min={todayDateString()}
                                                onChange={(e) => setDepartureDate(e.target.value)}
                                                required
                                            />
                                            <i className="bi bi-calendar3"></i>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="flight-form-label">Return Date</label>
                                        <div className="flight-input-icon-wrap">
                                            <input 
                                                type="date" 
                                                className="flight-form-input" 
                                                value={returnDate}
                                                min={departureDate || todayDateString()}
                                                onChange={(e) => setReturnDate(e.target.value)}
                                                disabled={tripType !== 'round-trip'}
                                                placeholder={tripType !== 'round-trip' ? 'No return required' : ''}
                                                required={tripType === 'round-trip'}
                                            />
                                            <i className="bi bi-calendar3-range"></i>
                                        </div>
                                    </div>
                                </div>

                                {/* Passengers counts & Travel Class */}
                                <div className="row g-3 mt-2">
                                    <div className="col-md-3 col-6">
                                        <label className="flight-form-label">Adults (12+ Yrs)</label>
                                        <div className="flight-input-icon-wrap">
                                            <select 
                                                className="flight-form-select" 
                                                value={adults}
                                                onChange={(e) => setAdults(e.target.value)}
                                            >
                                                {[...Array(9)].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                ))}
                                            </select>
                                            <i className="bi bi-person"></i>
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-6">
                                        <label className="flight-form-label">Children (2-12 Yrs)</label>
                                        <div className="flight-input-icon-wrap">
                                            <select 
                                                className="flight-form-select" 
                                                value={children}
                                                onChange={(e) => setChildren(e.target.value)}
                                            >
                                                {[...Array(6)].map((_, i) => (
                                                    <option key={i} value={i}>{i}</option>
                                                ))}
                                            </select>
                                            <i className="bi bi-people"></i>
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-6">
                                        <label className="flight-form-label">Infants (0-2 Yrs)</label>
                                        <div className="flight-input-icon-wrap">
                                            <select 
                                                className="flight-form-select" 
                                                value={infants}
                                                onChange={(e) => setInfants(e.target.value)}
                                            >
                                                {[...Array(6)].map((_, i) => (
                                                    <option key={i} value={i}>{i}</option>
                                                ))}
                                            </select>
                                            <i className="bi bi-emoji-smile"></i>
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-6">
                                        <label className="flight-form-label">Class</label>
                                        <div className="flight-input-icon-wrap">
                                            <select 
                                                className="flight-form-select" 
                                                value={travelClass}
                                                onChange={(e) => setTravelClass(e.target.value)}
                                            >
                                                <option value="Economy">Economy</option>
                                                <option value="Premium Economy">Premium Economy</option>
                                                <option value="Business">Business</option>
                                                <option value="First Class">First Class</option>
                                            </select>
                                            <i className="bi bi-award"></i>
                                        </div>
                                    </div>
                                </div>

                                <hr className="form-section-divider" />

                                {/* Lead Contact Info details */}
                                <h3 className="contact-section-title">
                                    <i className="bi bi-person-lines-fill"></i> Contact & Delivery Information
                                </h3>

                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="flight-form-label">Your Name</label>
                                        <div className="flight-input-icon-wrap">
                                            <input 
                                                type="text" 
                                                className="flight-form-input" 
                                                placeholder="Enter full name" 
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                            <i className="bi bi-person-badge"></i>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="flight-form-label">Mobile Number</label>
                                        <div className="flight-input-icon-wrap">
                                            <input 
                                                type="tel" 
                                                className="flight-form-input" 
                                                placeholder="Enter phone number" 
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                required
                                            />
                                            <i className="bi bi-telephone"></i>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="flight-form-label">Email Address</label>
                                        <div className="flight-input-icon-wrap">
                                            <input 
                                                type="email" 
                                                className="flight-form-input" 
                                                placeholder="Enter email address" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <i className="bi bi-envelope-at"></i>
                                        </div>
                                    </div>
                                </div>

                                <div className="row g-3 mt-2">
                                    <div className="col-12">
                                        <label className="flight-form-label">Special Requests / Preferences (Optional)</label>
                                        <div className="flight-input-icon-wrap">
                                            <textarea 
                                                className="flight-form-input" 
                                                style={{ minHeight: '80px', paddingLeft: '14px', paddingTop: '10px' }}
                                                placeholder="Seat preferences, airline choice, stopover requirements..."
                                                value={userMessage}
                                                maxLength={2000}
                                                onChange={(e) => setUserMessage(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="flight-submit-btn" 
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                            Submitting Inquiry...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-search"></i> Request Flight Quotes
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="flight-success-card">
                            <i className="bi bi-check-circle-fill success-icon"></i>
                            <h3>Thank You! Flight Inquiry Received</h3>
                            <p>
                                Your inquiry has been sent to our corporate flight desk successfully. One of our dedicated flight consultants will verify the pricing options and contact you with quotes shortly.
                            </p>

                            <div className="flight-success-info-box">
                                <div className="info-row">
                                    <span className="info-lbl">Lead Reference:</span>
                                    <span className="info-val">{submittedData.id}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-lbl">Origin:</span>
                                    <span className="info-val">{submittedData.leavingFrom}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-lbl">Destination:</span>
                                    <span className="info-val">{submittedData.goingTo}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-lbl">Departure Date:</span>
                                    <span className="info-val">{submittedData.departureDate}</span>
                                </div>
                                {submittedData.returnDate && (
                                    <div className="info-row">
                                        <span className="info-lbl">Return Date:</span>
                                        <span className="info-val">{submittedData.returnDate}</span>
                                    </div>
                                )}
                                <div className="info-row">
                                    <span className="info-lbl">Class:</span>
                                    <span className="info-val">{submittedData.travelClass}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-lbl">Passengers:</span>
                                    <span className="info-val">
                                        {submittedData.adults} Adults
                                        {parseInt(submittedData.children) > 0 && `, ${submittedData.children} Children`}
                                        {parseInt(submittedData.infants) > 0 && `, ${submittedData.infants} Infants`}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="info-lbl">Contact Person:</span>
                                    <span className="info-val">{submittedData.name} ({submittedData.phone})</span>
                                </div>
                            </div>

                            <button 
                                className="btn btn-outline-success px-4 py-2" 
                                style={{ borderRadius: '8px', fontWeight: '600' }}
                                onClick={() => {
                                    setSubmittedData(null);
                                    setLeavingFrom('');
                                    setGoingTo('');
                                    setDepartureDate('');
                                    setReturnDate('');
                                    setName('');
                                    setPhone('');
                                    setEmail('');
                                    setUserMessage('');
                                }}
                            >
                                Submit Another Inquiry
                            </button>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: Sticky dynamic ads sidebar */}
                <div>
                    <div className="sidebar-ads-container">
                        {/* Slot 1: Promo Swiper */}
                        {promoSlides && promoSlides.length > 0 ? (
                            <div className="ft-promo-card">
                                {promoSlides.length > 1 ? (
                                    <Swiper
                                        modules={[Pagination, Autoplay]}
                                        pagination={{ clickable: true }}
                                        autoplay={{ delay: 4500, disableOnInteraction: false }}
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
                        ) : (
                            <div className="ft-promo-card">
                                <div className="ft-promo-img">
                                    <img src="/assets/img/bali-20526.png" alt="Bali Offer Banner" />
                                </div>
                            </div>
                        )}

                        {/* Slot 2: Sidebar Ad Swiper */}
                        {sidebarSlides && sidebarSlides.length > 0 ? (
                            <div className="ft-sidebar-ad">
                                {sidebarSlides.length > 1 ? (
                                    <Swiper
                                        modules={[Pagination, Autoplay]}
                                        pagination={{ clickable: true }}
                                        autoplay={{ delay: 5000, disableOnInteraction: false }}
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
                        ) : (
                            <div className="ft-sidebar-ad">
                                <div className="ft-sidebar-ad-img">
                                    <img src="/assets/img/AIR_Banner_f2_1.webp" alt="Partner Airline Banner" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}
