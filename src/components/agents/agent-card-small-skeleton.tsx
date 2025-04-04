import type React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Agent } from "@/interfaces/agent.interface"

interface AgentCardSmallProps {
  agent?: Agent
  isLoading?: boolean
}

const AgentCardSmallSkeleton = () => {
  return (
    <Card className="w-[120px] h-[120px] bg-white">
      <CardContent className="p-3 h-full flex flex-col justify-between">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-8" />
        </div>
      </CardContent>
    </Card>
  )
}

const AgentCardSmall = ({ agent, isLoading }: AgentCardSmallProps) => {
  const router = useRouter()

  if (isLoading || !agent) {
    return <AgentCardSmallSkeleton />
  }

  return (
    <Card 
      className="w-[120px] h-[120px] cursor-pointer bg-white hover:shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
      onClick={() => router.push(`/agent/${agent.id}`)}
    >
      <CardContent className="p-3 h-full flex flex-col justify-between">
        <div className="relative h-8 w-8 rounded-full overflow-hidden">
          <Image 
            src={agent.image || "/placeholder.svg"} 
            alt={agent.name} 
            fill 
            className="object-cover"
          />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {agent.name}
          </h3>
          <div className={cn(
            "flex items-center text-xs font-medium",
            agent.pnl >= 0 ? "text-green-600" : "text-red-600"
          )}>
            {agent.pnl >= 0 ? (
              <ArrowUpRight size={12} className="mr-0.5" />
            ) : (
              <ArrowDownRight size={12} className="mr-0.5" />
            )}
            {Math.abs(agent.pnl)}%
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AgentCardSmall 