'use client';

import { useCallback, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { RotateCcw, RotateCw, X } from 'lucide-react';
import { getCroppedImageBlob } from '@/lib/cropImage';

export type AspectOption = '1:1' | '4:3' | '16:9' | 'free';

const ASPECT_MAP: Record<AspectOption, number | undefined> = {
  '1:1': 1,
  '4:3': 4 / 3,
  '16:9': 16 / 9,
  free: undefined,
};

interface ImageCropModalProps {
  imageSrc: string;
  fileName?: string;
  onClose: () => void;
  onApply: (blob: Blob, previewUrl: string) => void;
}

export default function ImageCropModal({ imageSrc, fileName, onClose, onApply }: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<AspectOption>('1:1');
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [applying, setApplying] = useState(false);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const handleApply = async () => {
    if (!croppedArea) return;
    setApplying(true);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedArea, rotation);
      const previewUrl = URL.createObjectURL(blob);
      onApply(blob, previewUrl);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="font-semibold">Crop & Adjust {fileName ? `— ${fileName}` : ''}</h3>
          <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="relative h-[340px] bg-gray-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={ASPECT_MAP[aspect]}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Aspect Ratio</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(ASPECT_MAP) as AspectOption[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAspect(opt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                    aspect === opt ? 'bg-green-700 text-white border-green-700' : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {opt === 'free' ? 'Free' : opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={() => setRotation((r) => r - 90)} className="btn-admin-outline flex items-center gap-1 text-xs">
              <RotateCcw size={14} /> Rotate Left
            </button>
            <button type="button" onClick={() => setRotation((r) => r + 90)} className="btn-admin-outline flex items-center gap-1 text-xs">
              <RotateCw size={14} /> Rotate Right
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-admin-outline flex-1">Cancel</button>
            <button type="button" onClick={handleApply} disabled={applying} className="btn-admin flex-1">
              {applying ? 'Applying...' : 'Apply Crop'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
