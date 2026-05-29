'use client';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqEditorProps {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}

export default function FaqEditor({ content, onChange }: FaqEditorProps) {
  const heading = (content.heading as string) || '';
  const items = (content.items as FaqItem[]) || [];

  const updateItems = (newItems: FaqItem[]) => {
    onChange({ ...content, items: newItems });
  };

  const updateItem = (index: number, field: keyof FaqItem, value: string) => {
    const updated = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    updateItems(updated);
  };

  const addItem = () => {
    updateItems([...items, { question: '', answer: '' }]);
  };

  const deleteItem = (index: number) => {
    updateItems(items.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newItems.length) return;
    [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
    updateItems(newItems);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm text-gray-500">Section Heading</label>
        <input
          className="input-field mt-1"
          value={heading}
          onChange={(e) => onChange({ ...content, heading: e.target.value })}
        />
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">FAQ Items ({items.length})</h3>
        <button type="button" onClick={addItem} className="btn-admin-outline text-xs">
          + Add FAQ
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">FAQ #{index + 1}</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => moveItem(index, 'up')} disabled={index === 0} className="text-xs text-gray-500 hover:text-gray-800 disabled:opacity-30">
                  ↑
                </button>
                <button type="button" onClick={() => moveItem(index, 'down')} disabled={index === items.length - 1} className="text-xs text-gray-500 hover:text-gray-800 disabled:opacity-30">
                  ↓
                </button>
                <button type="button" onClick={() => deleteItem(index)} className="text-xs text-red-500 hover:text-red-700">
                  Delete
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Question</label>
              <input
                className="input-field mt-1"
                value={item.question}
                onChange={(e) => updateItem(index, 'question', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Answer</label>
              <textarea
                className="input-field mt-1"
                rows={3}
                value={item.answer}
                onChange={(e) => updateItem(index, 'answer', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
