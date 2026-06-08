import React from 'react';
import CmsPageView from '../../components/legal/CmsPageView';

export const metadata = {
    title: 'Terms & Conditions | Grentours',
    description: 'Terms and conditions for using Grentours website and travel services.',
};

export default function TermsPage() {
    return (
        <CmsPageView
            slug="terms-and-conditions"
            fallbackTitle="Terms & Conditions"
            fallbackContent="<p>By using Grentours services you agree to our booking and cancellation terms. Please contact us for details.</p>"
        />
    );
}
