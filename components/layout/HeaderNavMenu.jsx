'use client';

import React from 'react';
import Link from 'next/link';

const THEME_STYLES_MAP = {
    'honeymoon': {
        icon: 'bi-heart-fill',
        desc: 'Romantic Getaways',
        badgeClass: 'badge-honeymoon',
        badgeText: 'Romantic',
        itemClass: 'type-honeymoon'
    },
    'adventure': {
        icon: 'bi-compass',
        desc: 'Thrilling Journeys',
        badgeClass: 'badge-summer',
        badgeText: 'Adventure',
        itemClass: 'type-summer'
    },
    'luxury-stay': {
        icon: 'bi-star-fill',
        desc: 'Top Rated Vacations',
        badgeClass: 'badge-bestseller-blue',
        badgeText: 'Luxury',
        itemClass: 'type-bestseller'
    },
    'spiritual': {
        icon: 'bi-brightness-high',
        desc: 'Spiritual Pilgrimage',
        badgeClass: 'badge-spiritual',
        badgeText: 'Spiritual',
        itemClass: 'type-spiritual'
    },
    'bestseller': {
        icon: 'bi-star-fill',
        desc: 'Top Rated Vacations',
        badgeClass: 'badge-bestseller-blue',
        badgeText: 'Bestseller',
        itemClass: 'type-bestseller'
    },
    'summer': {
        icon: 'bi-sun-fill',
        desc: 'Beat the heat',
        badgeClass: 'badge-summer',
        badgeText: 'Summer',
        itemClass: 'type-summer'
    }
};

const getThemeStyles = (theme) => {
    const slug = theme.slug || '';
    if (THEME_STYLES_MAP[slug]) {
        return THEME_STYLES_MAP[slug];
    }
    return {
        icon: 'bi-umbrella-fill',
        desc: 'Special Curated Tour',
        badgeClass: 'badge-summer',
        badgeText: theme.name,
        itemClass: 'type-summer'
    };
};

function NavIcon({ name }) {
    return (
        <span className="ft-nav-icon-wrap">
            <i className={`bi ${name} ft-nav-icon`} />
        </span>
    );
}

