import type React from "react"
import { Skeleton } from "@/components/ui/skeleton"

const AgentCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center">
      {/* Left section: Avatar and Name */}
      <div className="flex items-center">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="ml-3">
          <Skeleton className="h-5 w-24 mb-1" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Middle section: Chart */}
      <div className="flex-1 mx-6">
        <Skeleton className="h-12 w-full" />
      </div>

      {/* Right section: Compact Metrics */}
      <div className="flex flex-col items-end">
        <Skeleton className="h-4 w-16 mb-1" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}

export default AgentCardSkeleton

