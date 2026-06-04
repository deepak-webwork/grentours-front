'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <>
            <footer className="ft-footer">
                <div className="container-xl">
                    <div className="ft-footer-inner">
                        <div>
                            <img src="/assets/img/logo.png" alt="Grentours Logo" className="ft-footer-logo" onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} />
                            <div className="ft-footer-desc">
                                Grentours is India's leading travel company with 50+ years of expertise in crafting memorable
                                holiday experiences. Specialists in Group Tours, Honeymoon Packages, Fixed Departures &amp;
                                Corporate Travel.
                            </div>
                            <div className="ft-footer-contact-btns sm-hidden">
                                <a href="https://wa.me/919825081806" target="_blank" rel="noopener noreferrer" className="ft-footer-btn ft-btn-whatsapp">
                                    <i className="bi bi-whatsapp"></i> +91 98250 81806
                                </a>
                                <a href="tel:+919825081806" className="ft-footer-btn ft-btn-phone">
                                    <i className="bi bi-telephone"></i> +91 98250 81806
                                </a>
                            </div>
                        </div>
                        <div className="ft-footer-col">
                            <h5>Holiday Packages</h5>
                            <ul>
                                <li><Link href="/packages?theme=all">India Tours</Link></li>
                                <li><Link href="/packages?theme=bestseller">Europe Tours</Link></li>
                                <li><Link href="/packages?theme=all">Asia Tours</Link></li>
                                <li><Link href="/packages?theme=all">Middle East</Link></li>
                                <li><Link href="/packages?theme=all">USA &amp; Canada</Link></li>
                                <li><Link href="/packages?theme=all">Australia &amp; NZ</Link></li>
                                <li><Link href="/packages?theme=honeymoon">Maldives</Link></li>
                            </ul>
                        </div>
                        <div className="ft-footer-col">
                            <h5>Tour Themes</h5>
                            <ul>
                                <li><Link href="/packages?theme=family">Group Tours</Link></li>
                                <li><Link href="/packages?theme=honeymoon">Honeymoon</Link></li>
                                <li><Link href="/packages?theme=exotic">Self Drive</Link></li>
                                <li><Link href="/packages?theme=all">Short Breaks</Link></li>
                                <li><Link href="/packages?theme=summer">Summer 2026</Link></li>
                                <li><Link href="/packages?theme=bestseller">Fixed Departures</Link></li>
                                <li><Link href="/packages?theme=spiritual">Chardham Yatra</Link></li>
                            </ul>
                        </div>
                        <div className="ft-footer-col">
                            <h5>Contact Us</h5>
                            <ul className="ft-footer-contact">
                                <li><i className="bi bi-geo-alt-fill"></i><span>Green Tours House, Marine Lines,<br />Mumbai – 400 020</span></li>
                                <li><i className="bi bi-telephone-fill"></i><span>+91 22 6123 4567<br />+91 98250 81806</span></li>
                                <li><i className="bi bi-envelope-fill"></i><span>info@grentours.in</span></li>
                                <li><i className="bi bi-clock-fill"></i><span>Mon–Sat: 9:00 AM – 7:00 PM</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="ft-footer-bottom">
                    <div className="container-xl">
                        © 2026 Grentours. All rights reserved. |
                        <a href="#">Privacy Policy</a> |
                        <a href="#">Terms &amp; Conditions</a> |
                        <a href="#">Sitemap</a>
                    </div>
                </div>
            </footer>

            {/* WhatsApp Floating Action */}
            <a href="https://wa.me/919825081806" className="ft-whatsapp" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-whatsapp"></i>
            </a>
        </>
    );
}
