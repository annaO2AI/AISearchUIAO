"use client"

import { ReactNode, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Sidebar from "../components/dashboard/Sidebar"
import { DashboardProvider } from "../context/DashboardContext"
import Layout from "./components/Layout"

export default function TalentAcquisitionPage({ children }: { children?: ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(true)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed")
    if (stored !== null) setCollapsed(stored === "true")
  }, [])

  const toggleCollapse = () => {
    const newCollapsed = !collapsed
    localStorage.setItem("sidebar-collapsed", String(newCollapsed))
    setCollapsed(newCollapsed)
  }

  const isSidebarExpanded = !collapsed || hovered
  const sidebarWidth = isSidebarExpanded ? 256 : 64

  // Show sidebar on the talent-acquisition page
  const showSidebar = pathname === "/talent-acquisition"

  return (
    <DashboardProvider>
      <div className="flex min-h-screen overflow-hidden">
        {showSidebar && (
          <Sidebar
            collapsed={collapsed}
            hovered={hovered}
            toggleSidebar={toggleCollapse}
            setHovered={setHovered}
          />
        )}
        <div
          className="flex flex-col flex-1 transition-all duration-300 ease-in-out"
          style={{ marginLeft: showSidebar ? sidebarWidth : 0 }}
        >
            <Layout />
        </div>
      </div>
    </DashboardProvider>
  )
}