export default function HeaderNavMenu({ navigationData, themesData, activeMobileMenu, toggleMobileSubmenu, onLinkClick }) {
    const isMobile = Boolean(toggleMobileSubmenu);

    return (
        <>
            <li className={`ft-nav-li has-mega ${activeMobileMenu === 'packages' ? 'active-mobile' : ''}`}>
                <span className="ft-nav-link" onClick={() => toggleMobileSubmenu?.('packages')} role="button" tabIndex={0}>
                    <NavIcon name="bi-briefcase" />
                    <span className="ft-nav-text">Holiday Packages</span>
                    <i className="bi bi-chevron-down ft-nav-arrow" />
                </span>
                <div className="ft-mega-menu" style={activeMobileMenu === 'packages' ? { display: 'block' } : {}}>
                    <div className="ft-mega-grid-dynamic">
                        {navigationData?.length > 0 ? (
                            navigationData.map((continent) => (
                                <div key={continent.id} className="ft-mega-col-dynamic">
                                    <div className="ft-mega-section">
                                        <h5 className="ft-mega-title-dynamic">
                                            <Link href={`/packages?q=${encodeURIComponent(continent.name)}`} onClick={onLinkClick}>
                                                <i className="bi bi-globe" /> {continent.name}
                                            </Link>
                                        </h5>
                                        <ul className="ft-mega-list-dynamic">
                                            {continent.countries.map((country) => (
                                                <li key={country.id} className="nav-country-item">
                                                    <div className="nav-country-header">
                                                        <Link href={`/packages?q=${encodeURIComponent(country.name)}`} className="nav-country-link" onClick={onLinkClick}>
                                                            <i className="bi bi-geo-alt-fill text-muted me-1" />
                                                            {country.name}
                                                        </Link>
                                                    </div>
                                                    {country.states?.length > 0 && (
                                                        <ul className="nav-state-list">
                                                            {country.states.map((state) => (
                                                                <li key={state.id} className="nav-state-item">
                                                                    <Link href={`/packages?q=${encodeURIComponent(state.name)}`} className="nav-state-link" onClick={onLinkClick}>
                                                                        <i className="bi bi-arrow-right-short text-muted" />
                                                                        {state.name}
                                                                    </Link>
                                                                    {state.cities?.length > 0 && (
                                                                        <ul className="nav-city-list">
                                                                            {state.cities.map((city) => (
                                                                                <li key={city.id} className="nav-city-item">
                                                                                    <Link href={`/packages?q=${encodeURIComponent(city.name)}`} className="nav-city-link" onClick={onLinkClick}>
                                                                                        {city.name}
                                                                                    </Link>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    )}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                    {(!country.states || country.states.length === 0) && country.cities?.length > 0 && (
                                                        <ul className="nav-city-list">
                                                            {country.cities.map((city) => (
                                                                <li key={city.id} className="nav-city-item">
                                                                    <Link href={`/packages?q=${encodeURIComponent(city.name)}`} className="nav-city-link" onClick={onLinkClick}>
                                                                        {city.name}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-muted p-3">Loading destinations...</div>
                        )}
                    </div>
                </div>
            </li>

            <li className={`ft-nav-li has-dropdown ${activeMobileMenu === 'themes' ? 'active-mobile' : ''}`}>
                <span className="ft-nav-link" onClick={() => toggleMobileSubmenu?.('themes')} role="button" tabIndex={0}>
                    <NavIcon name="bi-umbrella" />
                    <span className="ft-nav-text">Theme Tours</span>
                    <i className="bi bi-chevron-down ft-nav-arrow" />
                </span>
                <ul className="ft-dropdown-menu tour-themed-dropdown" style={activeMobileMenu === 'themes' ? { display: 'block' } : {}}>
                    {themesData && themesData.length > 0 ? (
                        themesData.map((theme) => {
                            const styles = getThemeStyles(theme);
                            return (
                                <li key={theme.id} className={`tour-dropdown-item ${styles.itemClass}`}>
                                    <Link href={`/packages?theme=${theme.slug}`} onClick={onLinkClick}>
                                        <i className={`bi ${styles.icon}`} />
                                        <div className="dropdown-item-details">
                                            <span className="item-title">{theme.name}</span>
                                            <span className="item-desc">{styles.desc}</span>
                                        </div>
                                        <span className={`dropdown-tour-badge ${styles.badgeClass}`}>{styles.badgeText}</span>
                                    </Link>
                                </li>
                            );
                        })
                    ) : (
                        <li className="p-3 text-muted text-center" style={{ fontSize: '12px' }}>Loading themes...</li>
                    )}
                </ul>
            </li>

            <li className="ft-nav-li">
                <Link href="/hotels" className="ft-nav-link" onClick={onLinkClick}>
                    <NavIcon name="bi-building" />
                    <span className="ft-nav-text">Hotels & Resorts</span>
                    {isMobile && <i className="bi bi-chevron-right ft-nav-arrow ft-nav-arrow--link" />}
                </Link>
            </li>
            <li className="ft-nav-li">
                <Link href="/flights" className="ft-nav-link" onClick={onLinkClick}>
                    <NavIcon name="bi-airplane-fill" />
                    <span className="ft-nav-text">Flights</span>
                    {isMobile && <i className="bi bi-chevron-right ft-nav-arrow ft-nav-arrow--link" />}
                </Link>
            </li>
            <li className="ft-nav-li">
                <Link href="/visa" className="ft-nav-link" onClick={onLinkClick}>
                    <NavIcon name="bi-passport" />
                    <span className="ft-nav-text">Visas</span>
                    {isMobile && <i className="bi bi-chevron-right ft-nav-arrow ft-nav-arrow--link" />}
                </Link>
            </li>
            <li className="ft-nav-li">
                <Link href="/blogs" className="ft-nav-link" onClick={onLinkClick}>
                    <NavIcon name="bi-journal-text" />
                    <span className="ft-nav-text">Blogs</span>
                    {isMobile && <i className="bi bi-chevron-right ft-nav-arrow ft-nav-arrow--link" />}
                </Link>
            </li>
        </>
    );
}
