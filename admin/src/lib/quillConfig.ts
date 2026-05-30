'use client';

import { PREMIUM_FONT_SLUGS } from '@/lib/premiumFonts';

let configured = false;

export function configureQuillEditor() {
  if (configured || typeof window === 'undefined') return;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Quill } = require('react-quill');

  const Font = Quill.import('formats/font');
  Font.whitelist = PREMIUM_FONT_SLUGS;
  Quill.register(Font, true);

  const Size = Quill.import('attributors/class/size');
  Size.whitelist = ['small', 'large', 'huge'];
  Quill.register(Size, true);

  configured = true;
}

export const QUILL_MODULES = {
  toolbar: [
    [{ font: PREMIUM_FONT_SLUGS }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    ['link', 'image'],
    ['blockquote', 'code-block'],
    ['clean'],
  ],
};

export const QUILL_FORMATS = [
  'font',
  'header',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'color',
  'background',
  'list',
  'bullet',
  'indent',
  'align',
  'link',
  'image',
  'blockquote',
  'code-block',
];
