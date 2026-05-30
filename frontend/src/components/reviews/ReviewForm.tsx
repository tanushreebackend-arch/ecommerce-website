'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface ReviewFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ onSuccess, onCancel }: ReviewFormProps) {
  const [form, setForm] = useState({ name: '', email: '', rating: 5, title: '', text: '' });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const clearPhoto = () => {
    setPhotoFile(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const clearVideo = () => {
    setVideoFile(null);
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoPreview(null);
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setForm({ name: '', email: '', rating: 5, title: '', text: '' });
    clearPhoto();
    clearVideo();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('rating', String(form.rating));
      formData.append('title', form.title);
      formData.append('text', form.text);
      if (photoFile) formData.append('photo', photoFile);
      if (videoFile) formData.append('video', videoFile);

      await api.submitReview(formData);
      toast.success('Review submitted for approval!');
      resetForm();
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto text-left space-y-4 luxury-card p-6 mb-6">
      <input
        placeholder="Name"
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="input-luxury-box w-full"
      />
      <input
        type="email"
        placeholder="Email"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="input-luxury-box w-full"
      />
      <input
        placeholder="Review Title"
        required
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="input-luxury-box w-full"
      />
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((r) => (
          <button key={r} type="button" onClick={() => setForm({ ...form, rating: r })}>
            <Star size={20} strokeWidth={1} className={r <= form.rating ? 'star-fill' : 'star-empty'} />
          </button>
        ))}
      </div>
      <textarea
        placeholder="Your review"
        required
        rows={4}
        value={form.text}
        onChange={(e) => setForm({ ...form, text: e.target.value })}
        className="input-luxury-box w-full resize-none"
      />

      <div>
        <label className="review-upload-label">Add Photo (optional)</label>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handlePhotoChange}
          className="review-upload-input"
        />
        {photoPreview && (
          <div className="mt-3 relative">
            <Image
              src={photoPreview}
              alt="Preview"
              width={320}
              height={160}
              className="w-full max-h-[160px] object-cover border border-[#E8E8E8]"
              unoptimized
            />
            <button type="button" onClick={clearPhoto} className="review-upload-remove">
              Remove
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="review-upload-label">Add Video (optional)</label>
        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/webm"
          onChange={handleVideoChange}
          className="review-upload-input"
        />
        {videoPreview && (
          <div className="mt-3 relative">
            <video src={videoPreview} controls className="w-full max-h-[160px] bg-black" />
            <button type="button" onClick={clearVideo} className="review-upload-remove">
              Remove
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-outline flex-1 py-3">
            Cancel
          </button>
        )}
        <button type="submit" disabled={submitting} className="btn-primary flex-1 py-3">
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
}
