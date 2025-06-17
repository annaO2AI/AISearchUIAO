"use client";
 
import { useEffect } from "react";
import { useRouter } from "next/navigation";
 
 
export default function AuthCallbackPage() {
  const router = useRouter();
 
  useEffect(() => {
    // Extract token from URL if needed
    const urlParams = new URLSearchParams(window.location.search);
    const returnTo = urlParams.get('returnTo') || 'https://ai-search-hr-web-exevd6bfgdfdcvdj.centralus-01.azurewebsites.net/';
   
    // Ensure the token is properly set (you might need to pass it from backend)
    router.replace(returnTo);
  }, [router]);
 
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Logging in...</p>
    </div>
  );
}