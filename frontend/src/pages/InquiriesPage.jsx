import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  Building2,
  Package,
  Calendar,
  CheckCheck,
  User,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { inquiriesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';

export default function InquiriesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialInquiryId = searchParams.get('id');

  const [inquiries, setInquiries] = useState([]);
  const [activeInquiryId, setActiveInquiryId] = useState(initialInquiryId ? Number(initialInquiryId) : null);
  const [activeThread, setActiveThread] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadInquiriesList = async () => {
    try {
      const res = await inquiriesAPI.getAll();
      setInquiries(res.data);
      if (res.data.length > 0 && !activeInquiryId) {
        setActiveInquiryId(res.data[0].id);
      }
    } catch (err) {
      setError('Could not load inquiries list.');
    } finally {
      setLoadingList(false);
    }
  };

  const loadThread = async (inqId) => {
    setLoadingThread(true);
    try {
      const res = await inquiriesAPI.getById(inqId);
      setActiveThread(res.data);
      setTimeout(scrollToBottom, 100);
      // update unread in local list
      setInquiries(prev => prev.map(inq => inq.id === inqId ? { ...inq, unread_count: 0 } : inq));
    } catch (err) {
      setError('Could not load inquiry messages.');
    } finally {
      setLoadingThread(false);
    }
  };

  useEffect(() => {
    loadInquiriesList();
  }, []);

  useEffect(() => {
    if (activeInquiryId) {
      loadThread(activeInquiryId);
    }
  }, [activeInquiryId]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !activeInquiryId) return;

    setSendingReply(true);
    try {
      const res = await inquiriesAPI.sendReply(activeInquiryId, {
        content: replyMessage.trim()
      });
      // Append message to activeThread
      setActiveThread(prev => ({
        ...prev,
        messages: [...(prev?.messages || []), res.data]
      }));
      setReplyMessage('');
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      setError('Failed to send reply. Please try again.');
    } finally {
      setSendingReply(false);
    }
  };

  if (loadingList) return <LoadingSpinner message="Loading active industrial negotiations..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Negotiation & Logistics Hub
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Direct Material Inquiries & Chat
        </h1>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      {inquiries.length === 0 ? (
        <EmptyState
          title="No active inquiry conversations"
          description="Send an inquiry on any material in the marketplace to start discussing logistics, pickup, and pricing."
          actionText="Browse Marketplace Materials"
          actionLink="/marketplace"
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[700px]">
          
          {/* Left Sidebar: Threads List */}
          <div className="border-r border-slate-200/80 flex flex-col h-full bg-slate-50/50">
            <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Active Discussions ({inquiries.length})
              </span>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
              {inquiries.map((inq) => {
                const isActive = inq.id === activeInquiryId;
                const counterparty = inq.buyer_id === user?.id ? inq.supplier_company : inq.buyer_company;

                return (
                  <button
                    key={inq.id}
                    onClick={() => setActiveInquiryId(inq.id)}
                    className={`w-full text-left p-4 transition flex flex-col space-y-1.5 ${
                      isActive
                        ? 'bg-emerald-50/80 border-l-4 border-emerald-600'
                        : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-xs text-slate-900 line-clamp-1">
                        {counterparty || "Industrial Partner"}
                      </span>
                      {inq.unread_count > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white animate-pulse">
                          {inq.unread_count} new
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] font-medium text-emerald-800 line-clamp-1">
                      {inq.listing_title}
                    </p>

                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {inq.latest_message || inq.subject}
                    </p>

                    <span className="text-[10px] text-slate-400">
                      {new Date(inq.updated_at).toLocaleDateString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Area: Active Chat Window */}
          <div className="md:col-span-2 flex flex-col h-full bg-white">
            {activeThread ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-white z-10">
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      {activeThread.buyer_id === user?.id ? activeThread.supplier_company : activeThread.buyer_company}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <span>Stream: <strong className="text-slate-700">{activeThread.listing_title}</strong></span>
                      <Link
                        to={`/listings/${activeThread.listing_id}`}
                        target="_blank"
                        className="text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-0.5 text-[11px]"
                      >
                        <span>View listing</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
                  {loadingThread ? (
                    <LoadingSpinner message="Fetching message history..." />
                  ) : activeThread.messages?.length === 0 ? (
                    <p className="text-center text-xs text-slate-400 py-12">No messages in thread yet.</p>
                  ) : (
                    activeThread.messages.map((msg) => {
                      const isMe = msg.sender_id === user?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <span className="text-[10px] text-slate-400 mb-1 px-1">
                            {msg.sender_company} &bull; {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <div
                            className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                              isMe
                                ? 'bg-emerald-600 text-white rounded-tr-none shadow-2xs'
                                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs'
                            }`}
                          >
                            <p className="whitespace-pre-line">{msg.content}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Form */}
                <form
                  onSubmit={handleSendReply}
                  className="p-4 border-t border-slate-200/80 bg-white flex items-center gap-2"
                >
                  <input
                    type="text"
                    required
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your response regarding delivery, COA specs, or purchase terms..."
                    className="flex-1 px-4 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    disabled={sendingReply || !replyMessage.trim()}
                    className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                Select an inquiry from the left to view the negotiation thread.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
