import {
  HomeIcon,
  BarChart2Icon,
  SettingsIcon,
  MenuIcon,
  XIcon,
} from "lucide-react"
import clsx from "clsx"
import { AudioSelector, ProcessButton } from "./index"
import { useDashboard } from "../../context/DashboardContext"
import { Rightarrow, Leftarrow, HrIcon, ProcurememntSearchIcion, FinanaceSearch, ITSearchIcon, LegalSearchIcon, ArroTabIcon } from "../../chat-ui/components/icons"
import React, { useState } from 'react';
const navItems = [
  { label: "Home", icon: HomeIcon, href: "#" },
  { label: "Reports", icon: BarChart2Icon, href: "#" },
  { label: "Settings", icon: SettingsIcon, href: "#" },
]

type SidebarProps = {
  collapsed: boolean
  hovered: boolean
  toggleSidebar: () => void
  setHovered: (hovered: boolean) => void
}

export default function Sidebar({
  collapsed,
  hovered,
  toggleSidebar,
  setHovered,
}: SidebarProps) {
  const {
    selectedAudio,
    setSelectedAudio,
    graphData,
    setGraphData,
    loading,
    setLoading,
  } = useDashboard()

  const isExpanded = !collapsed 
    const [openMenu, setOpenMenu] = useState<string | null>(null);
  
    const toggleMenu = (menu: string) => {
      setOpenMenu(openMenu === menu ? null : menu);
    };
  
  return (
    <aside
      // onMouseEnter={() => setHovered(true)}
      // onMouseLeave={() => setHovered(false)}
      className={clsx(
        "h-screen fixed top-0 left-0 bg-white border-r shadow transition-all duration-300 z-40 ease-in-out",
        isExpanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex justify-end p-3">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-gray-900 main-toggleSidebar"
        >
          {isExpanded ? <Rightarrow /> : <Leftarrow />}
        </button>
      </div>
      <div className="w-full h-screen  text-gray-800 flex flex-col main-width-manu">
        {/* Main Menu Item with Submenu */}
        <div className="text-left">
          <button
            onClick={() => toggleMenu('humanResources')}
            className="w-full px-4 py-5 flex items-center justify-between hover:bg-gray-200 transition-colors"
          >
            <div className="flex items-center text-left gap-3">
              {isExpanded ? <> <HrIcon width={20} className="min-w-[20px]" />   HR Search </>: <HrIcon width={20} className="min-w-[20px]" /> }
            </div>
            <svg
              className={`w-4 h-4 transition-transform ${openMenu === 'humanResources' ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${openMenu === 'humanResources' ? 'max-h-60' : 'max-h-0'
              }`}
          >
            <a  href="/talent-acquisition" className="flex block px-4 py-4 hover:bg-gray-200 gap-3 bg-gray-100 min-w-[20px]">
               {isExpanded ? <> <ArroTabIcon width={20} className="min-w-[20px]" /> Talent Acquisition </>: <ArroTabIcon width={20} className="min-w-[20px]" /> }
            </a>
            <a href="#" className="block px-4 py-4 hover:bg-gray-200 flex gap-3 bg-gray-100 min-w-[20px]">
              {isExpanded ? <>  <ArroTabIcon width={20} className="min-w-[20px]"/> Performance Management</>: <ArroTabIcon width={20} className="min-w-[20px]" /> }
            </a>
            <a href="#" className="block px-4 py-4 hover:bg-gray-200 flex gap-3 bg-gray-100 min-w-[20px]">
              {isExpanded ? <>  <ArroTabIcon width={20} className="min-w-[20px]"/> Learning & Development</>: <ArroTabIcon width={20} className="min-w-[20px]" /> }
              </a>
            <a href="#" className="block px-4 py-4 hover:bg-gray-200 flex gap-3 bg-gray-100 min-w-[20px]">
               {isExpanded ? <>  <ArroTabIcon width={20} className="min-w-[20px]"/> Compensation & Benefits</>: <ArroTabIcon width={20} className="min-w-[20px]" /> }
            </a>
          </div>
        </div>

        {/* Other Menu Items */}
        <a href="#" className="px-4 py-5 flex items-center hover:bg-gray-200 transition-colors gap-2 min-w-[20px]">
         {isExpanded ? <> <ProcurememntSearchIcion width={20}/> Procurement Search </>: <ProcurememntSearchIcion width={20}/> }
        </a>
        <a href="#" className="px-4 py-5 flex items-center hover:bg-gray-200 transition-colors gap-3 min-w-[20px]">
           {isExpanded ? <> <FinanaceSearch width={20}/> Finance Search </>: <FinanaceSearch width={20}/> }
        </a>
        <a href="#" className="px-4 py-5 flex items-center hover:bg-gray-200 transition-colors gap-3 min-w-[20px]">
          {isExpanded ? <> <ITSearchIcon width={20} /> IT Search </>: <ITSearchIcon width={20} /> }
        </a>
        <a href="#" className="px-4 py-5 flex items-center hover:bg-gray-200 transition-colors gap-3 min-w-[20px]">
           {isExpanded ? <> <LegalSearchIcon width={20}/> Legal Search </>: <LegalSearchIcon width={20}/> }
        </a>
      </div>
    </aside>
  )
}
