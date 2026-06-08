'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Footer() {
    const [settings, setSettings] = useState({
        contact_phone: '+91 22 6123 4567',
        support_email: 'info@grentours.in',
        contact_hours: 'Mon–Sat: 9 AM – 7 PM',
        address: 'Green Tours House, Marine Lines, Mumbai – 400 020',
    });
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

        fetch(`${apiUrl}/api/v1/themes`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.themes) {
                    setThemes(data.themes.slice(0, 7));
                }
            })
            .catch(() => {});

        fetch(`${apiUrl}/api/v1/navigation`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.data) {
                    const links = [];
                    data.data.forEach((continent) => {
                        continent.countries?.slice(0, 2).forEach((country) => {
                            links.push({
                                label: `${country.name} Tours`,
                                href: `/packages?q=${encodeURIComponent(country.name)}`,
                            });
                        });
                    });
                    setDestinations(links.slice(0, 7));
                }
            })
            .catch(() => {});
    }, []);

    const phoneDigits = (settings.contact_phone || '').replace(/\D/g, '');
    const waLink = phoneDigits ? `https://wa.me/${phoneDigits}` : 'https://wa.me/919825081806';
    const telLink = settings.contact_phone ? `tel:${settings.contact_phone.replace(/\s/g, '')}` : 'tel:+919825081806';

    const packageLinks = destinations.length > 0 ? destinations : [
        { href: '/packages?q=India', label: 'India Tours' },
        { href: '/packages?q=Europe', label: 'Europe Tours' },
        { href: '/packages?q=Asia', label: 'Asia Tours' },
        { href: '/packages?q=Dubai', label: 'Middle East' },
        { href: '/packages?q=USA', label: 'USA & Canada' },
        { href: '/packages?q=Australia', label: 'Australia & NZ' },
        { href: '/packages?theme=honeymoon', label: 'Maldives' },
    ];

    const themeLinks = themes.length > 0
        ? themes.map((theme) => ({
            href: `/packages?theme=${theme.slug || 'all'}`,
            label: theme.theme_name || theme.name,
        }))
        : [
            { href: '/packages?theme=family', label: 'Group Tours' },
            { href: '/packages?theme=honeymoon', label: 'Honeymoon' },
            { href: '/packages?theme=exotic', label: 'Exotic Tours' },
            { href: '/packages?theme=all', label: 'Short Breaks' },
            { href: '/packages?theme=summer', label: 'Summer Special' },
            { href: '/packages?theme=bestseller', label: 'Fixed Departures' },
            { href: '/packages?theme=spiritual', label: 'Chardham Yatra' },
        ];

    return (
        <>
            <footer className="ft-footer">
                <div className="container-xl">
                    <div className="ft-footer-inner">
                        <div>
                            <img src="/assets/img/logo.png" alt="Grentours Logo" className="ft-footer-logo" onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} />
                            <div className="ft-footer-desc">
                                Grentours is India&apos;s trusted travel company with decades of expertise in holiday packages,
                                group tours, honeymoons, flights, visas, and corporate travel.
                            </div>
                            <div className="ft-footer-contact-btns sm-hidden">
                                <a href={waLink} target="_blank" rel="noopener noreferrer" className="ft-footer-btn ft-btn-whatsapp">
                                    <i className="bi bi-whatsapp"></i> WhatsApp Us
                                </a>
                                <a href={telLink} className="ft-footer-btn ft-btn-phone">
                                    <i className="bi bi-telephone"></i> {settings.contact_phone}
                                </a>
                            </div>
                        </div>
                        <div className="ft-footer-col">
                            <h5>Holiday Packages</h5>
                            <ul>
                                {packageLinks.map((link) => (
                                    <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div className="ft-footer-col">
                            <h5>Tour Themes</h5>
                            <ul>
                                {themeLinks.map((link) => (
                                    <li key={link.href + link.label}><Link href={link.href}>{link.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div className="ft-footer-col">
                            <h5>Contact Us</h5>
                            <ul className="ft-footer-contact">
                                {settings.address && (
                                    <li><i className="bi bi-geo-alt-fill"></i><span>{settings.address}</span></li>
                                )}
                                {settings.contact_phone && (
                                    <li><i className="bi bi-telephone-fill"></i><span>{settings.contact_phone}</span></li>
                                )}
                                {settings.support_email && (
                                    <li><i className="bi bi-envelope-fill"></i><span>{settings.support_email}</span></li>
                                )}
                                {settings.contact_hours && (
                                    <li><i className="bi bi-clock-fill"></i><span>{settings.contact_hours}</span></li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="ft-footer-bottom">
                    <div className="container-xl">
                        © {new Date().getFullYear()} Grentours. All rights reserved. |
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
