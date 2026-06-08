'use client';

import React from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

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

export default function PopularPackagesSwiper({ packages }) {
    if (!packages || packages.length === 0) return null;

    return (
        <div className="vt-swiper-container mt-4">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                navigation={{
                    nextEl: '.pkg-swiper-next',
                    prevEl: '.pkg-swiper-prev',
                }}
                pagination={{ 
                    clickable: true,
                    el: '.pkg-swiper-pagination'
                }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                }}
                breakpoints={{
                    0: { slidesPerView: 1, spaceBetween: 16 },
                    576: { slidesPerView: 2, spaceBetween: 20 },
                    992: { slidesPerView: 3, spaceBetween: 24 }
                }}
                className="vt-swiper"
            >
                {packages.map((pkg) => (
                    <SwiperSlide key={pkg.id} style={{ height: 'auto', display: 'flex' }}>
                        <div className="ft-pkg-card" style={{ height: '100%', margin: 0, display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <div className="ft-pkg-card-img">
                                <img src={getImageUrl(pkg.image)} alt={pkg.title} />
                                <div className="ft-pkg-badge-wrap">
                                    {pkg.tags && pkg.tags.map(tag => (
                                        <span key={tag.id} className={`ft-pkg-badge ${tag.color || 'red'}`}>
                                            {tag.name}
                                        </span>
                                    ))}
                                    <span className="ft-pkg-badge blue">{pkg.duration_nights} Nights</span>
                                </div>
                            </div>
                            <div className="ft-pkg-card-body" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                                <div>
                                    <div className="ft-pkg-card-title">{pkg.title}</div>
                                    <div className="ft-pkg-meta">
                                        <span className="ft-pkg-meta-item"><i className="bi bi-geo-alt"></i> {pkg.location}</span>
                                        <span className="ft-pkg-meta-item"><i className="bi bi-moon-stars"></i> {pkg.duration_nights}N / {pkg.duration_days}D</span>
                                        <span className="ft-pkg-meta-item"><i className="bi bi-people"></i> Group</span>
                                    </div>
                                </div>
                                <div className="ft-pkg-card-footer">
                                    <div>
                                        <div className="ft-pkg-price-label">Starting From</div>
                                        <div className="ft-pkg-price">₹ {pkg.price ? pkg.price.toLocaleString('en-IN') : 'N/A'} <span>/ person</span></div>
                                    </div>
                                    <Link href={`/packages/${pkg.slug || pkg.id}`} className="ft-view-btn text-decoration-none text-center d-flex align-items-center justify-content-center">
                                        view details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                {/* Custom Unique Navigation Controls */}
                {packages.length > 1 && (
                    <div className="swiper-controls-wrap">
                        <button className="swiper-nav-btn pkg-swiper-prev" aria-label="Previous slide">
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        <div className="swiper-pagination-custom pkg-swiper-pagination"></div>
                        <button className="swiper-nav-btn pkg-swiper-next" aria-label="Next slide">
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                )}
            </Swiper>
        </div>
    );
}
