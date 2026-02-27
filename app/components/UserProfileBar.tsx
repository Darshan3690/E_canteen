"use client";

import { UserButton, SignOutButton, useUser } from "@clerk/nextjs";

interface UserProfileBarProps {
  /** "light" = white/slate UI (admin, manager), "dark" = dark UI (student) */
  variant?: "light" | "dark";
}

export default function UserProfileBar({ variant = "light" }: UserProfileBarProps) {
  const { user } = useUser();
  const isDark = variant === "dark";

  return (
    <div className="flex items-center gap-3">
      {/* Name + email – hidden on mobile */}
      {user && (
        <div className="hidden sm:flex flex-col items-end">
          <span
            className={`text-sm font-semibold leading-tight ${
              isDark ? "text-white" : "text-slate-800"
            }`}
          >
            {user.firstName
              ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
              : (user.username ?? "Account")}
          </span>
          <span
            className={`text-xs leading-tight ${
              isDark ? "text-gray-400" : "text-slate-400"
            }`}
          >
            {user.primaryEmailAddress?.emailAddress}
          </span>
        </div>
      )}

      {/* Clerk avatar + profile popup */}
      <UserButton
        afterSignOutUrl="/landing"
        appearance={{
          elements: {
            avatarBox: "w-9 h-9",
          },
        }}
      />

      {/* Explicit sign-out button – hidden on mobile */}
      <SignOutButton redirectUrl="/landing">
        <button
          className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
            isDark
              ? "text-gray-300 border-gray-600 hover:bg-gray-700/50"
              : "text-slate-600 border-slate-200 hover:bg-slate-100"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Sign out
        </button>
      </SignOutButton>
    </div>
  );
}
