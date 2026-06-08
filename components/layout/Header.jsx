'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Header() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [activeMobileMenu, setActiveMobileMenu] = useState(null); // 'packages' or 'themes' or 'guide'

    useEffect(() => {
        if (isMobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileOpen]);

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') {
            router.push(`/packages?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    const toggleMobileSubmenu = (menuKey) => {
        setActiveMobileMenu(activeMobileMenu === menuKey ? null : menuKey);
    };

    return (
        <header className="ft-header-double">
            {/* Dark Overlay for Mobile Navigation */}
            <div className={`ft-nav-overlay ${isMobileOpen ? 'is-open' : ''}`} onClick={toggleMobileMenu}></div>

            {/* TOP HEADER: Logo & Search Bar */}
            <div className="ft-header-top">
                <div className="container-xl">
                    <div className="ft-header-top-wrap">
                        {/* Logo */}
                        <Link href="/" className="ft-logo">
                            <img src="/assets/img/logo.png" alt="Grentours Logo" onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} />
                        </Link>

                        {/* Integrated Header Search Bar */}
                        <div className="ft-header-search">
                            <div className="ft-search-box">
                                <i className="bi bi-search"></i>
                                <input 
                                    type="text" 
                                    placeholder="Search City, Country, Tours..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearchSubmit}
                                />
                            </div>
                        </div>



                        {/* Mobile Hamburger Menu Button */}
                        <button className="ft-mobile-btn" onClick={toggleMobileMenu}>
                            <i className={`bi ${isMobileOpen ? 'bi-x' : 'bi-list'}`}></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* BOTTOM NAVBAR: Navigation List */}
            <nav className="ft-navbar-bottom">
                <div className="container-xl">
                    <div className="ft-navbar-bottom-wrap">
                        <ul className={`ft-nav ft-nav-list mb-0 ${isMobileOpen ? 'is-open' : ''}`}>
                            {/* Mobile Drawer Header */}
                            <li className="ft-drawer-header">
                                <span className="ft-drawer-title">Menu</span>
                                <button className="ft-drawer-close" onClick={toggleMobileMenu} aria-label="Close Menu">
                                    <i className="bi bi-x"></i>
                                </button>
                            </li>
                            {/* Holiday Packages with Mega Menu */}
                            <li className={`ft-nav-li has-mega ${activeMobileMenu === 'packages' ? 'active-mobile' : ''}`}>
                                <span className="ft-nav-link" onClick={() => toggleMobileSubmenu('packages')}>
                                    <i className="bi bi-briefcase ft-nav-icon"></i>
                                    <span className="ft-nav-text">Holiday Packages</span>
                                    <i className="bi bi-chevron-down ft-nav-arrow"></i>
                                </span>
                                
                                {/* Mega Menu */}
                                <div className="ft-mega-menu" style={activeMobileMenu === 'packages' ? { display: 'block' } : {}}>
                                    <div className="ft-mega-grid">
                                        {/* India Column */}
                                        <div className="ft-mega-col span-2">
                                            <div className="ft-mega-section">
                                                <h5 className="ft-mega-title"><i className="bi bi-geo-alt"></i> India</h5>
                                                <ul className="ft-mega-list multi-col">
                                                    <li><Link href="/packages?theme=all">Goa</Link></li>
                                                    <li><Link href="/packages?theme=all">Kerala</Link></li>
                                                    <li><Link href="/packages?theme=all">Bhutan</Link></li>
                                                    <li><Link href="/packages?theme=all">Gujarat</Link></li>
                                                    <li><Link href="/packages?theme=all">Leh</Link></li>
                                                    <li><Link href="/packages?theme=all">Himachal</Link></li>
                                                    <li><Link href="/packages?theme=all">Uttarakhand</Link></li>
                                                    <li><Link href="/packages?theme=all">Rajasthan</Link></li>
                                                    <li><Link href="/packages?theme=all">Nepal</Link></li>
                                                    <li><Link href="/packages?theme=all">Sikkim</Link></li>
                                                    <li><Link href="/packages?theme=all">Kashmir</Link></li>
                                                    <li><Link href="/packages?theme=all">Andaman</Link></li>
                                                    <li><Link href="/packages?theme=all">Maharashtra</Link></li>
                                                    <li><Link href="/packages?theme=all">Karnataka & South India</Link></li>
                                                    <li className="highlight"><Link href="/packages?theme=bestseller">Golden Triangle <span className="badge-hot">Hot</span></Link></li>
                                                    <li><Link href="/packages?theme=all">Madhya Pradesh</Link></li>
                                                    <li><Link href="/packages?theme=all">Northeast</Link></li>
                                                    <li><Link href="/packages?theme=all">Odisha</Link></li>
                                                    <li><Link href="/packages?theme=all">Hyderabad</Link></li>
                                                    <li><Link href="/packages?theme=all">North Kerala</Link></li>
                                                    <li><Link href="/packages?theme=all">Uttar Pradesh</Link></li>
                                                    <li><Link href="/packages?theme=all">Lakshadweep Island</Link></li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Asia Column */}
                                        <div className="ft-mega-col">
                                            <div className="ft-mega-section">
                                                <h5 className="ft-mega-title"><i className="bi bi-globe"></i> Asia</h5>
                                                <ul className="ft-mega-list">
                                                    <li><Link href="/packages?theme=all">Vietnam</Link></li>
                                                    <li><Link href="/packages?theme=all">China</Link></li>
                                                    <li><Link href="/packages?theme=all">Hong Kong</Link></li>
                                                    <li><Link href="/packages?theme=all">Japan</Link></li>
                                                    <li><Link href="/packages?theme=all">Macau</Link></li>
                                                    <li><Link href="/packages?theme=all">Philippines</Link></li>
                                                    <li><Link href="/packages?theme=all">Bali</Link></li>
                                                    <li><Link href="/packages?theme=all">South Korea</Link></li>
                                                    <li className="highlight"><Link href="/packages?theme=bestseller">Singapore Malaysia <span className="badge-popular">Popular</span></Link></li>
                                                    <li className="highlight"><Link href="/packages?theme=all">Singapore Bali</Link></li>
                                                    <li><Link href="/packages?theme=all">Maldives</Link></li>
                                                    <li><Link href="/packages?theme=all">Sri Lanka</Link></li>
                                                    <li><Link href="/packages?theme=all">Singapore</Link></li>
                                                    <li><Link href="/packages?theme=all">Malaysia</Link></li>
                                                    <li><Link href="/packages?theme=all">Thailand</Link></li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Central Europe Column */}
                                        <div className="ft-mega-col">
                                            <div className="ft-mega-section">
                                                <h5 className="ft-mega-title"><i className="bi bi-compass"></i> Central Europe</h5>
                                                <ul className="ft-mega-list">
                                                    <li><Link href="/packages?theme=all">Finland</Link></li>
                                                    <li><Link href="/packages?theme=all">France</Link></li>
                                                    <li><Link href="/packages?theme=all">Germany</Link></li>
                                                    <li><Link href="/packages?theme=all">Iceland</Link></li>
                                                    <li><Link href="/packages?theme=all">Italy</Link></li>
                                                    <li><Link href="/packages?theme=all">Norway</Link></li>
                                                    <li><Link href="/packages?theme=all">Portugal</Link></li>
                                                    <li><Link href="/packages?theme=all">Spain</Link></li>
                                                    <li><Link href="/packages?theme=all">Switzerland</Link></li>
                                                    <li><Link href="/packages?theme=all">UK - Scotland</Link></li>
                                                    <li><Link href="/packages?theme=all">Netherlands</Link></li>
                                                    <li className="highlight"><Link href="/packages?theme=bestseller">Switzerland - Paris <span className="badge-bestseller">Best Seller</span></Link></li>
                                                    <li><Link href="/packages?theme=all">All Of Europe</Link></li>
                                                    <li><Link href="/packages?theme=all">Austria</Link></li>
                                                    <li><Link href="/packages?theme=all">Ireland</Link></li>
                                                    <li><Link href="/packages?theme=all">Scandinavia</Link></li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* East Europe Column */}
                                        <div className="ft-mega-col">
                                            <div className="ft-mega-section">
                                                <h5 className="ft-mega-title"><i className="bi bi-castle"></i> East Europe</h5>
                                                <ul className="ft-mega-list">
                                                    <li><Link href="/packages?theme=all">Baltic</Link></li>
                                                    <li><Link href="/packages?theme=all">Croatia</Link></li>
                                                    <li><Link href="/packages?theme=all">Czech Republic</Link></li>
                                                    <li><Link href="/packages?theme=all">Greece</Link></li>
                                                    <li><Link href="/packages?theme=all">Hungary</Link></li>
                                                    <li><Link href="/packages?theme=all">Poland</Link></li>
                                                    <li><Link href="/packages?theme=all">Russia</Link></li>
                                                    <li><Link href="/packages?theme=all">Turkey</Link></li>
                                                    <li className="highlight"><Link href="/packages?theme=all">Greece - Turkey</Link></li>
                                                    <li><Link href="/packages?theme=all">All of East Europe</Link></li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Featured Deals Column */}
                                        <div className="ft-mega-col ft-mega-spotlight-col">
                                            <h5 className="ft-mega-title"><i className="bi bi-fire text-danger"></i> Featured Deals</h5>
                                            <div className="ft-mega-spotlight-stack">
                                                <div className="ft-mega-spotlight-card">
                                                    <span className="spotlight-badge bg-emerald">Best Seller</span>
                                                    <img src="/assets/img/home1/package-card-img1.png" alt="Switzerland" onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} />
                                                    <div className="spotlight-content">
                                                        <h4>Switzerland Jewel</h4>
                                                        <div className="spotlight-meta">
                                                            <span className="days"><i className="bi bi-clock"></i> 8N/9D</span>
                                                            <span className="rating"><i className="bi bi-star-fill text-warning"></i> 4.9</span>
                                                        </div>
                                                        <div className="spotlight-action">
                                                            <span className="spotlight-price">₹1,25,000</span>
                                                            <Link href="/packages/4" className="spotlight-btn">View <i className="bi bi-arrow-right"></i></Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            {/* Theme Tours with Dropdown */}
                            <li className={`ft-nav-li has-dropdown ${activeMobileMenu === 'themes' ? 'active-mobile' : ''}`}>
                                <span className="ft-nav-link" onClick={() => toggleMobileSubmenu('themes')}>
                                    <i className="bi bi-umbrella ft-nav-icon"></i>
                                    <span className="ft-nav-text">Theme Tours</span>
                                    <i className="bi bi-chevron-down ft-nav-arrow"></i>
                                </span>
                                <ul className="ft-dropdown-menu tour-themed-dropdown" style={activeMobileMenu === 'themes' ? { display: 'block' } : {}}>
                                    <li className="tour-dropdown-item type-spiritual">
                                        <Link href="/packages?theme=spiritual">
                                            <i className="bi bi-brightness-high"></i>
                                            <div className="dropdown-item-details">
                                                <span className="item-title">Chardham Yatra</span>
                                                <span className="item-desc">Spiritual Pilgrimage</span>
                                            </div>
                                            <span className="dropdown-tour-badge badge-spiritual">Spiritual</span>
                                        </Link>
                                    </li>
                                    <li className="tour-dropdown-item type-bestseller">
                                        <Link href="/packages?theme=bestseller">
                                            <i className="bi bi-star-fill"></i>
                                            <div className="dropdown-item-details">
                                                <span className="item-title">Super Seller Packages</span>
                                                <span className="item-desc">Top Rated Vacations</span>
                                            </div>
                                            <span className="dropdown-tour-badge badge-bestseller-blue">Bestseller</span>
                                        </Link>
                                    </li>
                                    <li className="tour-dropdown-item type-summer">
                                        <Link href="/packages?theme=summer">
                                            <i className="bi bi-sun-fill"></i>
                                            <div className="dropdown-item-details">
                                                <span className="item-title">Summer Special Tours</span>
                                                <span className="item-desc">Beat the heat</span>
                                            </div>
                                            <span className="dropdown-tour-badge badge-summer">Summer</span>
                                        </Link>
                                    </li>
                                    <li className="tour-dropdown-item type-honeymoon">
                                        <Link href="/packages?theme=honeymoon">
                                            <i className="bi bi-heart-fill"></i>
                                            <div className="dropdown-item-details">
                                                <span className="item-title">Honeymoon Specials</span>
                                                <span className="item-desc">Romantic Getaways</span>
                                            </div>
                                            <span className="dropdown-tour-badge badge-honeymoon">Romantic</span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>

                            {/* Hotels & Resorts */}
                            <li className="ft-nav-li">
                                <Link href="/hotels" className="ft-nav-link">
                                    <i className="bi bi-building ft-nav-icon"></i>
                                    <span className="ft-nav-text">Hotels & Resorts</span>
                                </Link>
                            </li>

                            {/* Flights */}
                            <li className="ft-nav-li">
                                <Link href="/flights" className="ft-nav-link">
                                    <i className="bi bi-plane ft-nav-icon"></i>
                                    <span className="ft-nav-text">Flights</span>
                                </Link>
                            </li>

                            {/* Visas */}
                            <li className="ft-nav-li">
                                <a href="#" className="ft-nav-link" onClick={() => alert('Visa assistance request system is coming soon!')}>
                                    <i className="bi bi-file-earmark-person ft-nav-icon"></i>
                                    <span className="ft-nav-text">Visas</span>
                                </a>
                            </li>

                            {/* Blogs */}
                            <li className="ft-nav-li">
                                <a href="#" className="ft-nav-link">
                                    <i className="bi bi-journal-text ft-nav-icon"></i>
                                    <span className="ft-nav-text">Blogs</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}
