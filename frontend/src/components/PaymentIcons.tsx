export default function PaymentIcons({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 payment-muted ${className}`}>
      <div className="h-7 px-2.5 border border-[var(--color-card-border)] flex items-center justify-center min-w-[44px] rounded-sm">
        <svg viewBox="0 0 48 16" className="h-3 w-auto opacity-60" aria-label="Visa">
          <text x="4" y="13" fontSize="13" fontWeight="600" fontStyle="italic" fill="#6b6b6b" fontFamily="Arial">VISA</text>
        </svg>
      </div>
      <div className="h-7 px-2.5 border border-[var(--color-card-border)] flex items-center justify-center min-w-[44px] rounded-sm">
        <svg viewBox="0 0 32 20" className="h-3.5 w-auto opacity-60" aria-label="Mastercard">
          <circle cx="12" cy="10" r="8" fill="#9ca3af" />
          <circle cx="20" cy="10" r="8" fill="#6b7280" fillOpacity="0.7" />
        </svg>
      </div>
      <div className="h-7 px-2.5 border border-[var(--color-card-border)] flex items-center justify-center min-w-[44px] rounded-sm">
        <span className="text-[9px] font-body font-medium text-[var(--color-text-secondary)] tracking-tight">AMEX</span>
      </div>
      <div className="h-7 px-2.5 border border-[var(--color-card-border)] flex items-center justify-center min-w-[44px] rounded-sm">
        <span className="text-[10px] font-body font-medium text-[var(--color-text-secondary)] tracking-tight">UPI</span>
      </div>
      <div className="h-7 px-2.5 border border-[var(--color-card-border)] flex items-center justify-center min-w-[44px] rounded-sm">
        <span className="text-[9px] font-body font-medium text-[var(--color-text-secondary)]">Razorpay</span>
      </div>
    </div>
  );
}
