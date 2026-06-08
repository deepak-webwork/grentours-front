'use client';

import React, { useEffect, useState } from 'react';
import EnquiryModal from './EnquiryModal';

export default function EnquiryProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const openModal = () => setIsOpen(true);
        window.addEventListener('open-enquiry-modal', openModal);
        window.addEventListener('open-inquiry-modal', openModal);
        return () => {
            window.removeEventListener('open-enquiry-modal', openModal);
            window.removeEventListener('open-inquiry-modal', openModal);
        };
    }, []);

    return (
        <>
            {children}
            <EnquiryModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
