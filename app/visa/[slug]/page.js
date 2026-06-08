import React from 'react';
import Link from 'next/link';
import VisaInquiryForm from './VisaInquiryForm';
import VisaTypesSwiper from './VisaTypesSwiper';
import PopularPackagesSwiper from './PopularPackagesSwiper';
import RelatedVisasSwiper from './RelatedVisasSwiper';


async function getVisaData(slug) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    try {
        const res = await fetch(`${apiUrl}/api/v1/visa-destinations/${slug}`, {
            cache: 'no-store'
        });
        if (!res.ok) {
            return null;
        }
        return res.json();
    } catch (err) {
        console.error('Error fetching visa details:', err);
        return null;
    }
}

async function getRelatedVisasData() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    try {
        const res = await fetch(`${apiUrl}/api/v1/visa-destinations`, {
            cache: 'no-store'
        });
        if (!res.ok) {
            return null;
        }
        return res.json();
    } catch (err) {
        console.error('Error fetching related visas:', err);
        return null;
    }
}

export default async function VisaDetailPage({ params }) {
    const slug = params?.slug;
    const response = await getVisaData(slug);
    const relatedResponse = await getRelatedVisasData();

    if (!response || !response.success || !response.data) {
        return (
            <div className="container py-5 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <link rel="stylesheet" href="/assets/css/visa-style.css" />
                <h2 style={{ color: '#ef4444', marginBottom: '15px' }}>Oops! Visa Page Not Found</h2>
                <p style={{ color: '#64748b', marginBottom: '25px' }}>The visa details for this country could not be loaded.</p>
                <Link href="/" className="btn btn-primary px-4 py-2" style={{ borderRadius: '8px', backgroundColor: '#2563eb', border: 'none' }}>
                    Back to Home
                </Link>
            </div>
        );
    }

    const visa = response.data;
    const packages = response.packages || [];

    const activeCategory = visa.category || (visa.visa_category === 'e_visa' ? 'e-visa' : (visa.visa_category === 'stamped_visa' ? 'stamped' : 'arrival'));
    
    const relatedVisas = relatedResponse && relatedResponse.success
        ? relatedResponse.destinations.filter(v => v.slug !== slug && v.category === activeCategory)
        : [];

    const getImageUrl = (url) => {
        if (!url) return '/assets/img/grentours_placeholder.png';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        if (url.startsWith('/assets/img/') || url.startsWith('/assets/images/')) {
            return url;
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        return `${apiUrl}${url}`;
    };

    const getCategoryBadgeClass = (category) => {
        switch (category) {
            case 'e-visa':
            case 'e_visa':
                return 'category-badge-evisa';
            case 'stamped':
            case 'stamped_visa':
                return 'category-badge-stamped';
            default:
                return 'category-badge-arrival';
        }
    };

    const getCategoryLabel = (category) => {
        switch (category) {
            case 'e-visa':
            case 'e_visa':
                return 'Electronic Visa (E-Visa)';
            case 'stamped':
            case 'stamped_visa':
                return 'Stamped / Sticker Visa';
            default:
                return 'Visa on Arrival';
        }
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            {/* Import Custom Visa Details Design System */}
            <link rel="stylesheet" href="/assets/css/visa-style.css" />

            {/* Dynamic Skyline Hero Section */}
            <div className="visa-hero" style={{ backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.7)), url(${getImageUrl(visa.image_url)})` }}>
                <div className="visa-hero-container">
                    <span className={`visa-hero-badge ${getCategoryBadgeClass(visa.visa_category || visa.category)}`}>
                        {getCategoryLabel(visa.visa_category || visa.category)}
                    </span>
                    <h1 className="visa-hero-title">{visa.title || `${visa.country_name} Visa`}</h1>
                    <p className="visa-hero-subtitle">
                        {visa.short_description || `Complete step-by-step documentation, guidelines, pricing, and processing options for ${visa.country_name}.`}
                    </p>
                </div>
            </div>

            <div className="visa-detail-layout">
                {/* Left Column — Detailed Content */}
                <div>
                    <Link href="/" className="visa-back-link">
                        <i className="bi bi-arrow-left"></i> Back to Home
                    </Link>

                    {/* Visa Overview Card */}
                    <div className="visa-section-card">
                        <h2 className="visa-section-title">
                            <i className="bi bi-file-earmark-text"></i> Requirements & General Guidelines
                        </h2>
                        <div 
                            className="visa-desc"
                            dangerouslySetInnerHTML={{ 
                                __html: visa.description || `Applying for a visa to ${visa.country_name} is simple and hassle-free. Please check the processing types and requirements below to prepare your application.`
                            }}
                        />
                    </div>

                    {/* Visa Types / Pricing Comparison */}
                    {visa.visa_types && visa.visa_types.length > 0 && (
                        <div className="visa-section-card">
                            <h2 className="visa-section-title">
                                <i className="bi bi-passport"></i> Available Visa Processing Types
                            </h2>
                            <VisaTypesSwiper visaTypes={visa.visa_types} />
                        </div>
                    )}

                    {/* FAQs Native Details/Summary Accordions */}
                    {visa.faqs && visa.faqs.length > 0 && (
                        <div className="visa-section-card">
                            <h2 className="visa-section-title">
                                <i className="bi bi-question-circle"></i> Frequently Asked Questions
                            </h2>
                            <div className="faq-list">
                                {visa.faqs.map((faq, idx) => (
                                    <details className="faq-item" key={idx}>
                                        <summary className="faq-header">
                                            <span>{faq.question}</span>
                                            <i className="bi bi-chevron-down faq-icon-arrow"></i>
                                        </summary>
                                        <div className="faq-content">
                                            <p style={{ margin: 0 }}>{faq.answer}</p>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column — Sticky Inquiry Widget */}
                <div>
                    <div className="visa-inquiry-widget">
                        <h3 className="widget-title">Apply / Inquire Now</h3>
                        <p className="widget-desc">Speak with our certified visa consultants to get your visa processed seamlessly.</p>
                        
                        {/* Render Client-Side Form Component */}
                        <VisaInquiryForm countryName={visa.country_name} />

                        <div className="visa-trust-list mt-4">
                            <div className="trust-item d-flex align-items-center gap-2 mb-2">
                                <span className="trust-icon"><i className="bi bi-shield-check text-success"></i></span>
                                <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>99.2% Visa Approval Rate</span>
                            </div>
                            <div className="trust-item d-flex align-items-center gap-2 mb-2">
                                <span className="trust-icon"><i className="bi bi-person-check text-success"></i></span>
                                <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>Dedicated Personal Visa Specialist</span>
                            </div>
                            <div className="trust-item d-flex align-items-center gap-2">
                                <span className="trust-icon"><i className="bi bi-wallet2 text-success"></i></span>
                                <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>Transparent Pricing & Zero Hidden Fees</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popular Holiday Packages for Country */}
            {packages && packages.length > 0 && (
                <div className="visa-packages-section container py-5">
                    <div className="ft-section-header mb-4 text-center">
                        <h2 className="font-weight-bold" style={{ color: '#0f172a', fontSize: '1.75rem' }}>Popular Holiday Packages for {visa.country_name}</h2>
                        <p className="text-muted">Handpicked itineraries and premium hotels curated just for you.</p>
                    </div>
                    
                    <PopularPackagesSwiper packages={packages} />
                </div>
            )}

            {/* Related Visa Destinations with Same Tag */}
            {relatedVisas && relatedVisas.length > 0 && (
                <div className="visa-packages-section container py-5 pt-0">
                    <div className="ft-section-header mb-4 text-center">
                        <h2 className="font-weight-bold" style={{ color: '#0f172a', fontSize: '1.75rem' }}>
                            Other {activeCategory === 'e-visa' ? 'E-Visa' : (activeCategory === 'stamped' ? 'Stamped Visa' : 'Visa on Arrival')} Destinations
                        </h2>
                        <p className="text-muted">Explore more countries with similar visa processing requirements.</p>
                    </div>

                    <RelatedVisasSwiper relatedVisas={relatedVisas} />
                </div>
            )}
        </div>
    );
}
