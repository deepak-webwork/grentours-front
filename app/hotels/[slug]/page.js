'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import StayInquiryForm from '../../../components/booking/StayInquiryForm';
import DetailGallery from '../../../components/booking/DetailGallery';
import RelatedCardsSwiper from '../../../components/booking/RelatedCardsSwiper';
import { TourPlanAccordion, FaqAccordion } from '../../../components/booking/DetailAccordion';
import {
    normalizePackageDetail,
    formatCurrency,
    getAmenityIcon,
} from '../../../lib/packageDetail';

export default function HotelDetailPage() {
    const params = useParams();
    const [hotel, setHotel] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
    const [openFaqIndex, setOpenFaqIndex] = useState(-1);
    const [openDayIndex, setOpenDayIndex] = useState(0);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
                const res = await fetch(`${apiUrl}/api/v1/packages/${params.slug}`);
                if (!res.ok) throw new Error('Hotel details could not be loaded');
                const resData = await res.json();
                if (!resData.success || !resData.data) {
                    throw new Error(resData.message || 'Failed to load details');
                }

                const normalized = normalizePackageDetail(resData.data, apiUrl);
                const hotelTypes = ['hotel', 'resort', 'staycation'];
                if (!hotelTypes.includes(normalized.packageType)) {
                    throw new Error('This property is not available as a hotel listing.');
                }
                setHotel(normalized);

                const relRes = await fetch(`${apiUrl}/api/v1/hotels?limit=8`);
                const relData = await relRes.json();
                if (relData.success) {
                    setRelated(relData.data.filter((h) => h.slug !== normalized.slug).slice(0, 6));
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (params.slug) fetchDetail();
    }, [params.slug]);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <link rel="stylesheet" href="/assets/css/package-details.css" />
                <div className="spinner-border text-success" />
                <p className="mt-2 text-muted">Loading hotel details...</p>
            </div>
        );
    }

    if (error || !hotel) {
        return (
            <div className="container py-5 text-center">
                <link rel="stylesheet" href="/assets/css/package-details.css" />
                <i className="bi bi-exclamation-triangle-fill text-danger fs-1" />
                <h3 className="mt-3 fw-bold">Hotel Not Found</h3>
                <p className="text-muted">{error || 'The requested property could not be retrieved.'}</p>
                <Link href="/hotels" className="btn btn-success rounded-pill px-4 mt-2">Back to Hotels</Link>
            </div>
        );
    }

    const galleryImages = hotel.images?.length ? hotel.images : [hotel.image];
    const propertyLabel = hotel.packageType === 'resort' ? 'Resort' : hotel.packageType === 'staycation' ? 'Staycation' : 'Hotel';

    const quickInfo = [
        hotel.stars ? { label: 'Star Rating', val: `${hotel.stars} Star Property`, icon: 'bi-star-fill' } : null,
        { label: 'Property Type', val: propertyLabel, icon: 'bi-building' },
        { label: 'Location', val: hotel.location, icon: 'bi-geo-alt' },
        hotel.durationText ? { label: 'Stay Duration', val: hotel.durationText, icon: 'bi-moon-stars' } : null,
    ].filter(Boolean);

    return (
        <div className="details-wrapper py-4">
            <link rel="stylesheet" href="/assets/css/package-details.css" />
            <div className="container-xl">
                <div className="details-breadcrumb mb-3">
                    <Link href="/">Home</Link> &nbsp;/&nbsp;
                    <Link href="/hotels">Hotels &amp; Resorts</Link> &nbsp;/&nbsp;
                    <span className="active">{hotel.title}</span>
                </div>

                <div className="details-header-section mb-4">
                    <div className="details-title-row">
                        <div className="details-title-col">
                            <h1 className="details-title">{hotel.title}</h1>
                            <div className="details-meta-row">
                                <span className="details-price-tag">From {formatCurrency(hotel.price)} / Night</span>
                                <span className="details-meta-item">
                                    <i className="bi bi-geo-alt-fill text-danger" /> {hotel.location}
                                </span>
                                {hotel.stars > 0 && (
                                    <span className="details-meta-item">
                                        {Array.from({ length: hotel.stars }).map((_, i) => (
                                            <i key={i} className="bi bi-star-fill text-warning" />
                                        ))}
                                        <span className="ms-1">{hotel.stars} Star</span>
                                    </span>
                                )}
                                <span className="details-meta-item">
                                    <i className="bi bi-star-fill text-warning" /> {hotel.rating} ({hotel.reviews} Reviews)
                                </span>
                            </div>
                        </div>
                        <div className="details-header-actions">
                            <button
                                type="button"
                                className="header-action-btn"
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert('Link copied to clipboard!');
                                }}
                            >
                                <i className="bi bi-share-fill" /> Share
                            </button>
                        </div>
                    </div>
                </div>

                <DetailGallery
                    images={galleryImages}
                    title={hotel.title}
                    activeIndex={activeGalleryIndex}
                    onSelect={setActiveGalleryIndex}
                />

                {quickInfo.length > 0 && (
                    <div className="tour-quick-info-bar mb-4">
                        {quickInfo.map((item) => (
                            <div className="quick-info-item" key={item.label}>
                                <div className="quick-info-icon"><i className={`bi ${item.icon}`} /></div>
                                <div className="quick-info-text">
                                    <span className="quick-info-label">{item.label}</span>
                                    <span className="quick-info-val">{item.val}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="row g-4 details-content-row">
                    <div className="col-lg-8">
                        <div className="d-flex flex-column gap-4">
                            {hotel.description && (
                                <div className="details-card">
                                    <h2>About This Property</h2>
                                    <div className="about-tour-text" dangerouslySetInnerHTML={{ __html: hotel.description }} />
                                </div>
                            )}

                            {hotel.tripHighlights.length > 0 && (
                                <div className="details-card">
                                    <h2>Property Highlights</h2>
                                    <ul className="highlights-list">
                                        {hotel.tripHighlights.map((h, i) => (
                                            <li key={i}>
                                                <i className="bi bi-check-circle-fill" />
                                                <span dangerouslySetInnerHTML={{ __html: h }} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {hotel.amenities.length > 0 && (
                                <div className="details-card">
                                    <h2>Amenities &amp; Facilities</h2>
                                    <div className="amenities-grid">
                                        {hotel.amenities.map((am, i) => (
                                            <div className="amenity-item" key={i}>
                                                <i className={`bi ${getAmenityIcon(am)}`} />
                                                <span>{am}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {hotel.inclusions.length > 0 && (
                                <div className="details-card">
                                    <h2>What&apos;s Included</h2>
                                    <ul className="highlights-list">
                                        {hotel.inclusions.map((item, i) => (
                                            <li key={i}>
                                                <i className="bi bi-check-lg" />
                                                <span dangerouslySetInnerHTML={{ __html: item }} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {hotel.exclusions.length > 0 && (
                                <div className="details-card">
                                    <h2>Not Included</h2>
                                    <ul className="highlights-list highlights-list--muted">
                                        {hotel.exclusions.map((item, i) => (
                                            <li key={i}>
                                                <i className="bi bi-x-circle" />
                                                <span dangerouslySetInnerHTML={{ __html: item }} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {hotel.tourPlan.length > 0 && (
                                <div className="details-card">
                                    <h2>Stay Plan</h2>
                                    <p className="tour-plan-summary">Day-by-day outline for your stay package.</p>
                                    <TourPlanAccordion
                                        items={hotel.tourPlan}
                                        openIndex={openDayIndex}
                                        onToggle={setOpenDayIndex}
                                    />
                                </div>
                            )}

                            {hotel.faqs.length > 0 && (
                                <div className="details-card">
                                    <h2>Frequently Asked Questions</h2>
                                    <FaqAccordion
                                        items={hotel.faqs}
                                        openIndex={openFaqIndex}
                                        onToggle={setOpenFaqIndex}
                                    />
                                </div>
                            )}

                            {hotel.mapSrc && (
                                <div className="details-card">
                                    <h2>Location</h2>
                                    <div className="map-container-box">
                                        <iframe src={hotel.mapSrc} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Hotel location" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <aside className="details-sidebar-col">
                            <div className="details-sidebar-sticky">
                                <StayInquiryForm
                                    packageId={hotel.id}
                                    packageTitle={hotel.title}
                                    enquiryType="hotel"
                                    title="Book This Stay"
                                    dateLabel="Check-in Date"
                                    submitLabel="Send Inquiry"
                                />
                            </div>
                        </aside>
                    </div>
                </div>

                {related.length > 0 && (
                    <div className="popular-tours-section">
                        <h2>More Hotels &amp; Resorts</h2>
                        <p>Explore other premium stays handpicked for you.</p>
                        <RelatedCardsSwiper items={related} variant="hotel" basePath="/hotels" />
                    </div>
                )}
            </div>
        </div>
    );
}
