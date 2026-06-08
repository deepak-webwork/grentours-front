import React from 'react';
import CmsPageView from '../../components/legal/CmsPageView';

export const metadata = {
    title: 'Privacy Policy | Grentours',
    description: 'Privacy policy for Grentours travel website and enquiry services.',
};

export default function PrivacyPolicyPage() {
    return (
        <CmsPageView
            slug="privacy-policy"
            fallbackTitle="Privacy Policy"
            fallbackContent="<p>Grentours is committed to protecting your privacy. Please contact us for more information.</p>"
        />
    );
}
