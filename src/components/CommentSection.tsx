"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@iconify/react";
import AnimateOnScroll from "./AnimateOnScroll";
import type { GetCommentsResult } from "@/lib/wisp";

interface CommentSectionProps {
  slug: string;
  initialData: GetCommentsResult;
}

export default function CommentSection({ slug, initialData }: CommentSectionProps) {
  const [comments] = useState(initialData.comments);
  const [config] = useState(initialData.config);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [allowEmailUsage, setAllowEmailUsage] = useState(true);

  if (!config.enabled) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!author.trim() || !email.trim() || !content.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/wisp/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          author: author.trim(),
          email: email.trim(),
          content: content.trim(),
          allowEmailUsage,
          ...(config.allowUrls && url.trim() ? { url: url.trim() } : {}),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || data.message || `Request failed (${res.status})`);
      }

      setSubmitted(true);
      setAuthor("");
      setEmail("");
      setUrl("");
      setContent("");
      setAllowEmailUsage(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-base" id="comments">
      <AnimateOnScroll>
        <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tighter text-on-surface mb-8">
          Share Your Thoughts
        </h2>
      </AnimateOnScroll>

      {comments.length > 0 ? (
        <AnimateOnScroll className="mb-10 space-y-4" delay={0.1}>
          {comments.map((comment) => (
            <div key={comment.id}>
              {comment.parent && (
                <div className="ml-6 sm:ml-8 border-l-2 border-outline-variant/20 pl-4 sm:pl-6 mb-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon icon="ion:chatbubble-ellipses-outline" width={12} className="text-on-surface-variant/40" />
                    <span className="font-label text-[11px] text-on-surface-variant/40">
                      In reply to {comment.parent.author}
                    </span>
                  </div>
                  <p className="font-body text-sm text-on-surface-variant/60 leading-relaxed line-clamp-2">
                    {comment.parent.content}
                  </p>
                </div>
              )}
              <div className="bg-surface-container-low rounded-2xl p-5 inner-glow">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-headline font-semibold text-xs text-primary">
                        {comment.author.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-headline font-semibold text-sm text-on-surface truncate">
                      {comment.author}
                    </span>
                  </div>
                  <span className="font-label text-[11px] text-on-surface-variant/60 flex-shrink-0">
                    {Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(comment.createdAt))}
                  </span>
                </div>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </AnimateOnScroll>
          ) : (
            <AnimateOnScroll delay={0.1} className="mb-10">
              <div className="bg-surface-container-low rounded-2xl p-8 sm:p-10 inner-glow text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon icon="ion:chatbubble-ellipses-outline" width={24} className="text-primary/60" />
                </div>
                <p className="font-headline font-semibold text-base text-on-surface mb-1">
                  Be the first to comment
                </p>
                <p className="font-body text-sm text-on-surface-variant">
                  Share your thoughts on this post
                </p>
              </div>
            </AnimateOnScroll>
          )}

      <AnimateOnScroll delay={0.2}>
        <div className="bg-surface-container-low rounded-2xl p-6 sm:p-8 inner-glow">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon icon="ion:shield-checkmark-outline" width={28} className="text-primary" />
              </div>
              <h3 className="font-headline font-semibold text-lg text-on-surface mb-2">
                Pending email verification
              </h3>
              <p className="font-body text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                Thanks for your comment! Please check your email to verify and post it. If you don&apos;t see it in your inbox, check your spam folder.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="font-headline font-bold text-lg tracking-tighter text-on-surface">
                Leave a comment
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="comment-author" className="font-label text-xs text-on-surface-variant mb-1.5 block">
                    Name <span className="text-error">*</span>
                  </label>
                  <input
                    id="comment-author"
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-surface-container rounded-xl px-4 py-2.5 font-body text-sm text-on-surface placeholder:text-on-surface-variant/40 border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="comment-email" className="font-label text-xs text-on-surface-variant mb-1.5 block">
                    Email <span className="text-error">*</span>
                  </label>
                  <input
                    id="comment-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-surface-container rounded-xl px-4 py-2.5 font-body text-sm text-on-surface placeholder:text-on-surface-variant/40 border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
                  />
                </div>
              </div>

              {config.allowUrls && (
                <div>
                  <label htmlFor="comment-url" className="font-label text-xs text-on-surface-variant mb-1.5 block">
                    Website <span className="text-on-surface-variant/40">(optional)</span>
                  </label>
                  <input
                    id="comment-url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full bg-surface-container rounded-xl px-4 py-2.5 font-body text-sm text-on-surface placeholder:text-on-surface-variant/40 border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
                  />
                </div>
              )}

              <div>
                <label htmlFor="comment-content" className="font-label text-xs text-on-surface-variant mb-1.5 block">
                  Comment <span className="text-error">*</span>
                </label>
                <textarea
                  id="comment-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={4}
                  className="w-full bg-surface-container rounded-xl px-4 py-2.5 font-body text-sm text-on-surface placeholder:text-on-surface-variant/40 border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 resize-y min-h-[100px]"
                />
              </div>

              {config.signUpMessage && (
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={allowEmailUsage}
                    onChange={(e) => setAllowEmailUsage(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-outline-variant/40 bg-surface-container text-primary focus:ring-primary/50 focus:ring-offset-0"
                  />
                  <span className="font-body text-xs text-on-surface-variant leading-relaxed group-hover:text-on-surface transition-colors">
                    {config.signUpMessage}
                  </span>
                </label>
              )}

              {error && (
                <div className="flex items-center gap-2 text-sm text-error bg-error/10 rounded-xl px-4 py-3">
                  <Icon icon="ion:alert-circle-outline" width={16} className="flex-shrink-0 text-error" />
                  <span className="font-body">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Icon icon="ion:chatbubble-ellipses-outline" width={15} />
                    Post Comment
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </AnimateOnScroll>
    </section>
  );
}
