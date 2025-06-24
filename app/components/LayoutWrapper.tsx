"use client"

import { ReactNode, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Header from "./Header"
import HeaderAISearch from "../chat-ui/components/Header"
import Sidebar from "./dashboard/Sidebar"
import FooterAISearch from "../chat-ui/components/Footer"
import { DashboardProvider } from "../context/DashboardContext"
import PopupComponent from "../chat-ui/components/PopupComponent"
import Popupprofile from "../components/Popupprofile"
import Breadcrumbs from "./dashboard/Breadcrumbs"; // Import the new component

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [hovered, setHovered] = useState(false)

  const isAltLayout = pathname === "/chat-ui"

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

  // ✅ Show sidebar only on the homepage
  const showSidebar = pathname === "/"

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
          className="flex flex-col flex-1 transition-all duration-300 ease-in-out "
          style={{ marginLeft: showSidebar ? sidebarWidth : 0 }}
        >
            <>
              <HeaderAISearch  sidebarOpen={showSidebar && isSidebarExpanded}/>
              {/* <Popupprofile /> */}
               <PopupComponent /> 
               <Breadcrumbs /> {/* Add Breadcrumbs here */}
            </>
          <main className={`flex-1 ${isAltLayout}?mt-1:mt-16 overflow-auto p-2 backround-chat-ui`} >
            {children}
          </main>
           <FooterAISearch /> 
        </div>
      </div>
    </DashboardProvider>
  )
}
