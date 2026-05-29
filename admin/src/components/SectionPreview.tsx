'use client';

interface SectionPreviewProps {
  sectionName: string;
  content: Record<string, unknown>;
}

export default function SectionPreview({ sectionName, content }: SectionPreviewProps) {
  if (sectionName === 'comparison') {
    const infographic = content.infographic as { centerImage?: string; brandName?: string } | undefined;
    return (
      <div className="rounded-xl border bg-[#f7f8f5] p-4 text-center">
        <p className="text-xs text-gray-400 mb-2">Comparison Preview</p>
        <h4 className="font-bold text-sm mb-3">{(content.heading as string) || 'Why Multivitamin Isn\'t Enough'}</h4>
        {infographic?.centerImage && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={infographic.centerImage} alt="" className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow" />
        )}
        <p className="text-xs text-brand font-semibold mt-2">{infographic?.brandName}</p>
      </div>
    );
  }

  if (sectionName === 'nutrientComparison') {
    const cards = (content.cards as { nutrient: string }[]) || [];
    const productImage = content.productImage as string | undefined;
    return (
      <div className="rounded-xl border bg-[#f7f8f5] p-4">
        <p className="text-xs text-gray-400 mb-2">Nutrient Comparison Preview</p>
        <h4 className="font-bold text-sm text-center mb-3">{(content.heading as string) || 'Nutrient Comparison'}</h4>
        <div className="flex justify-center gap-2 mb-2">
          {productImage && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={productImage} alt="Ours" className="w-10 h-10 rounded-full object-cover border-2 border-white" />
          )}
          <span className="text-xs text-gray-400 self-center">used in all {cards.length} cards</span>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {cards.slice(0, 4).map((c, i) => (
            <div key={i} className="bg-brand text-white text-[10px] px-2 py-1 rounded text-center truncate">{c.nutrient}</div>
          ))}
        </div>
      </div>
    );
  }

  if (sectionName === 'faq') {
    const items = (content.items as { question: string }[]) || [];
    return (
      <div className="rounded-xl border bg-[#f7f8f5] p-4">
        <p className="text-xs text-gray-400 mb-2">FAQ Preview</p>
        <h4 className="font-bold text-sm text-center mb-3">{(content.heading as string) || 'FAQ'}</h4>
        {items.slice(0, 2).map((item, i) => (
          <div key={i} className="bg-white rounded-lg px-3 py-2 text-xs mb-1 border">{item.question}</div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-gray-50 p-4">
      <p className="text-xs text-gray-400 mb-2">Section Preview</p>
      <p className="text-sm font-semibold capitalize">{sectionName.replace(/([A-Z])/g, ' $1')}</p>
      <pre className="text-[10px] text-gray-500 mt-2 max-h-32 overflow-auto">{JSON.stringify(content, null, 2).slice(0, 300)}...</pre>
    </div>
  );
}
