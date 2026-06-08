import React, { Suspense } from 'react';
import Topbar from '../components/layout/Topbar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import EnquiryProvider from '../components/enquiry/EnquiryProvider';

export const metadata = {
    title: "Grentours – Holiday Packages, Group Tours & International Vacations",
    description: "Grentours – India's trusted travel company with 50+ years of expertise. Find holiday packages, group tours & international tours.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
                <link rel="icon" href="/assets/img/favicon.png" />

                {/* Google Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Lilita+One&family=Montserrat:wght@800;900&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

                {/* Legacy Stylesheets served statically */}
                <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
                <link rel="stylesheet" href="/assets/css/bootstrap-icons.css" />
                <link rel="stylesheet" href="/assets/css/all.min.css" />
                <link rel="stylesheet" href="/assets/css/swiper-bundle.min.css" />
                <link rel="stylesheet" href="/assets/css/home-style.css" />
                <link rel="stylesheet" href="/assets/css/enquiry-modal.css" />
                <link rel="stylesheet" href="/assets/css/search-modal.css" />
                <link rel="stylesheet" href="/assets/css/travel-media.css" />
            </head>
            <body>
                <EnquiryProvider>
                    <Topbar />
                    <Suspense fallback={<div className="container py-3">Loading header...</div>}>
                        <Header />
                    </Suspense>

                    {children}

                    <Footer />
                </EnquiryProvider>
            </body>
        </html>
    );
}
