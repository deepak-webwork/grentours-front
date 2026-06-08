'use client';

import React from 'react';

function PlanItem({ plan, isOpen, onToggle }) {
    return (
        <div className="tour-plan-day">
            <div
                className={`day-header ${isOpen ? 'is-open' : ''}`}
                onClick={onToggle}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggle(); }}
            >
                <div className="day-header-left">
                    <span className="day-badge">{plan.day}</span>
                    <span className="day-header-title">{plan.title}</span>
                </div>
                <i className="bi bi-chevron-down day-chevron" />
            </div>
            {isOpen && (
                <div className="day-body">
                    <p>{plan.desc}</p>
                    {(plan.meals || plan.accommodation) && (
                        <div className="day-body-meta">
                            {plan.meals && (
                                <span><i className="bi bi-egg-fried" /> {plan.meals}</span>
                            )}
                            {plan.accommodation && (
                                <span><i className="bi bi-building" /> {plan.accommodation}</span>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function FaqItem({ faq, isOpen, onToggle }) {
    return (
        <div className="tour-plan-day">
            <div
                className={`day-header ${isOpen ? 'is-open' : ''}`}
                onClick={onToggle}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggle(); }}
            >
                <span>{faq.question}</span>
                <i className="bi bi-chevron-down day-chevron" />
            </div>
            {isOpen && <div className="day-body"><p>{faq.answer}</p></div>}
        </div>
    );
}

export function TourPlanAccordion({ items, openIndex, onToggle }) {
    return (
        <div className="tour-plan-stack">
            {items.map((plan, i) => (
                <PlanItem
                    key={i}
                    plan={plan}
                    isOpen={openIndex === i}
                    onToggle={() => onToggle(openIndex === i ? -1 : i)}
                />
            ))}
        </div>
    );
}

export function FaqAccordion({ items, openIndex, onToggle }) {
    return (
        <div className="tour-plan-stack faq-stack">
            {items.map((faq, i) => (
                <FaqItem
                    key={i}
                    faq={faq}
                    isOpen={openIndex === i}
                    onToggle={() => onToggle(openIndex === i ? -1 : i)}
                />
            ))}
        </div>
    );
}
