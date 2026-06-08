'use client';

import React from 'react';
import Link from 'next/link';

function NavIcon({ name }) {
    return (
        <span className="ft-nav-icon-wrap">
            <i className={`bi ${name} ft-nav-icon`} />
        </span>
    );
}

export default function HeaderNavMenu({ navigationData, activeMobileMenu, toggleMobileSubmenu, onLinkClick }) {
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
                    <li className="tour-dropdown-item type-spiritual">
                        <Link href="/packages?theme=spiritual" onClick={onLinkClick}>
                            <i className="bi bi-brightness-high" />
                            <div className="dropdown-item-details">
                                <span className="item-title">Chardham Yatra</span>
                                <span className="item-desc">Spiritual Pilgrimage</span>
                            </div>
                            <span className="dropdown-tour-badge badge-spiritual">Spiritual</span>
                        </Link>
                    </li>
                    <li className="tour-dropdown-item type-bestseller">
                        <Link href="/packages?theme=bestseller" onClick={onLinkClick}>
                            <i className="bi bi-star-fill" />
                            <div className="dropdown-item-details">
                                <span className="item-title">Super Seller Packages</span>
                                <span className="item-desc">Top Rated Vacations</span>
                            </div>
                            <span className="dropdown-tour-badge badge-bestseller-blue">Bestseller</span>
                        </Link>
                    </li>
                    <li className="tour-dropdown-item type-summer">
                        <Link href="/packages?theme=summer" onClick={onLinkClick}>
                            <i className="bi bi-sun-fill" />
                            <div className="dropdown-item-details">
                                <span className="item-title">Summer Special Tours</span>
                                <span className="item-desc">Beat the heat</span>
                            </div>
                            <span className="dropdown-tour-badge badge-summer">Summer</span>
                        </Link>
                    </li>
                    <li className="tour-dropdown-item type-honeymoon">
                        <Link href="/packages?theme=honeymoon" onClick={onLinkClick}>
                            <i className="bi bi-heart-fill" />
                            <div className="dropdown-item-details">
                                <span className="item-title">Honeymoon Specials</span>
                                <span className="item-desc">Romantic Getaways</span>
                            </div>
                            <span className="dropdown-tour-badge badge-honeymoon">Romantic</span>
                        </Link>
                    </li>
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
