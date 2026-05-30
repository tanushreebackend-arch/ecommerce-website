'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { configureQuillEditor, QUILL_MODULES, QUILL_FORMATS } from '@/lib/quillConfig';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
  useEffect(() => {
    configureQuillEditor();
  }, []);

  return (
    <div className="rich-text-editor w-full bg-white rounded overflow-hidden border border-gray-200">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={QUILL_MODULES}
        formats={QUILL_FORMATS}
        className="w-full"
        style={{ minHeight: '400px', width: '100%' }}
      />
    </div>
  );
}
