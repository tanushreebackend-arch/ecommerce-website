'use client';

import { useEffect, useRef, useState } from 'react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';
import ImageCropModal from '@/components/ImageCropModal';
import { formatDuration, formatFileSize, getVideoDuration } from '@/lib/cropImage';

interface Video {
  slot: number;
  cloudinaryUrl?: string;
  thumbnailUrl?: string;
  fileSize?: number;
  duration?: number;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>({});
  const [thumbCrop, setThumbCrop] = useState<{ slot: number; src: string; name: string } | null>(null);
  const videoInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    adminApi.getVideos().then(setVideos).catch(console.error);
  }, []);

  const handleVideoUpload = async (slot: number, file: File) => {
    const formData = new FormData();
    formData.append('video', file);
    try {
      const duration = await getVideoDuration(file);
      formData.append('duration', String(duration));
    } catch {
      /* duration optional */
    }

    setUploadProgress((p) => ({ ...p, [slot]: 0 }));
    try {
      const updated = (await adminApi.uploadVideo(slot, formData, (pct) => {
        setUploadProgress((p) => ({ ...p, [slot]: pct }));
      })) as Video;
      setVideos((prev) => {
        const exists = prev.some((v) => v.slot === slot);
        return exists ? prev.map((v) => (v.slot === slot ? updated : v)) : [...prev, updated];
      });
      toast.success(`Video ${slot} uploaded!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadProgress((p) => { const n = { ...p }; delete n[slot]; return n; });
    }
  };

  const handleThumbnailCrop = async (blob: Blob) => {
    if (!thumbCrop) return;
    const { slot } = thumbCrop;
    setThumbCrop(null);
    const formData = new FormData();
    formData.append('thumbnail', blob, 'thumbnail.jpg');
    try {
      const updated = await adminApi.uploadVideoThumbnail(slot, formData) as Video;
      setVideos((prev) => prev.map((v) => (v.slot === slot ? updated : v)));
      toast.success('Thumbnail updated!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Thumbnail upload failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Video Manager</h1>

      <p className="text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-8">
        Maximum video size: <strong>100MB</strong> | Recommended duration: <strong>30 seconds – 2 minutes</strong>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((slot) => {
          const video = videos.find((v) => v.slot === slot);
          const progress = uploadProgress[slot];

          return (
            <div key={slot} className="card">
              <h3 className="font-semibold mb-3">Video Slot {slot}</h3>
              <div className="aspect-[9/16] bg-gray-900 rounded-lg mb-4 overflow-hidden relative">
                {video?.cloudinaryUrl ? (
                  <video
                    src={video.cloudinaryUrl}
                    poster={video.thumbnailUrl}
                    className="w-full h-full object-cover"
                    controls
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">No video</div>
                )}
                {progress !== undefined && (
                  <div className="absolute inset-x-0 bottom-0 bg-black/70 p-2">
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-white text-xs text-center mt-1">Uploading {progress}%</p>
                  </div>
                )}
              </div>

              {video?.cloudinaryUrl && (
                <div className="text-xs text-gray-500 space-y-0.5 mb-3">
                  {video.fileSize && <p>Size: {formatFileSize(video.fileSize)}</p>}
                  {video.duration && <p>Duration: {formatDuration(video.duration)}</p>}
                </div>
              )}

              <input
                ref={(el) => { videoInputRefs.current[slot] = el; }}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleVideoUpload(slot, file);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                onClick={() => videoInputRefs.current[slot]?.click()}
                className="btn-admin-outline w-full text-xs mb-2"
                disabled={progress !== undefined}
              >
                Upload Video
              </button>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                id={`thumb-${slot}`}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setThumbCrop({ slot, src: URL.createObjectURL(file), name: file.name });
                  e.target.value = '';
                }}
              />
              <label htmlFor={`thumb-${slot}`} className="btn-admin-outline w-full text-xs block text-center cursor-pointer">
                Upload Thumbnail (with crop)
              </label>
            </div>
          );
        })}
      </div>

      {thumbCrop && (
        <ImageCropModal
          imageSrc={thumbCrop.src}
          fileName={thumbCrop.name}
          onClose={() => { URL.revokeObjectURL(thumbCrop.src); setThumbCrop(null); }}
          onApply={(blob) => { URL.revokeObjectURL(thumbCrop.src); handleThumbnailCrop(blob); }}
        />
      )}
    </div>
  );
}
