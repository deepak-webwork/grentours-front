'use client';

import React from 'react';
import Link from 'next/link';
import { getImageUrl } from '../../lib/packageDetail';

function formatPrice(amount) {
    return `₹ ${(amount || 0).toLocaleString('en-IN')}`;
}

export function FtTourCard({ item, href }) {
    const image = getImageUrl(item.image);
    const location = item.location || 'Explore';
    const nights = item.duration_nights ?? item.durationNights;
    const days = item.duration_days ?? item.durationDays ?? item.duration;

    return (
        <div className="ft-pkg-card">
            <div className="ft-pkg-card-img">
                <img src={image} alt={item.title} onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} />
                <div className="ft-pkg-badge-wrap">
                    {item.tags?.map((tag) => (
                        <span key={tag.id} className={`ft-pkg-badge ${tag.color || 'red'}`}>{tag.name}</span>
                    ))}
                    {nights != null && <span className="ft-pkg-badge blue">{nights} Nights</span>}
                </div>
            </div>
            <div className="ft-pkg-card-body">
                <div className="ft-pkg-card-title">{item.title}</div>
                <div className="ft-pkg-meta">
                    <span className="ft-pkg-meta-item"><i className="bi bi-geo-alt" /> {location}</span>
                    {(nights != null || days != null) && (
                        <span className="ft-pkg-meta-item">
                            <i className="bi bi-moon-stars" /> {nights ?? '?'}N / {days ?? '?'}D
                        </span>
                    )}
                </div>
                <div className="ft-pkg-card-footer">
                    <div>
                        <div className="ft-pkg-price-label">Starting From</div>
                        <div className="ft-pkg-price">
                            {formatPrice(item.price ?? item.starting_price)} <span>/ person</span>
                        </div>
                    </div>
                    <Link href={href} className="ft-view-btn text-decoration-none text-center d-flex align-items-center justify-content-center">
                        view details
                    </Link>
                </div>
            </div>
        </div>
    );
}

export function FtHotelCard({ item, href }) {
    const image = getImageUrl(item.image);
    const location = item.location || 'Explore';
    const tagLabel = item.tags?.[0]?.name || (item.stars ? `${item.stars} Star` : 'Hotel');

    return (
        <div className="ft-pkg-card">
            <div className="ft-pkg-card-img">
                <img src={image} alt={item.title} onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} />
                <div className="ft-pkg-badge-wrap">
                    {item.tags?.map((tag) => (
                        <span key={tag.id} className={`ft-pkg-badge ${tag.color || 'red'}`}>{tag.name}</span>
                    ))}
                </div>
            </div>
            <div className="ft-pkg-card-body">
                <div className="ft-pkg-card-title">{item.title}</div>
                <div className="ft-pkg-meta">
                    <span className="ft-pkg-meta-item"><i className="bi bi-geo-alt" /> {location}</span>
                    <span className="ft-pkg-meta-item">
                        <i className="bi bi-star-fill" style={{ color: '#f59e0b' }} /> {tagLabel}
                    </span>
                </div>
                <div className="ft-pkg-card-footer">
                    <div>
                        <div className="ft-pkg-price-label">Per Night</div>
                        <div className="ft-pkg-price">{formatPrice(item.price ?? item.starting_price)}</div>
                    </div>
                    <Link href={href} className="ft-view-btn text-decoration-none text-center d-flex align-items-center justify-content-center">
                        view details
                    </Link>
                </div>
            </div>
        </div>
    );
}
