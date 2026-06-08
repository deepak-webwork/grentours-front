import React from 'react';
import Link from 'next/link';

export const metadata = {
    title: 'Sitemap | Grentours',
    description: 'Browse all main pages on the Grentours website.',
};

const LINKS = [
    { href: '/', label: 'Home' },
    { href: '/packages', label: 'Holiday Packages' },
    { href: '/hotels', label: 'Hotels & Resorts' },
    { href: '/flights', label: 'Flights' },
    { href: '/visa', label: 'Visa Services' },
    { href: '/blogs', label: 'Travel Blogs' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-and-conditions', label: 'Terms & Conditions' },
];

export default function SitemapPage() {
    return (
        <div className="cms-page-wrap">
            <div className="container-xl py-4 py-md-5">
                <Link href="/" className="cms-back-link">
                    <i className="bi bi-arrow-left"></i> Back to Home
                </Link>
                <div className="cms-page-card">
                    <h1>Sitemap</h1>
                    <p className="text-muted mb-4">Quick links to all main sections of our website.</p>
                    <ul className="cms-sitemap-list">
                        {LINKS.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
