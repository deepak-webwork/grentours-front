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

export default function RelatedVisasSwiper({ relatedVisas }) {
    if (!relatedVisas || relatedVisas.length === 0) return null;

    const getVisaCategoryLabel = (category) => {
        switch (category) {
            case 'e-visa':
            case 'e_visa':
                return 'E-Visa';
            case 'stamped':
            case 'stamped_visa':
                return 'Stamped Visa';
            default:
                return 'Visa on Arrival';
        }
    };

    return (
        <div className="vt-swiper-container mt-4">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                navigation={{
                    nextEl: '.rel-swiper-next',
                    prevEl: '.rel-swiper-prev',
                }}
                pagination={{ 
                    clickable: true,
                    el: '.rel-swiper-pagination'
                }}
                autoplay={{
                    delay: 4500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                }}
                breakpoints={{
                    0: { slidesPerView: 1.5, spaceBetween: 16 },
                    576: { slidesPerView: 2.5, spaceBetween: 20 },
                    992: { slidesPerView: 4, spaceBetween: 24 }
                }}
                className="vt-swiper"
            >
                {relatedVisas.map((visa, idx) => (
                    <SwiperSlide key={idx} style={{ height: 'auto', display: 'flex' }}>
                        <Link href={`/visa/${visa.slug}`} className="visa-card text-decoration-none" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', margin: 0 }}>
                            <div className="visa-card-img" style={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
                                <img src={getImageUrl(visa.img)} alt={visa.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <span className="vt-badge" style={{
                                    position: 'absolute',
                                    top: '12px',
                                    left: '12px',
                                    zIndex: 2,
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    padding: '4px 10px',
                                    borderRadius: '20px',
                                    color: '#ffffff',
                                    background: visa.category === 'e-visa' ? '#10b981' : (visa.category === 'stamped' ? '#f59e0b' : '#3b82f6'),
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    {getVisaCategoryLabel(visa.category)}
                                </span>
                            </div>
                            <div className="visa-card-info" style={{ flexShrink: 0 }}>
                                <p className="visa-card-name" style={{ marginBottom: '4px', fontWeight: '600' }}>{visa.name}</p>
                                <p className="visa-card-count" style={{ color: '#059669', fontWeight: '500' }}><i className="bi bi-compass"></i> {visa.count}</p>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}

                {/* Custom Unique Navigation Controls */}
                {relatedVisas.length > 1 && (
                    <div className="swiper-controls-wrap">
                        <button className="swiper-nav-btn rel-swiper-prev" aria-label="Previous slide">
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        <div className="swiper-pagination-custom rel-swiper-pagination"></div>
                        <button className="swiper-nav-btn rel-swiper-next" aria-label="Next slide">
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                )}
            </Swiper>
        </div>
    );
}
