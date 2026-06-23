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

export default function PackageDetailPage() {
    const params = useParams();
    const [pkg, setPkg] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
    const [openDayIndex, setOpenDayIndex] = useState(0);
    const [openFaqIndex, setOpenFaqIndex] = useState(-1);

    useEffect(() => {
        const fetchPackageDetail = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
                const res = await fetch(`${apiUrl}/api/v1/packages/${params.slug}`);
                if (!res.ok) throw new Error('Package details could not be loaded');
                const resData = await res.json();
                if (!resData.success || !resData.data) {
                    throw new Error(resData.message || 'Failed to load details');
                }

                const normalized = normalizePackageDetail(resData.data, apiUrl);
                setPkg(normalized);

                const relRes = await fetch(`${apiUrl}/api/v1/packages?limit=8`);
                const relData = await relRes.json();
                if (relData.success) {
                    setRelated(relData.data.filter((p) => p.slug !== normalized.slug).slice(0, 6));
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (params.slug) fetchPackageDetail();
    }, [params.slug]);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <link rel="stylesheet" href="/assets/css/package-details.css" />
                <div className="spinner-border text-success" />
                <p className="mt-2 text-muted">Loading tour details...</p>
            </div>
        );
    }

    if (error || !pkg) {
        return (
            <div className="container py-5 text-center">
                <link rel="stylesheet" href="/assets/css/package-details.css" />
                <i className="bi bi-exclamation-triangle-fill text-danger fs-1" />
                <h3 className="mt-3 fw-bold">Package Not Found</h3>
                <p className="text-muted">{error || 'The requested package could not be retrieved.'}</p>
                <Link href="/packages" className="btn btn-success rounded-pill px-4 mt-2">Back to Packages</Link>
            </div>
        );
    }

    const galleryImages = pkg.images?.length ? pkg.images : [pkg.image];

    const quickInfo = [
        pkg.durationText ? { label: 'Duration', val: pkg.durationText, icon: 'bi-clock' } : null,
        pkg.packageType ? { label: 'Type', val: pkg.packageType.replace(/_/g, ' '), icon: 'bi-compass' } : null,
        pkg.location ? { label: 'Destination', val: pkg.location, icon: 'bi-geo-alt' } : null,
        pkg.departureDate ? { label: 'Departure Date', val: pkg.departureDate, icon: 'bi-calendar-event' } : null,
    ].filter(Boolean);

    return (
        <div className="details-wrapper py-4">
            <link rel="stylesheet" href="/assets/css/package-details.css" />
            <div className="container-xl">
                <div className="details-breadcrumb mb-3">
                    <Link href="/">Home</Link> &nbsp;/&nbsp;
                    <Link href="/packages">Tour Packages</Link> &nbsp;/&nbsp;
                    <span className="active">{pkg.title}</span>
                </div>

                <div className="details-header-section mb-4">
                    <div className="details-title-row">
                        <div className="details-title-col">
                            <h1 className="details-title">{pkg.title}</h1>
                            <div className="details-meta-row">
                                <span className="details-price-tag">From {formatCurrency(pkg.price)} / Person</span>
                                <span className="details-meta-item">
                                    <i className="bi bi-geo-alt-fill text-danger" /> {pkg.location}
                                </span>
                                <span className="details-meta-item">
                                    <i className="bi bi-star-fill text-warning" /> {pkg.rating} ({pkg.reviews} Reviews)
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
                    title={pkg.title}
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
                            {pkg.description && (
                                <div className="details-card">
                                    <h2>About This Tour</h2>
                                    <div className="about-tour-text" dangerouslySetInnerHTML={{ __html: pkg.description }} />
                                </div>
                            )}

                            {pkg.tripHighlights.length > 0 && (
                                <div className="details-card">
                                    <h2>Trip Highlights</h2>
                                    <ul className="highlights-list">
                                        {pkg.tripHighlights.map((h, i) => (
                                            <li key={i}>
                                                <i className="bi bi-check-circle-fill" />
                                                <span dangerouslySetInnerHTML={{ __html: h }} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {pkg.amenities.length > 0 && (
                                <div className="details-card">
                                    <h2>Amenities Included</h2>
                                    <div className="amenities-grid">
                                        {pkg.amenities.map((am, i) => (
                                            <div className="amenity-item" key={i}>
                                                <i className={`bi ${getAmenityIcon(am)}`} />
                                                <span>{am}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {pkg.inclusions.length > 0 && (
                                <div className="details-card">
                                    <h2>What&apos;s Included</h2>
                                    <ul className="highlights-list">
                                        {pkg.inclusions.map((item, i) => (
                                            <li key={i}>
                                                <i className="bi bi-check-lg" />
                                                <span dangerouslySetInnerHTML={{ __html: item }} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {pkg.exclusions.length > 0 && (
                                <div className="details-card">
                                    <h2>Not Included</h2>
                                    <ul className="highlights-list highlights-list--muted">
                                        {pkg.exclusions.map((item, i) => (
                                            <li key={i}>
                                                <i className="bi bi-x-circle" />
                                                <span dangerouslySetInnerHTML={{ __html: item }} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {pkg.tourPlan.length > 0 && (
                                <div className="details-card">
                                    <h2>Tour Plan &amp; Itinerary</h2>
                                    <p className="tour-plan-summary">Day-by-day itinerary for your holiday.</p>
                                    <TourPlanAccordion
                                        items={pkg.tourPlan}
                                        openIndex={openDayIndex}
                                        onToggle={setOpenDayIndex}
                                    />
                                </div>
                            )}

                            {pkg.faqs.length > 0 && (
                                <div className="details-card">
                                    <h2>Frequently Asked Questions</h2>
                                    <FaqAccordion
                                        items={pkg.faqs}
                                        openIndex={openFaqIndex}
                                        onToggle={setOpenFaqIndex}
                                    />
                                </div>
                            )}

                            {pkg.mapSrc && (
                                <div className="details-card">
                                    <h2>Location Map</h2>
                                    <div className="map-container-box">
                                        <iframe src={pkg.mapSrc} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Tour location" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <aside className="details-sidebar-col">
                            <div className="details-sidebar-sticky">
                                <StayInquiryForm
                                    packageId={pkg.id}
                                    packageTitle={pkg.title}
                                    enquiryType="package"
                                    title="Book Tour / Send Inquiry"
                                    dateLabel="Travel Date"
                                    submitLabel="Send Inquiry"
                                />
                            </div>
                        </aside>
                    </div>
                </div>

                {related.length > 0 && (
                    <div className="popular-tours-section">
                        <h2>Our Popular Tours</h2>
                        <p>Explore other highly recommended holiday packages.</p>
                        <RelatedCardsSwiper items={related} variant="tour" basePath="/packages" />
                    </div>
                )}
            </div>
        </div>
    );
}
