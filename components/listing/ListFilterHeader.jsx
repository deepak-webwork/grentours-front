'use client';

import React from 'react';

export default function ListFilterHeader({ title, onReset, onClose }) {
    return (
        <div className="filter-header">
            <div className="filter-header-toolbar">
                <h2 className="filter-header-title">
                    <span className="filter-header-icon" aria-hidden="true">
                        <i className="bi bi-funnel-fill" />
                    </span>
                    <span>{title}</span>
                </h2>
                <div className="filter-header-actions">
                    <button type="button" className="filter-header-reset" onClick={onReset}>
                        Reset
                    </button>
                    <button
                        type="button"
                        className="filter-header-close d-lg-none"
                        onClick={onClose}
                        aria-label="Close filters"
                    >
                        <i className="bi bi-x-lg" />
                    </button>
                </div>
            </div>
        </div>
    );
}
