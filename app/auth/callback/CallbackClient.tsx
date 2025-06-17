"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      console.error("Authentication error:", error);
      router.replace("/?error=auth_failed");
      return;
    }

    if (token) {
      document.cookie = `access_token=${token}; path=/; secure; samesite=strict`;
      router.replace("/"); // Redirect to the app's root or desired page
    } else {
      router.replace("/?error=missing_token");
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Logging in...</p>
    </div>
  );
}