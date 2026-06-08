'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '../../lib/packageDetail';

const TYPE_ICONS = {
    package: 'bi-briefcase',
    hotel: 'bi-building',
    destination: 'bi-geo-alt-fill',
    visa: 'bi-passport',
    blog: 'bi-journal-text',
};

export default function SearchModal({ isOpen, onClose }) {
    const router = useRouter();
    const inputRef = useRef(null);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({ groups: [], quick_links: [] });
    const debounceRef = useRef(null);

    const fetchResults = useCallback(async (q) => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
            const res = await fetch(`${apiUrl}/api/v1/search?q=${encodeURIComponent(q)}`);
            const json = await res.json();
            if (json.success) {
                setData({
                    groups: json.groups || [],
                    quick_links: json.quick_links || [],
                    hint: json.hint,
                    total: json.total,
                });
            }
        } catch {
            setData({ groups: [], quick_links: [] });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        setQuery('');
        fetchResults('');
        setTimeout(() => inputRef.current?.focus(), 80);
    }, [isOpen, fetchResults]);

    useEffect(() => {
        if (!isOpen) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKey);
        };
    }, [isOpen, onClose]);

    const handleQueryChange = (value) => {
        setQuery(value);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchResults(value.trim()), 280);
    };

    const goTo = (href) => {
        onClose();
        router.push(href);
    };

    if (!isOpen) return null;

    const hasResults = data.groups?.some((g) => g.items?.length > 0);

    return (
        <div className="search-modal-overlay" onClick={onClose} role="presentation">
            <div className="search-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Site search">
                <div className="search-modal-input-wrap">
                    <i className="bi bi-search" />
                    <input
                        ref={inputRef}
                        type="search"
                        className="search-modal-input"
                        placeholder="Search destinations, packages, hotels, visas, blogs..."
                        value={query}
                        onChange={(e) => handleQueryChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && query.trim()) {
                                goTo(`/packages?q=${encodeURIComponent(query.trim())}`);
                            }
                        }}
                        autoComplete="off"
                    />
                    {query && (
                        <button type="button" className="search-modal-clear" onClick={() => handleQueryChange('')} aria-label="Clear">
                            <i className="bi bi-x-circle-fill" />
                        </button>
                    )}
                    <kbd className="search-modal-kbd d-none d-md-inline">ESC</kbd>
                </div>

                <div className="search-modal-body">
                    {loading && (
                        <div className="search-modal-status">
                            <span className="spinner-border spinner-border-sm text-success" /> Searching...
                        </div>
                    )}

                    {!loading && data.hint && (
                        <p className="search-modal-hint">{data.hint}</p>
                    )}

                    {!loading && !hasResults && query.trim().length >= 2 && (
                        <div className="search-modal-empty">
                            <i className="bi bi-compass" />
                            <p>No results for &ldquo;{query}&rdquo;</p>
                            <button type="button" className="search-modal-cta" onClick={() => goTo(`/packages?q=${encodeURIComponent(query)}`)}>
                                Browse all packages
                            </button>
                        </div>
                    )}

                    {!loading && data.groups?.map((group) => (
                        <div className="search-modal-group" key={group.key}>
                            <h4>{group.label}</h4>
                            <ul>
                                {group.items.map((item) => (
                                    <li key={`${group.key}-${item.id}`}>
                                        <button type="button" className="search-result-item" onClick={() => goTo(item.href)}>
                                            <span className="search-result-thumb">
                                                <img
                                                    src={getImageUrl(item.image)}
                                                    alt=""
                                                    onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }}
                                                />
                                            </span>
                                            <span className="search-result-text">
                                                <span className="search-result-title">{item.title}</span>
                                                <span className="search-result-sub">{item.subtitle}</span>
                                            </span>
                                            {item.meta && <span className="search-result-meta">{item.meta}</span>}
                                            <i className={`bi ${TYPE_ICONS[item.type] || 'bi-arrow-right'} search-result-type-icon`} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {!loading && data.quick_links?.length > 0 && (
                        <div className="search-modal-quick">
                            <h4>{query ? 'Quick actions' : 'Explore'}</h4>
                            <div className="search-modal-quick-grid">
                                {data.quick_links.map((link) => (
                                    <button
                                        key={link.href + link.label}
                                        type="button"
                                        className="search-quick-chip"
                                        onClick={() => goTo(link.href)}
                                    >
                                        <i className={`bi bi-${link.icon || 'arrow-right'}`} />
                                        {link.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="search-modal-footer">
                    <span><kbd>↵</kbd> to search packages</span>
                    <span className="d-none d-sm-inline"><kbd>Ctrl</kbd>+<kbd>K</kbd> to open anytime</span>
                </div>
            </div>
        </div>
    );
}
