"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface FeedbackItem {
  id: string;
  studentName: string;
  message: string;
  rating: number;
  createdAt: Date;
}

interface FeedbackSectionProps {
  feedbacks: FeedbackItem[];
}

export default function FeedbackSection({ feedbacks }: FeedbackSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  const avgRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
      : "0.0";

  return (
    <div ref={containerRef}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Student Feedback</h2>
          <p className="text-sm text-slate-500">
            {feedbacks.length} reviews · {avgRating} avg rating
          </p>
        </div>
      </div>

      {feedbacks.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <p className="text-slate-500">No feedback yet</p>
          <p className="text-sm text-slate-400 mt-1">Student feedback will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="bg-white rounded-lg border border-slate-100 p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-slate-800">{feedback.studentName}</p>
                  <p className="text-xs text-slate-500">
                    {feedback.createdAt.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ${
                        i < feedback.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
                      }`}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-600">{feedback.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
