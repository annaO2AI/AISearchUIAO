// "use client"

// import { useEffect } from "react"
// import { useRouter } from "next/navigation"

// export default function AuthCallbackPage() {
//   const router = useRouter()

//   useEffect(() => {
//     const url = new URL(window.location.href)
//     const token = url.searchParams.get("token")

//     if (token) {
//       document.cookie = `access_token=${token}; path=/`

//       // Redirect user to your dashboard or home page
//       router.push("/")
//     } else {
//       // Redirect to login with error if no token
//       router.push("/error=missing_token")
//     }
//   }, [])

//   return <p>Logging in...</p>
// }


// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function AuthCallbackPage() {
//   const router = useRouter();

//   useEffect(() => {
//     // Ensure window is available (client-side only)
//     if (typeof window === "undefined") return;

//     const url = new URL(window.location.href);
//     const token = url.searchParams.get("token");

//     if (token) {
//       document.cookie = `access_token=${token}; path=/; secure; samesite=strict`;
//       router.replace("/"); // Use replace to avoid history entry
//     } else {
//       router.replace("/?error=missing_token"); // Consistent redirect path
//     }
//   }, [router]); // Added router to dependencies

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <p className="text-gray-600">Logging in...</p>
//     </div>
//   );
// }

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

    if (error) {
      console.error("Authentication error:", error);
      router.replace("/?error=auth_failed");
      return;
    }

    if (token) {
      document.cookie = `access_token=${token}; path=/; secure; samesite=strict`;
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