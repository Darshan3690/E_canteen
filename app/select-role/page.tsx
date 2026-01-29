"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function SelectRolePage() {
  const [role, setRole] = useState<"student" | "canteen_manager">("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  // Check if user already has a role and redirect
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const existingRole = user.publicMetadata?.role as string | undefined;
      if (existingRole === "student") {
        router.push("/menu");
      } else if (existingRole === "manager") {
        router.push("/manager");
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  // Clerk loading state
  if (!isLoaded) {
    return (
      <div style={{ padding: 24, maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Not signed in
  if (!isSignedIn) {
    router.push("/login");
    return null;
  }

  const submitRole = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to set role");
        setLoading(false);
        return;
      }

      // Redirect based on role
      router.push(role === "student" ? "/menu" : "/manager");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 400, margin: "0 auto" }}>
      <h1>🎓 Select Your Role</h1>
      <p style={{ color: "#888", marginBottom: 24 }}>
        Choose how you want to use E-Canteen
      </p>

      <div style={{ marginBottom: 16 }}>
        <label
          style={{
            display: "flex",
            gap: 12,
            padding: 16,
            border: role === "student" ? "2px solid #2196F3" : "1px solid #333",
            borderRadius: 8,
            cursor: "pointer",
            marginBottom: 12,
            background: role === "student" ? "#1a2a3a" : "transparent",
          }}
        >
          <input
            type="radio"
            checked={role === "student"}
            onChange={() => setRole("student")}
          />
          <div>
            <strong>🍽️ Student</strong>
            <p style={{ margin: 0, fontSize: 14, color: "#888" }}>
              Browse menu and place orders
            </p>
          </div>
        </label>

        <label
          style={{
            display: "flex",
            gap: 12,
            padding: 16,
            border: role === "canteen_manager" ? "2px solid #4CAF50" : "1px solid #333",
            borderRadius: 8,
            cursor: "pointer",
            background: role === "canteen_manager" ? "#1a3a2a" : "transparent",
          }}
        >
          <input
            type="radio"
            checked={role === "canteen_manager"}
            onChange={() => setRole("canteen_manager")}
          />
          <div>
            <strong>🏪 Canteen Manager</strong>
            <p style={{ margin: 0, fontSize: 14, color: "#888" }}>
              Manage menu, orders, and inventory
            </p>
          </div>
        </label>
      </div>

      {error && <p style={{ color: "#f44", marginBottom: 16 }}>{error}</p>}

      <button
        onClick={submitRole}
        disabled={loading}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 8,
          border: "none",
          background: loading ? "#555" : "#4CAF50",
          color: "#fff",
          fontSize: 16,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Setting up..." : "Continue"}
      </button>
    </div>
  );
}
