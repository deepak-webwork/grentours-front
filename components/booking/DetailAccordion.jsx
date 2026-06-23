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
                    <span className="day-header-title" dangerouslySetInnerHTML={{ __html: plan.title }} />
                </div>
                <i className="bi bi-chevron-down day-chevron" />
            </div>
            {isOpen && (
                <div className="day-body">
                    <div dangerouslySetInnerHTML={{ __html: plan.desc }} />
                    {(plan.meals || plan.accommodation) && (
                        <div className="day-body-meta">
                            {plan.meals && (
                                <span>
                                    <i className="bi bi-egg-fried" /> <span dangerouslySetInnerHTML={{ __html: plan.meals }} />
                                </span>
                            )}
                            {plan.accommodation && (
                                <span>
                                    <i className="bi bi-building" /> <span dangerouslySetInnerHTML={{ __html: plan.accommodation }} />
                                </span>
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
            {isOpen && <div className="day-body"><div dangerouslySetInnerHTML={{ __html: faq.answer }} /></div>}
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
