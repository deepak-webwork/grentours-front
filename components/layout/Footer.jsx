'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const LOGO_SRC = '/assets/img/logo.png';
const LOGO_FALLBACK = '/assets/img/grentours_placeholder.png';

const DEFAULT_SETTINGS = {
    site_name: 'Grentours',
    contact_phone: '+91 22 6123 4567',
    support_email: 'info@grentours.in',
    contact_hours: 'Mon–Sat: 9 AM – 7 PM',
    address: 'Grentours House, Marine Lines, Mumbai – 400 020',
    footer_description:
        "Grentours is India's trusted travel company with decades of expertise in holiday packages, group tours, honeymoons, flights, visas, and corporate travel.",
};

export default function Footer() {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [themes, setThemes] = useState([]);
    const [destinations, setDestinations] = useState([]);

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

        fetch(`${apiUrl}/api/v1/settings`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.settings) {
                    setSettings((prev) => ({ ...prev, ...data.settings }));
                }
            })
            .catch(() => {});

        fetch(`${apiUrl}/api/v1/themes?footer=1`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.themes) {
                    setThemes(data.themes);
                }
            })
            .catch(() => {});

        fetch(`${apiUrl}/api/v1/destinations?footer=1`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.destinations) {
                    setDestinations(data.destinations);
                }
            })
            .catch(() => {});
    }, []);

    const phoneDigits = (settings.contact_phone || '').replace(/\D/g, '');
    const waLink = phoneDigits ? `https://wa.me/${phoneDigits}` : 'https://wa.me/919825081806';
    const telLink = settings.contact_phone ? `tel:${settings.contact_phone.replace(/\s/g, '')}` : 'tel:+912261234567';

    const packageLinks = destinations.map((dest) => ({
        href: `/packages?q=${encodeURIComponent(dest.name)}`,
        label: `${dest.name} Tours`,
    }));

    const themeLinks = themes.map((theme) => ({
        href: `/packages?theme=${theme.slug || 'all'}`,
        label: theme.name || theme.theme_name,
    }));

    const siteName = settings.site_name || DEFAULT_SETTINGS.site_name;
    const footerDescription = settings.footer_description || DEFAULT_SETTINGS.footer_description;

    return (
        <>
            <footer className="ft-footer">
                <div className="container-xl">
                    <div className="ft-footer-inner">
                        <div>
                            <Link href="/">
                                <img
                                    src={LOGO_SRC}
                                    alt={`${siteName} Logo`}
                                    className="ft-footer-logo"
                                    onError={(e) => { e.target.src = LOGO_FALLBACK; }}
                                />
                            </Link>
                            {footerDescription && (
                                <div className="ft-footer-desc">{footerDescription}</div>
                            )}
                            <div className="ft-footer-contact-btns sm-hidden">
                                <a href={waLink} target="_blank" rel="noopener noreferrer" className="ft-footer-btn ft-btn-whatsapp">
                                    <i className="bi bi-whatsapp"></i> WhatsApp Us
                                </a>
                                <a href={telLink} className="ft-footer-btn ft-btn-phone">
                                    <i className="bi bi-telephone"></i> {settings.contact_phone}
                                </a>
                            </div>
                        </div>
                        {packageLinks.length > 0 && (
                            <div className="ft-footer-col">
                                <h5>Holiday Packages</h5>
                                <ul>
                                    {packageLinks.map((link) => (
                                        <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {themeLinks.length > 0 && (
                            <div className="ft-footer-col">
                                <h5>Tour Themes</h5>
                                <ul>
                                    {themeLinks.map((link) => (
                                        <li key={link.href + link.label}><Link href={link.href}>{link.label}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="ft-footer-col">
                            <h5>Contact Us</h5>
                            <ul className="ft-footer-contact">
                                <li><i className="bi bi-geo-alt-fill"></i><span>{settings.address}</span></li>
                                <li><i className="bi bi-telephone-fill"></i><span>{settings.contact_phone}</span></li>
                                <li><i className="bi bi-envelope-fill"></i><span>{settings.support_email}</span></li>
                                <li><i className="bi bi-clock-fill"></i><span>{settings.contact_hours}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="ft-footer-bottom">
                    <div className="container-xl">
                        © {new Date().getFullYear()} {siteName}. All rights reserved. |
                        <Link href="/privacy-policy">Privacy Policy</Link> |
                        <Link href="/terms-and-conditions">Terms &amp; Conditions</Link> |
                        <Link href="/sitemap">Sitemap</Link>
                    </div>
                </div>
            </footer>

            <a href={waLink} className="ft-whatsapp" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                    <i className="bi bi-whatsapp"></i>
                </a>
        </>
    );
}
