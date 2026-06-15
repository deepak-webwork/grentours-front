'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchModal from '../search/SearchModal';
import HeaderNavMenu from './HeaderNavMenu';

export default function Header() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [activeMobileMenu, setActiveMobileMenu] = useState(null);
    const [navigationData, setNavigationData] = useState([]);

    useEffect(() => {
        if (isMobileOpen) {
            document.body.style.overflow = 'hidden';
        } else if (!searchOpen) {
            document.body.style.overflow = '';
        }
        return () => {
            if (!searchOpen) document.body.style.overflow = '';
        };
    }, [isMobileOpen, searchOpen]);

    useEffect(() => {
        const onKey = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
        const fetchNavigation = async () => {
            try {
                const CACHE_KEY = 'grentours_navigation_data';
                const CACHE_EXPIRY_KEY = 'grentours_navigation_expiry';
                const CACHE_TTL = 300000;
                const cachedData = localStorage.getItem(CACHE_KEY);
                const cachedExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);
                const now = Date.now();
                if (cachedData && cachedExpiry && now < parseInt(cachedExpiry, 10)) {
                    setNavigationData(JSON.parse(cachedData));
                    return;
                }
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
                const res = await fetch(`${apiUrl}/api/v1/navigation`);
                if (!res.ok) throw new Error('Failed to fetch navigation');
                const resData = await res.json();
                if (resData.success) {
                    setNavigationData(resData.data);
                    localStorage.setItem(CACHE_KEY, JSON.stringify(resData.data));
                    localStorage.setItem(CACHE_EXPIRY_KEY, (now + CACHE_TTL).toString());
                }
            } catch (err) {
                console.error('Error fetching navigation data:', err);
            }
        };
        fetchNavigation();
    }, []);

    const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);
    const closeMobile = () => setIsMobileOpen(false);
    const toggleMobileSubmenu = (menuKey) => {
        setActiveMobileMenu(activeMobileMenu === menuKey ? null : menuKey);
    };

    const openSearchFromDrawer = () => {
        closeMobile();
        setSearchOpen(true);
    };

    const openQuoteFromDrawer = () => {
        closeMobile();
        window.dispatchEvent(new CustomEvent('open-enquiry-modal'));
    };

    return (
        <>
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

            <header className="ft-header-double">
                <div className={`ft-nav-overlay ${isMobileOpen ? 'is-open' : ''}`} onClick={toggleMobileMenu} />

                <div className="ft-header-unified">
                    <div className="container-xl">
                        <div className="ft-header-main-wrap">
                            <Link href="/" className="ft-logo ft-logo-brand">
                                <img
                                    className="ft-logo-main"
                                    src="/assets/img/logo.png"
                                    alt="Grentours Logo"
                                    onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }}
                                />
                                <img
                                    src="/assets/img/iata-logo-high-quality-free-vector.jpg"
                                    alt="IATA Accredited"
                                    className="ft-iata-logo"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            </Link>

                            <nav className="ft-header-nav-desktop" aria-label="Main navigation">
                                <ul className="ft-nav ft-nav-list ft-nav-list--desktop mb-0">
                                    <HeaderNavMenu
                                        navigationData={navigationData}
                                        activeMobileMenu={null}
                                        toggleMobileSubmenu={undefined}
                                    />
                                </ul>
                            </nav>

                            <div className="ft-header-actions">
                                <button
                                    type="button"
                                    className="ft-header-search-btn"
                                    onClick={() => setSearchOpen(true)}
                                    aria-label="Open search"
                                    title="Search (Ctrl+K)"
                                >
                                    <i className="bi bi-search" />
                                </button>
                                <button type="button" className="ft-mobile-btn" onClick={toggleMobileMenu} aria-label="Menu">
                                    <i className={`bi ${isMobileOpen ? 'bi-x' : 'bi-list'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <nav className={`ft-mobile-drawer ${isMobileOpen ? 'is-open' : ''}`} aria-label="Mobile navigation" aria-hidden={!isMobileOpen}>
                    <div className="ft-drawer-header">
                        <div className="ft-drawer-brand">
                            <img src="/assets/img/logo.png" alt="Grentours" onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} />
                            <span>Where will you go next?</span>
                        </div>
                        <button type="button" className="ft-drawer-close" onClick={toggleMobileMenu} aria-label="Close Menu">
                            <i className="bi bi-x-lg" />
                        </button>
                    </div>

                    <button type="button" className="ft-drawer-search-btn" onClick={openSearchFromDrawer}>
                        <i className="bi bi-search" />
                        <span>Search tours, hotels, destinations...</span>
                    </button>

                    <ul className="ft-drawer-nav-list mb-0">
                        <HeaderNavMenu
                            navigationData={navigationData}
                            activeMobileMenu={activeMobileMenu}
                            toggleMobileSubmenu={toggleMobileSubmenu}
                            onLinkClick={closeMobile}
                        />
                    </ul>

                    <div className="ft-drawer-footer">
                        <button type="button" className="ft-drawer-quote-btn" onClick={openQuoteFromDrawer}>
                            <i className="bi bi-send-fill" />
                            Get Free Travel Quote
                        </button>
                    </div>
                </nav>
            </header>
        </>
    );
}
