'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CmsPageView({ slug, fallbackTitle, fallbackContent }) {
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        fetch(`${apiUrl}/api/v1/pages/${slug}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.page) {
                    setPage(data.page);
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [slug]);

    const title = page?.title || fallbackTitle;
    const content = page?.content || fallbackContent;

    return (
        <div className="cms-page-wrap">
            <div className="container-xl py-4 py-md-5">
                <Link href="/" className="cms-back-link">
                    <i className="bi bi-arrow-left"></i> Back to Home
                </Link>
                <div className="cms-page-card">
                    {loading ? (
                        <div className="cms-loading">Loading...</div>
                    ) : (
                        <>
                            <h1>{title}</h1>
                            <div className="cms-page-content" dangerouslySetInnerHTML={{ __html: content }} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
