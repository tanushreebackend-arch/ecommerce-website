'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  compact?: boolean;
  defaultOpen?: number | null;
}

export default function FaqAccordion({ items, compact = false, defaultOpen = null }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${compact ? 'shadow-none' : 'shadow-sm'}`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className={`w-full flex items-center justify-between gap-3 text-left hover:bg-gray-50/80 transition-colors ${
                compact ? 'px-3 py-3' : 'px-5 py-4'
              }`}
              aria-expanded={isOpen}
            >
              <span className={`font-body font-semibold text-gray-900 pr-2 ${compact ? 'text-sm' : 'text-[15px]'}`}>
                {item.question}
              </span>
              <span className="shrink-0 w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-brand">
                {isOpen ? <Minus size={14} /> : <Plus size={14} />}
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p
                  className={`text-gray-600 leading-relaxed font-body border-t border-gray-100 ${
                    compact ? 'px-3 pb-3 pt-2 text-xs' : 'px-5 pb-5 pt-4 text-sm'
                  }`}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
