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
    <div className={`mb-12 md:mb-16 ${centered ? 'text-center' : ''} ${className}`}>
      {label && (
        <p className="section-subheading mb-4">{label}</p>
      )}
      <div className={`heading-decor ${centered ? 'mx-auto' : ''}`} aria-hidden />
      <h2 className="section-heading">{children}</h2>
      {subheading && (
        <p className="section-body-text mt-6 mx-auto">{subheading}</p>
      )}
      <div className={`luxury-divider mt-8 ${centered ? '' : 'ml-0'}`} aria-hidden />
    </div>
  );
}
