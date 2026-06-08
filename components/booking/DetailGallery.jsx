'use client';

import React from 'react';

export default function DetailGallery({ images, title, activeIndex, onSelect }) {
    const galleryImages = images?.length ? images : [];

    if (!galleryImages.length) return null;

    const slide = (direction) => {
        const next = direction === 'next'
            ? (activeIndex + 1) % galleryImages.length
            : (activeIndex - 1 + galleryImages.length) % galleryImages.length;
        onSelect(next);
    };

    return (
        <div className="gallery-container mb-4">
            <div className="gallery-main-frame">
                {galleryImages.length > 1 && (
                    <>
                        <button type="button" className="gallery-nav-arrow gallery-nav-prev" onClick={() => slide('prev')} aria-label="Previous image">
                            <i className="bi bi-chevron-left" />
                        </button>
                        <button type="button" className="gallery-nav-arrow gallery-nav-next" onClick={() => slide('next')} aria-label="Next image">
                            <i className="bi bi-chevron-right" />
                        </button>
                    </>
                )}
                <img
                    src={galleryImages[activeIndex]}
                    alt={`${title} — photo ${activeIndex + 1}`}
                    onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }}
                />
                <span className="gallery-counter">
                    {activeIndex + 1} / {galleryImages.length}
                </span>
            </div>

            <div className="gallery-thumbs-row">
                {galleryImages.map((imgUrl, idx) => (
                    <button
                        key={idx}
                        type="button"
                        className={`gallery-thumb-item ${idx === activeIndex ? 'active' : ''}`}
                        onClick={() => onSelect(idx)}
                        aria-label={`View image ${idx + 1}`}
                        aria-current={idx === activeIndex ? 'true' : undefined}
                    >
                        <img
                            src={imgUrl}
                            alt=""
                            onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
