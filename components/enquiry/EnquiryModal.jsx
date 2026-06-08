'use client';

import React, { useEffect } from 'react';
import EnquiryForm from './EnquiryForm';

export default function EnquiryModal({ isOpen, onClose }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="enq-modal-overlay" onClick={onClose}>
            <div className="enq-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="enq-modal-title">
                <button type="button" className="enq-modal-close" onClick={onClose} aria-label="Close">
                    <i className="bi bi-x-lg"></i>
                </button>

                <div className="enq-modal-header">
                    <span className="enq-modal-badge"><i className="bi bi-send-fill"></i> Free Quote</span>
                    <h3 id="enq-modal-title">Get Your Travel Quote</h3>
                    <p>Tell us about your trip and our experts will share the best packages and prices within a few hours.</p>
                </div>

                <div className="enq-modal-body">
                    <EnquiryForm variant="modal" onCancel={onClose} onSuccess={onClose} />
                </div>
            </div>
        </div>
    );
}
