'use client';

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
  label?: string;
  subheading?: string;
}

export default function SectionHeading({
  children,
  className = '',
  centered = true,
  label,
  subheading,
}: SectionHeadingProps) {
  return (
    <div className={`mb-6 ${centered ? 'text-center' : ''} ${className}`}>
      {label && (
        <p className="section-subheading">{label}</p>
      )}
      <div className={`heading-decor ${centered ? 'mx-auto' : ''}`} aria-hidden />
      <h2 className="section-heading">{children}</h2>
      {subheading && (
        <p className="section-lead mt-2 mb-2 mx-auto max-w-[640px]">{subheading}</p>
      )}
      <div className={`luxury-divider ${centered ? '' : 'ml-0'}`} aria-hidden />
    </div>
  );
}
