'use client';

interface SectionVisibilityProps {
  isVisible: boolean;
  onChange: (visible: boolean) => void;
}

export function SectionVisibilityToggle({ isVisible, onChange }: SectionVisibilityProps) {
  return (
    <label className="flex items-center gap-2 text-sm border-b pb-4 mb-2">
      <input type="checkbox" checked={isVisible} onChange={(e) => onChange(e.target.checked)} />
      Show this section on the website
    </label>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}

export function TextField({ label, value, onChange, multiline, placeholder }: FieldProps) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      {multiline ? (
        <textarea
          className="input-field mt-1"
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="input-field mt-1"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

export function SectionLabelField({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}) {
  return (
    <TextField
      label="Section Label (small uppercase tag)"
      value={(content.sectionLabel as string) || ''}
      onChange={(v) => onChange({ ...content, sectionLabel: v })}
      placeholder="e.g. THE SCIENCE"
    />
  );
}
