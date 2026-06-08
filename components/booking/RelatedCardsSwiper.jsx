'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FtTourCard, FtHotelCard } from '../cards/FtPackageCard';

export default function RelatedCardsSwiper({ items, variant = 'tour', basePath = '/packages' }) {
    if (!items?.length) return null;

    const prefix = variant === 'hotel' ? 'hotel' : 'pkg';

    return (
        <div className="detail-related-swiper">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                navigation={{
                    nextEl: `.${prefix}-related-next`,
                    prevEl: `.${prefix}-related-prev`,
                }}
                pagination={{
                    clickable: true,
                    el: `.${prefix}-related-pagination`,
                }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                breakpoints={{
                    0: { slidesPerView: 1, spaceBetween: 14 },
                    576: { slidesPerView: 2, spaceBetween: 16 },
                    992: { slidesPerView: 3, spaceBetween: 20 },
                }}
                className="detail-related-swiper__track"
            >
                {items.map((item) => {
                    const slug = item.slug || item.id;
                    const href = `${basePath}/${slug}`;
                    return (
                        <SwiperSlide key={item.id} style={{ height: 'auto', display: 'flex' }}>
                            <div className="detail-related-slide">
                                {variant === 'hotel' ? (
                                    <FtHotelCard item={item} href={href} />
                                ) : (
                                    <FtTourCard item={item} href={href} />
                                )}
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {items.length > 1 && (
                <div className="detail-related-controls">
                    <button type="button" className={`detail-related-nav ${prefix}-related-prev`} aria-label="Previous">
                        <i className="bi bi-chevron-left" />
                    </button>
                    <div className={`detail-related-pagination ${prefix}-related-pagination`} />
                    <button type="button" className={`detail-related-nav ${prefix}-related-next`} aria-label="Next">
                        <i className="bi bi-chevron-right" />
                    </button>
                </div>
            )}
        </div>
    );
}
