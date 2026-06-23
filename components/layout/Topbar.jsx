'use client';

import React, { useState, useEffect } from 'react';

export default function Topbar() {
    const [settings, setSettings] = useState({
        contact_phone: '+91 99670 23911',
        support_email: 'enquiry@grentours.com',
        contact_hours: 'Mon–Sat: 9 AM – 7 PM',
        social_links: [
            { platform: 'facebook', url: 'https://facebook.com/grentours' },
            { platform: 'instagram', url: 'https://instagram.com/grentours' },
            { platform: 'youtube', url: 'https://youtube.com/grentours' }
        ]
    });

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        fetch(`${apiUrl}/api/v1/settings`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.settings) {
                    setSettings(data.settings);
                }
            })
            .catch(err => console.error('Error fetching settings:', err));
    }, []);

    const getSocialIconClass = (platform) => {
        switch (platform?.toLowerCase()) {
            case 'facebook': return 'facebook';
            case 'instagram': return 'instagram';
            case 'youtube': return 'youtube';
            case 'twitter': return 'twitter-x';
            case 'linkedin': return 'linkedin';
            case 'pinterest': return 'pinterest';
            case 'tiktok': return 'tiktok';
            case 'whatsapp': return 'whatsapp';
            default: return 'share-fill';
        }
    };

    const handleInquiryClick = () => {
        window.dispatchEvent(new CustomEvent('open-enquiry-modal'));
    };

    return (
        <div className="ft-topbar">
            <div className="container-xl">
                <div className="ft-topbar-wrap">
                    <div className="ft-topbar-left">
                        <div className="ft-topbar-info">
                            {settings.contact_phone && (
                                <div className="ft-info-item">
                                    <i className="bi bi-telephone-fill"></i>
                                    <span>For inquiry: <strong>{settings.contact_phone}</strong></span>
                                </div>
                            )}
                            {settings.support_email && (
                                <div className="ft-info-item">
                                    <i className="bi bi-envelope-fill"></i>
                                    <span>{settings.support_email}</span>
                                </div>
                            )}
                            {settings.contact_hours && (
                                <div className="ft-info-item d-none d-md-flex">
                                    <i className="bi bi-clock-fill"></i>
                                    <span>{settings.contact_hours}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="ft-topbar-right">
                        {settings.social_links && settings.social_links.length > 0 && (
                            <div className="ft-topbar-socials text-nowrap">
                                {settings.social_links.map((link, index) => (
                                    <a 
                                        key={index} 
                                        href={link.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="ft-social-link" 
                                        title={link.platform}
                                    >
                                        <i className={`bi bi-${getSocialIconClass(link.platform)}`}></i>
                                    </a>
                                ))}
                            </div>
                        )}
                        <button
                            type="button"
                            className="ft-top-inquiry-btn d-none d-md-inline-flex"
                            onClick={handleInquiryClick}
                        >
                            <i className="bi bi-send-fill"></i> Get Free Quote
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
