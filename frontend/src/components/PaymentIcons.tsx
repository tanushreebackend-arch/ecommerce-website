import Image from 'next/image';

const badgeStyle = {
  padding: '6px 10px',
  borderRadius: '4px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#ffffff',
} as const;

const iconHeight = 24;

function VisaLogo() {
  return (
    <svg viewBox="0 0 48 16" style={{ height: iconHeight, width: 'auto' }} aria-hidden>
      <rect width="48" height="16" rx="2" fill="#1A1F71" />
      <text x="8" y="12" fontSize="11" fontWeight="700" fontStyle="italic" fill="#ffffff" fontFamily="Arial, sans-serif">
        VISA
      </text>
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg viewBox="0 0 36 22" style={{ height: iconHeight, width: 'auto' }} aria-hidden>
      <circle cx="14" cy="11" r="9" fill="#EB001B" />
      <circle cx="22" cy="11" r="9" fill="#F79E1B" />
      <path d="M18 4.5a9 9 0 0 1 0 13A9 9 0 0 1 18 4.5Z" fill="#FF5F00" opacity="0.85" />
    </svg>
  );
}

function AmexLogo() {
  return (
    <svg viewBox="0 0 48 16" style={{ height: iconHeight, width: 'auto' }} aria-hidden>
      <rect width="48" height="16" rx="2" fill="#2E77BC" />
      <text x="6" y="11.5" fontSize="7.5" fontWeight="700" fill="#ffffff" fontFamily="Arial, sans-serif">
        AMEX
      </text>
    </svg>
  );
}

function UpiLogo() {
  return (
    <Image
      src="/payment-icons/upi.svg"
      alt="UPI"
      width={68}
      height={24}
      style={{ height: iconHeight, width: 'auto' }}
      unoptimized
    />
  );
}

function RazorpayLogo() {
  return (
    <svg viewBox="0 0 88 24" style={{ height: iconHeight, width: 'auto' }} aria-hidden>
      <path fill="#3395FF" d="M8 0L0 24h4.8L8 13.2 11.2 24H16L8 0z" />
      <rect x="20" y="2" width="66" height="20" rx="3" fill="#072654" />
      <text x="26" y="16" fontSize="10" fontWeight="600" fill="#ffffff" fontFamily="Arial, sans-serif">
        razorpay
      </text>
    </svg>
  );
}

export default function PaymentIcons({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <div style={badgeStyle} aria-label="Visa">
        <VisaLogo />
      </div>

      <div style={badgeStyle} aria-label="Mastercard">
        <MastercardLogo />
      </div>

      <div style={badgeStyle} aria-label="American Express">
        <AmexLogo />
      </div>

      <div style={badgeStyle} aria-label="UPI">
        <UpiLogo />
      </div>

      <div style={badgeStyle} aria-label="Razorpay">
        <RazorpayLogo />
      </div>
    </div>
  );
}
