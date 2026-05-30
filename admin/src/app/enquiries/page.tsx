'use client';

import { Fragment, useCallback, useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

type EnquiryStatus = 'unread' | 'read' | 'replied';

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  isRead: boolean;
  status?: EnquiryStatus;
  createdAt: string;
}

function getStatus(enquiry: Enquiry): EnquiryStatus {
  if (enquiry.status) return enquiry.status;
  return enquiry.isRead ? 'read' : 'unread';
}

function StatusBadge({ status }: { status: EnquiryStatus }) {
  if (status === 'replied') {
    return (
      <span className="inline-block px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide rounded bg-black text-white border border-black">
        Replied
      </span>
    );
  }
  if (status === 'read') {
    return (
      <span className="inline-block px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide rounded bg-[#F5F5F5] text-[#555555] border border-[#E8E8E8]">
        Read
      </span>
    );
  }
  return (
    <span className="inline-block px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide rounded bg-white text-[#999999] border border-[#999999]">
      Unread
    </span>
  );
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [search, setSearch] = useState('');
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const load = useCallback(() => {
    adminApi.getEnquiries(search).then(setEnquiries).catch(console.error);
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  const markAsRead = async (id: string, currentStatus: EnquiryStatus) => {
    if (currentStatus !== 'unread') return;
    try {
      await adminApi.markEnquiryRead(id, true);
      setEnquiries((prev) =>
        prev.map((e) =>
          e._id === id ? { ...e, isRead: true, status: 'read' } : e
        )
      );
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id: string) => {
    await adminApi.deleteEnquiry(id);
    toast.success('Deleted');
    if (replyingId === id) {
      setReplyingId(null);
      setReplyText('');
    }
    load();
  };

  const handleSendReply = async (id: string) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply message');
      return;
    }
    setSendingReply(true);
    try {
      const updated = await adminApi.replyEnquiry(id, replyText.trim()) as Enquiry;
      toast.success('Reply sent!');
      setEnquiries((prev) =>
        prev.map((e) => (e._id === id ? { ...e, ...updated, status: 'replied', isRead: true } : e))
      );
      setReplyingId(null);
      setReplyText('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Enquiry Inbox</h1>
        <input
          className="input-field w-64"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Phone</th>
              <th className="pb-3 pr-4">Message</th>
              <th className="pb-3 pr-4">Date</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((e) => {
              const status = getStatus(e);
              const isReplyOpen = replyingId === e._id;

              return (
                <Fragment key={e._id}>
                  <tr
                    onClick={() => markAsRead(e._id, status)}
                    className={`border-b cursor-pointer transition-colors ${
                      status === 'unread' ? 'bg-blue-50/30 hover:bg-blue-50/50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="py-3 pr-4 font-medium">{e.name}</td>
                    <td className="py-3 pr-4">{e.email}</td>
                    <td className="py-3 pr-4">{e.phone || '—'}</td>
                    <td className="py-3 pr-4 max-w-xs truncate" title={e.message}>
                      {e.message}
                    </td>
                    <td className="py-3 pr-4 text-gray-500">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={status} />
                    </td>
                    <td className="py-3" onClick={(ev) => ev.stopPropagation()}>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (isReplyOpen) {
                              setReplyingId(null);
                              setReplyText('');
                            } else {
                              setReplyingId(e._id);
                              setReplyText('');
                            }
                          }}
                          className="text-green-700 text-xs font-medium hover:underline"
                        >
                          Reply
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(e._id)}
                          className="text-red-500 text-xs hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isReplyOpen && (
                    <tr key={`${e._id}-reply`} className="border-b bg-gray-50/80">
                      <td colSpan={7} className="py-4 px-2">
                        <div className="max-w-2xl" onClick={(ev) => ev.stopPropagation()}>
                          <p className="text-xs text-gray-500 mb-2">
                            Replying to <strong>{e.email}</strong>
                          </p>
                          <textarea
                            className="input-field w-full resize-none"
                            rows={4}
                            placeholder="Type your reply here..."
                            value={replyText}
                            onChange={(ev) => setReplyText(ev.target.value)}
                          />
                          <button
                            type="button"
                            disabled={sendingReply}
                            onClick={() => handleSendReply(e._id)}
                            className="btn-admin mt-3"
                          >
                            {sendingReply ? 'Sending...' : 'Send Reply'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
