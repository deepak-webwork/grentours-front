'use client';

import React, { useState } from 'react';
import { submitGeneralEnquiry } from '../../lib/submitEnquiry';

export default function StayInquiryForm({
    packageId,
    packageTitle,
    enquiryType = 'package',
    title = 'Book Stay / Send Inquiry',
    dateLabel = 'Check-in Date',
    submitLabel = 'Send Inquiry',
}) {
    const startLabel = enquiryType === 'hotel' ? 'Check-in Date' : 'Start Date';
    const endLabel = enquiryType === 'hotel' ? 'Check-out Date' : 'End Date';

    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        date: '',
        endDate: '',
        adults: 2,
        children: 0,
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    const modGuest = (field, delta) => {
        setForm((prev) => {
            const next = Math.max(field === 'adults' ? 1 : 0, prev[field] + delta);
            return { ...prev, [field]: next };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsSubmitting(true);

        try {
            await submitGeneralEnquiry({
                name: form.name,
                phone: form.phone,
                email: form.email,
                interest: packageTitle,
                travelDate: form.date,
                endDate: form.endDate,
                message: form.message.trim() || null,
                type: enquiryType,
                adults: form.adults,
                children: form.children,
                packageId,
            });

            setSubmitted(true);
            setForm({ name: '', phone: '', email: '', date: '', endDate: '', adults: 2, children: 0, message: '' });
            setTimeout(() => setSubmitted(false), 6000);
        } catch (err) {
            setErrorMsg(err.message || 'Failed to submit inquiry.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="booking-sticky-card">
                <div className="booking-success-state">
                    <i className="bi bi-check-circle-fill"></i>
                    <h4>Request Received!</h4>
                    <p>Our travel expert will contact you shortly with availability and the best rates.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-sticky-card" id="inquiry">
            <h3>{title}</h3>
            {errorMsg && (
                <div className="booking-alert booking-alert--error">
                    <i className="bi bi-exclamation-triangle-fill"></i> {errorMsg}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="booking-form-group">
                    <label>Full Name *</label>
                    <div className="booking-input-wrap">
                        <i className="bi bi-person"></i>
                        <input
                            type="text"
                            placeholder="Your full name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="booking-form-row">
                    <div className="booking-form-group">
                        <label>Mobile *</label>
                        <div className="booking-input-wrap">
                            <i className="bi bi-telephone"></i>
                            <input
                                type="tel"
                                placeholder="+91 XXXXX XXXXX"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="booking-form-group">
                        <label>Email</label>
                        <div className="booking-input-wrap">
                            <i className="bi bi-envelope"></i>
                            <input
                                type="email"
                                placeholder="name@email.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="booking-form-row">
                    <div className="booking-form-group">
                        <label>{startLabel} *</label>
                        <div className="booking-input-wrap">
                            <i className="bi bi-calendar3"></i>
                            <input
                                type="date"
                                min={today}
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="booking-form-group">
                        <label>{endLabel} *</label>
                        <div className="booking-input-wrap">
                            <i className="bi bi-calendar3"></i>
                            <input
                                type="date"
                                min={form.date || today}
                                value={form.endDate}
                                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="booking-form-group">
                    <label>Guests</label>
                    <div className="ticket-counters-box">
                        <div className="ticket-counter-row">
                            <div className="ticket-label-side">
                                <span>Adults</span>
                                <small>12+ years</small>
                            </div>
                            <div className="ticket-counter-controls">
                                <button type="button" className="btn-counter-mod" onClick={() => modGuest('adults', -1)}>−</button>
                                <span className="counter-value-display">{form.adults}</span>
                                <button type="button" className="btn-counter-mod" onClick={() => modGuest('adults', 1)}>+</button>
                            </div>
                        </div>
                        <div className="ticket-counter-row">
                            <div className="ticket-label-side">
                                <span>Children</span>
                                <small>2–12 years</small>
                            </div>
                            <div className="ticket-counter-controls">
                                <button type="button" className="btn-counter-mod" onClick={() => modGuest('children', -1)}>−</button>
                                <span className="counter-value-display">{form.children}</span>
                                <button type="button" className="btn-counter-mod" onClick={() => modGuest('children', 1)}>+</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="booking-form-group">
                    <label>Special Requests</label>
                    <div className="booking-input-wrap booking-input-wrap--textarea">
                        <textarea
                            rows={3}
                            placeholder="Room type, meal plan, early check-in..."
                            value={form.message}
                            maxLength={2000}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                        />
                    </div>
                </div>

                <button type="submit" className="btn-submit-inquiry" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : (
                        <>{submitLabel} <i className="bi bi-arrow-right-short"></i></>
                    )}
                </button>
            </form>
        </div>
    );
}
