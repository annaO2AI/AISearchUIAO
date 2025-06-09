"use client";

import {
  SentimentChart,
  SentimentScoreGauge,
  ActionItemsList,
  SpeakerInsights,
  CallSummaryCard,
  CallCard,
  OSCard,
  ProgressBar,
  Dashbordmain // Corrected import
} from "./dashboard/index";
import { useDashboard } from "../context/DashboardContext";
import SentimentScoreCard from "./dashboard/cards/SentimentScoreCard";
import { SentimentScoreChart } from "./dashboard/SentimentScoreGauge";
import clsx from "clsx"; // For conditional class names
import { useEffect, useState } from "react";
import { decodeJWT } from "@/app/utils/decodeJWT"
import { API_ROUTES } from "../constants/api"
import { fetchWithAuth } from "../utils/axios"




const Dashboard = () => {
  const { graphData, loading, selectedAudio, hasProcessed, setHasProcessed, resetDashboard } = useDashboard();
  const showDashboardMain = !loading && !hasProcessed;
  const showAudioInsights = !loading && graphData?.sentiment_chunks?.length > 0;
  const [progress, setProgress] = useState(0);

  const [username, setUsername] = useState<string | null>(null)
  const [useremail, setUseremail] = useState<string | null>(null)
  const [useAccess, setUseAccess] = useState<Record<string, string>>({})
  const [loadinguse, setLoading] = useState(true)

  useEffect(() => {
    const cookies = document.cookie.split(";").map((c) => c.trim())
    const token = cookies
      .find((c) => c.startsWith("access_token="))
      ?.split("=")[1]

    if (!token) {
      console.log("No access token found in cookies")
      setLoading(false)
      return
    }

    console.log("Access token:", token)

    const decoded = decodeJWT(token)
    if (!decoded) {
      console.log("Failed to decode JWT")
      setLoading(false)
      return
    }

    console.log('Decoded JWT:', decoded)

    if (decoded?.name) {
      setUsername(decoded.name)
      console.log("Username set:", decoded.name)
    }

    if (decoded?.email || decoded?.Email || decoded?.user_email) {
      setUseremail(decoded.email || decoded.Email || decoded.user_email)
      console.log("Useremail set:", decoded.email || decoded.Email || decoded.user_email)
    } else {
      console.log("No email found in decoded JWT")
    }
  }, [])


  useEffect(() => {
    const fetchUseaccess = async () => {
      if (!useremail) {
        console.log("Skipping API call: useremail is not yet set")
        setLoading(false)
        return
      }

      const url = `${API_ROUTES.useaccess}?email=${useremail}`
      console.log("Fetching user role from:", url)

      try {
        const res = await fetchWithAuth(url)
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`)
        }
        const data = await res.json()
        console.log("User role response:", data)
        setUseAccess(data)
      } catch (err) {
        if (err instanceof Error) {
          console.error("Failed to fetch user role:", err.message)
        } else {
          console.error("Failed to fetch user role:", err)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUseaccess()
  }, [useremail])


useEffect(() => {
  let timer: NodeJS.Timeout | undefined;
  if (loading) {
    setProgress(10);
    timer = setInterval(() => {
      setProgress((prev) => Math.min(prev + 80 / 60, 90));
    }, 100);
  } else {
    setProgress(0);
  }
  return () => clearInterval(timer!);
}, [loading]);
  
  return (
    <>
    {/* Admin container  dashboard */}
      {useAccess.role !== "Admin" && (
      <div className="relative z-0 max-w-7xl mx-auto space-y-6">
      
         {/* Audio Insights: Shown when data is available */}
        <div
          className={clsx(
            "transition-opacity duration-300",
            showAudioInsights ? "opacity-100 block audio-insights-main" : "opacity-0 hidden"
          )}
        >
          {showAudioInsights && (
            <div className="mt-6 pt-4 audio-insights-main">
              <h1 className="text-2xl font-bold  mb-4 mt-6 pt-6 ot-title">
                Audio Insights
              </h1>
               {/* <span className="text-gray-700 font-normal">
                  Hi, {username || 'User'} {useAccess.role ? `(${useAccess.role})` : loadinguse ? '(...)' : ''}
              </span> */}
              <div className="flex flex-row gap-6 mb-6">
                <CallCard
                  audioId={selectedAudio || ""}
                  customerName={graphData?.Customer_name || ""}
                  agentName=""
                />
                <OSCard sentiment={graphData?.sentiment_score.toString()} />
                <SentimentScoreCard score={graphData?.sentiment_score} />
                <SentimentScoreGauge
                  sentimentScore={graphData?.sentiment_score}
                />
              </div>
              <div className="w-full mb-6">
                <CallSummaryCard summary={graphData?.call_summary} />
              </div>
              <div className="w-full mb-6">
                <SpeakerInsights speakerInsights={graphData?.speaker_insights} agentRating={graphData?.Agent_rating} role={useAccess.role} customerName={graphData?.Customer_name || ""} />
              </div>
              <div className="flex flex-col gap-6 flex p-12 from-indigo-50 to-blue-50 boxshadow rounded-xl shadow-sm bg-white gap-10 mb-6">
                <div>
                  <h2 className="ot-title font-semibold text-xl">
                   Call Sentiment Over Time
                  </h2>
                  <p className="text-base osubtitle">
                    This chart shows the sentiment score over time based on the
                    audio file selected.
                  </p>
                </div>
                <SentimentChart data={graphData?.sentiment_chunks} />
              </div>
              <SentimentScoreChart sentimentScore={graphData?.sentiment_score} />
              <div className="flex flex-row gap-6  mt-6">
                <div className="w-full">
                  <ActionItemsList
                    actionItems={graphData?.action_items ?? []}
                    emailSent={graphData?.email_sent ?? []}
                  />
                </div>
              </div>
              {/* Optional Reset Button */}
              <div className="text-center">
                <button
                  onClick={() => resetDashboard()}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Process New Audio
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dashboardmain: Shown only initially */}
        <div
          className={clsx(
            "transition-opacity duration-300",
            showDashboardMain ? "opacity-100 block Dashbordmain-main" : "opacity-0 hidden"
          )}
        >
          {showDashboardMain && (
            <div>
              <Dashbordmain />
            </div>
          )}
        </div>
        
        {/* Loading message */}
        {loading && (
          <div className="mt-4 text-sm text-gray-500">
            <ProgressBar progress={progress} />
          </div>
        )}

        {/* Fallback for no data after processing */}
        {!loading && hasProcessed && (!graphData || graphData?.sentiment_chunks?.length === 0) && (
          <div className="text-center">
            <p className="mt-4 text-sm text-red-500">
              No data available. Please try processing another audio file.
            </p>
            <button
              onClick={() => resetDashboard()}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 "
            >
              Process New Audio
            </button>
          </div>
        )}
      </div>
      )}
      {/* User container  dashboard */}
      {useAccess.role === "User" && (
      <div className="relative z-0 max-w-7xl mx-auto space-y-6">
      
        {/* Audio Insights: Shown when data is available */}
        <div
          className={clsx(
            "transition-opacity duration-300",
            showAudioInsights ? "opacity-100 block audio-insights-main" : "opacity-0 hidden"
          )}
        >
          {showAudioInsights && (
            <div className="mt-6 pt-4 audio-insights-main">
              <h1 className="text-2xl font-bold  mb-4 mt-6 pt-6 ot-title">
                Audio Insights
              </h1>
              <div className="w-full mb-6">
                <CallSummaryCard summary={graphData?.call_summary} />
              </div>
              <div className="w-full mb-6">
                <SpeakerInsights speakerInsights={graphData?.speaker_insights} agentRating={graphData?.Agent_rating} role={useAccess.role} customerName={graphData?.Customer_name || ""}/>
              </div>
              <div className="flex flex-row gap-6  mt-6">
                <div className="w-full">
                  <ActionItemsList
                    actionItems={graphData?.action_items ?? []}
                    emailSent={graphData?.email_sent ?? []}
                  />
                </div>
              </div>
              {/* Optional Reset Button */}
              <div className="text-center">
                <button
                  onClick={() => resetDashboard()}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Process New Audio
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dashboardmain: Shown only initially */}
        <div
          className={clsx(
            "transition-opacity duration-300",
            showDashboardMain ? "opacity-100 block Dashbordmain-main" : "opacity-0 hidden"
          )}
        >
          {showDashboardMain && (
            <div>
              <Dashbordmain />
            </div>
          )}
        </div>
        
        {/* Loading message */}
        {loading && (
          <div className="mt-4 text-sm text-gray-500">
            <ProgressBar progress={progress} />
          </div>
        )}

        {/* Fallback for no data after processing */}
        {!loading && hasProcessed && (!graphData || graphData?.sentiment_chunks?.length === 0) && (
          <div className="text-center">
            <p className="mt-4 text-sm text-red-500">
              No data available. Please try processing another audio file.
            </p>
            <button
              onClick={() => resetDashboard()}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 "
            >
              Process New Audio
            </button>
          </div>
        )}
      </div>
      )}
    </>
  );
};

export default Dashboard;