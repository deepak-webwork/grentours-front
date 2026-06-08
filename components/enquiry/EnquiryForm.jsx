'use client';

import React, { useEffect, useState } from 'react';
import { buildMonthOptions, submitGeneralEnquiry } from '../../lib/submitEnquiry';

const DEFAULT_INTERESTS = [
    'Europe Tours',
    'Bali / Asia Tours',
    'Maldives',
    'Chardham Yatra',
    'Dubai / Middle East',
    'Honeymoon Package',
    'Group Tours',
    'Other',
];

const EMPTY_FORM = {
    name: '',
    phone: '',
    email: '',
    interest: 'Select Tour',
    month: 'Select Month',
    adults: '2',
    children: '0',
    message: '',
};

export default function EnquiryForm({ variant = 'modal', onSuccess, onCancel }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [themes, setThemes] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const monthOptions = buildMonthOptions();

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        fetch(`${apiUrl}/api/v1/themes`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.themes?.length) {
                    setThemes(data.themes.slice(0, 8));
                }
            })
            .catch(() => {});
    }, []);

    const interestOptions = themes.length
        ? themes.map((t) => t.theme_name || t.name)
        : DEFAULT_INTERESTS;

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errorMsg) setErrorMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsSubmitting(true);

        try {
            const data = await submitGeneralEnquiry({
                name: form.name,
                phone: form.phone,
                email: form.email,
                interest: form.interest,
                month: form.month,
                message: form.message,
                adults: form.adults,
                children: form.children,
                type: 'general',
            });

            setSubmitted(true);
            setForm(EMPTY_FORM);
            onSuccess?.(data);

            setTimeout(() => {
                setSubmitted(false);
                onCancel?.();
            }, 3500);
        } catch (err) {
            setErrorMsg(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="enq-success-state">
                <i className="bi bi-check-circle-fill"></i>
                <h4>Enquiry Sent Successfully!</h4>
                <p>Our travel expert will contact you shortly with the best options.</p>
            </div>
        );
    }

    return (
        <form className={`enq-form enq-form--${variant}`} onSubmit={handleSubmit}>
            {errorMsg && (
                <div className="enq-alert enq-alert--error" role="alert">
                    <i className="bi bi-exclamation-triangle-fill"></i> {errorMsg}
                </div>
            )}

            <div className="enq-form-grid">
                <div className="enq-field enq-field--full">
                    <label>Your Name *</label>
                    <input
                        type="text"
                        placeholder="Enter full name"
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        required
                    />
                </div>

                <div className="enq-field">
                    <label>Mobile Number *</label>
                    <input
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={form.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        required
                    />
                </div>

                <div className="enq-field">
                    <label>Email Address</label>
                    <input
                        type="email"
                        placeholder="name@email.com"
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                    />
                </div>

                <div className="enq-field">
                    <label>Interested In</label>
                    <select
                        value={form.interest}
                        onChange={(e) => updateField('interest', e.target.value)}
                    >
                        <option value="Select Tour">Select Tour</option>
                        {interestOptions.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                </div>

                <div className="enq-field">
                    <label>Departure Month</label>
                    <select
                        value={form.month}
                        onChange={(e) => updateField('month', e.target.value)}
                    >
                        {monthOptions.map((opt) => (
                            <option key={opt.value || 'default'} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div className="enq-field">
                    <label>Adults</label>
                    <select value={form.adults} onChange={(e) => updateField('adults', e.target.value)}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                            <option key={n} value={String(n)}>{n}</option>
                        ))}
                    </select>
                </div>

                <div className="enq-field">
                    <label>Children</label>
                    <select value={form.children} onChange={(e) => updateField('children', e.target.value)}>
                        {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                            <option key={n} value={String(n)}>{n}</option>
                        ))}
                    </select>
                </div>

                <div className="enq-field enq-field--full">
                    <label>Message (Optional)</label>
                    <textarea
                        rows={variant === 'card' ? 3 : 4}
                        placeholder="Any specific requirements, budget, or destinations..."
                        value={form.message}
                        maxLength={2000}
                        onChange={(e) => updateField('message', e.target.value)}
                    />
                </div>
            </div>

            <div className="enq-form-actions">
                {variant === 'modal' && onCancel && (
                    <button type="button" className="enq-btn enq-btn--ghost" onClick={onCancel}>
                        Cancel
                    </button>
                )}
                <button type="submit" className="enq-btn enq-btn--primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Sending...
                        </>
                    ) : (
                        <>
                            Send Enquiry <i className="bi bi-send-fill"></i>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
