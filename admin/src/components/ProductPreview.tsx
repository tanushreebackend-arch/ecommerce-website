'use client';

interface ProductPreviewProps {
  product: Record<string, unknown>;
}

export default function ProductPreview({ product }: ProductPreviewProps) {
  const benefits = (product.benefits as string[]) || [];
  const badge = product.badge as string | undefined;

  return (
    <div className="card sticky top-6">
      <h2 className="font-semibold mb-4">Live Preview</h2>
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        {badge && (
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded mb-2">
            {badge}
          </span>
        )}
        <h3 className="font-bold text-lg text-gray-900 leading-tight">
          {(product.name as string) || 'Product Name'}
        </h3>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl font-bold text-brand">₹{((product.salePrice as number) || 999).toLocaleString('en-IN')}</span>
          {(product.mrp as number) > 0 && (
            <span className="text-sm text-gray-400 line-through">₹{(product.mrp as number).toLocaleString('en-IN')}</span>
          )}
        </div>
        {(product.ratingText as string) && (
          <p className="text-xs text-amber-600 mt-1">⭐ {(product.ratingText as string)}</p>
        )}
        {benefits.filter(Boolean).length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {benefits.filter(Boolean).slice(0, 4).map((b, i) => (
              <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                <span className="text-emerald-600 shrink-0">✓</span>
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-3">Preview updates as you type.</p>
    </div>
  );
}
