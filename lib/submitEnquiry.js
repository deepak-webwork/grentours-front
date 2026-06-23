const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getApiUrl() {
    return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
}

export function monthToTravelDate(monthLabel) {
    if (!monthLabel || monthLabel === 'Select Month') return null;
    const parsed = new Date(`${monthLabel} 1`);
    if (Number.isNaN(parsed.getTime())) return null;
    const dateStr = parsed.toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return dateStr >= today ? dateStr : null;
}

export function buildMonthOptions(count = 12) {
    const options = [{ value: '', label: 'Select Month' }];
    const now = new Date();
    for (let i = 0; i < count; i += 1) {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const label = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
        options.push({ value: label, label });
    }
    return options;
}

export function validateEnquiryForm({ name, phone, email, message }) {
    const trimmedName = (name || '').trim();
    const trimmedPhone = (phone || '').trim();
    const trimmedEmail = (email || '').trim();

    if (!trimmedName || trimmedName.length < 2) {
        return 'Please enter your full name (at least 2 characters).';
    }
    if (!trimmedPhone) {
        return 'Please enter your phone number.';
    }
    if (!PHONE_REGEX.test(trimmedPhone)) {
        return 'Please enter a valid phone number (7–20 digits).';
    }
    if (trimmedEmail && !EMAIL_REGEX.test(trimmedEmail)) {
        return 'Please enter a valid email address.';
    }
    if ((message || '').length > 2000) {
        return 'Message must be 2000 characters or less.';
    }
    return '';
}

export async function submitGeneralEnquiry({
    name,
    phone,
    email,
    interest,
    month,
    travelDate = null,
    endDate = null,
    message,
    type = 'general',
    adults = 2,
    children = 0,
    packageId = null,
}) {
    const validationError = validateEnquiryForm({ name, phone, email, message });
    if (validationError) {
        throw new Error(validationError);
    }

    const interestLine = interest && interest !== 'Select Tour' ? `Interested in: ${interest}` : '';
    const monthLine = month && month !== 'Select Month' ? `Preferred travel month: ${month}` : '';
    const endDateLine = endDate ? `Travel End Date: ${endDate}` : '';
    const combinedMessage = [interestLine, monthLine, endDateLine, (message || '').trim()].filter(Boolean).join('\n');

    const payload = {
        type,
        name: name.trim(),
        mobile: phone.trim(),
        email: email?.trim() || null,
        travel_date: travelDate || monthToTravelDate(month),
        adults: parseInt(adults, 10) || 2,
        children: parseInt(children, 10) || 0,
        message: combinedMessage || null,
        package_id: packageId,
    };

    const response = await fetch(`${getApiUrl()}/api/v1/enquiries`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        const errorDetails = data.errors
            ? Object.values(data.errors).flat().join(' ')
            : '';
        throw new Error(errorDetails || data.message || 'Failed to submit enquiry.');
    }

    return data;
}

export function openEnquiryModal() {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('open-enquiry-modal'));
    }
}
