"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = searchParams.get("token");
    const finalRedirect = searchParams.get("finalRedirect") || "https://ai-search-hr-web-exevd6bfgdfdcvdj.centralus-01.azurewebsites.net/";
    const error = searchParams.get("error");

    console.log("Callback URL:", window.location.href);
    console.log("Token:", token);
    console.log("Final Redirect:", finalRedirect);

    if (error) {
      console.error("Authentication error:", error);
      router.replace("/?error=auth_failed");
      return;
    }

    if (token) {
      document.cookie = `access_token=${token}; path=/; secure; samesite=strict`;
      console.log("Redirecting to:", decodeURIComponent(finalRedirect));
      router.replace(decodeURIComponent(finalRedirect));
    } else {
      console.error("Missing token in callback");
      router.replace("/?error=missing_token");
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Logging in...</p>
    </div>
  );
}