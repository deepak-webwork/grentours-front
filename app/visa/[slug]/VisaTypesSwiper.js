'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';



export default function VisaTypesSwiper({ visaTypes }) {
    if (!visaTypes || visaTypes.length === 0) return null;

    const slideCount = visaTypes.length;

    // Define breakpoints dynamically based on actual count of visa types to avoid giant gaps
    const getBreakpoints = () => {
        if (slideCount === 1) {
            return {
                0: { slidesPerView: 1, spaceBetween: 16 }
            };
        }
        return {
            0: { slidesPerView: 1, spaceBetween: 16 },
            576: { slidesPerView: 1.5, spaceBetween: 16 },
            992: { slidesPerView: 2, spaceBetween: 20 }
        };
    };

    return (
        <div className="vt-swiper-container">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                }}
                pagination={{ 
                    clickable: true,
                    el: '.swiper-pagination-custom'
                }}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                }}
                breakpoints={getBreakpoints()}
                className="vt-swiper"
            >
                {visaTypes.map((vt, idx) => {
                    const nameLower = vt.name?.toLowerCase() || '';
                    const timeLower = vt.processing_time?.toLowerCase() || '';

                    const isExpress = nameLower.includes('express') || 
                                      nameLower.includes('urgent') || 
                                      nameLower.includes('fast') ||
                                      nameLower.includes('priority') ||
                                      nameLower.includes('quick') ||
                                      timeLower.includes('hour') ||
                                      timeLower.includes('1 day') ||
                                      timeLower.includes('2 days') ||
                                      timeLower.includes('1 working day') ||
                                      timeLower.includes('2 working days');


                    return (
                        <SwiperSlide key={idx} style={{ height: 'auto' }}>
                            <div className="vt-card" style={{ height: '100%', margin: 0 }}>
                                <div className="vt-card-header">
                                    <h3 className="vt-card-name">{vt.name}</h3>
                                    {isExpress ? (
                                        <span className="vt-badge vt-badge-express">
                                            <i className="bi bi-lightning-charge-fill"></i> Fast Track
                                        </span>
                                    ) : (
                                        <span className="vt-badge vt-badge-standard">
                                            <i className="bi bi-clock-fill"></i> Standard
                                        </span>
                                    )}
                                </div>

                                <div className="vt-card-price-section">
                                    <div className="vt-card-price-label">Visa Fee</div>
                                    <div className="vt-card-price">
                                        <span className="currency">₹</span>
                                        <span className="amount">{vt.price ? parseInt(vt.price).toLocaleString('en-IN') : 'N/A'}</span>
                                        <span className="per-applicant">/ applicant</span>
                                    </div>
                                </div>

                                <div className="vt-meta-list">
                                    <div className="vt-meta-item">
                                        <div className="vt-meta-left">
                                            <i className="bi bi-clock-history vt-meta-icon"></i>
                                            <span className="vt-meta-lbl">Processing Time</span>
                                        </div>
                                        <span className="vt-meta-val">{vt.processing_time || 'N/A'}</span>
                                    </div>
                                    <div className="vt-meta-item">
                                        <div className="vt-meta-left">
                                            <i className="bi bi-signpost-split vt-meta-icon"></i>
                                            <span className="vt-meta-lbl">Entry Type</span>
                                        </div>
                                        <span className="vt-meta-val">{vt.entry_type || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}

                {/* Custom Navigation Controls inside Swiper */}
                {visaTypes.length > 1 && (
                    <div className="swiper-controls-wrap">
                        <button className="swiper-nav-btn swiper-button-prev-custom" aria-label="Previous slide">
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        <div className="swiper-pagination-custom"></div>
                        <button className="swiper-nav-btn swiper-button-next-custom" aria-label="Next slide">
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                )}
            </Swiper>
        </div>
    );
}

