"use client";

import { useState, useEffect } from "react";
import {
  deleteSubmission,
  listSubmissions,
  setSubmissionRead,
  type SubmissionItem as Submission,
} from "../lib/data";
import { Loader2, Trash2, MailOpen, Mail } from "lucide-react";


export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      setSubmissions(await listSubmissions());
    } catch (err) {
      console.error("Failed to fetch submissions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const toggleRead = async (id: string, currentStatus: boolean) => {
    try {
      await setSubmissionRead(id, !currentStatus);
      setSubmissions(submissions.map(s => s._id === id ? { ...s, isRead: !currentStatus } : s));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this submission permanently?")) return;
    try {
      await deleteSubmission(id);
      setSubmissions(submissions.filter(s => s._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  if (loading) {
    return <div className="flex justify-center h-64 items-center"><Loader2 className="animate-spin text-coral" size={48} /></div>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-navy">Contact Submissions</h2>
          <p className="text-sm text-gray-500 mt-1">Inquiries from your website&apos;s contact form.</p>
        </div>
        <div className="text-sm font-medium text-coral bg-coral/10 px-3 py-1 rounded-full">
          {submissions.filter(s => !s.isRead).length} Unread
        </div>
      </div>

      <div className="p-0">
        {submissions.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No submissions yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {submissions.map(sub => (
              <div key={sub._id} className={`p-6 transition-colors ${!sub.isRead ? 'bg-blue-50/30' : 'bg-white hover:bg-gray-50'}`}>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={`text-navy ${!sub.isRead ? 'font-bold' : 'font-semibold'}`}>{sub.name}</h3>
                      {!sub.isRead && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                      <span className="text-xs text-gray-400">{new Date(sub.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-gray-500 mb-3 flex gap-4">
                      <a href={`mailto:${sub.email}`} className="hover:text-coral transition-colors">{sub.email}</a>
                      {sub.phone && <a href={`tel:${sub.phone}`} className="hover:text-coral transition-colors">{sub.phone}</a>}
                    </div>
                    <div className="bg-white border border-gray-100 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-navy mb-2">{sub.service ? `Service: ${sub.service}` : "No service selected"}</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{sub.message}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 shrink-0">
                    <button 
                      onClick={() => toggleRead(sub._id, sub.isRead)}
                      className="p-2 text-gray-500 hover:text-navy hover:bg-gray-100 rounded-md border border-gray-200"
                      title={sub.isRead ? "Mark as unread" : "Mark as read"}
                    >
                      {sub.isRead ? <Mail size={16} /> : <MailOpen size={16} />}
                    </button>
                    <button 
                      onClick={() => handleDelete(sub._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md border border-transparent hover:border-red-100"
                      title="Delete submission"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
