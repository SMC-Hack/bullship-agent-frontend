import AgentCard from "@/components/agents/agent-card"
import AgentCardSkeleton from "../agents/agent-card-skeleton"
import { Agent } from "@/interfaces/agent.interface"

interface TrendingAgentsProps {
  agents?: Agent[] | null | undefined;
  isLoading?: boolean;
}

export default function TrendingAgents({ agents, isLoading }: TrendingAgentsProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        Trending Agents
      </h2>
      <div className="space-y-4">
        {
          !agents && (
            Array.from({ length: 3 }).map((_, index) => (
              <AgentCardSkeleton key={index} />
            ))
          )
        }
        {
          agents && (
            agents?.map((agent) => (
              <AgentCard key={agent.id} agent={agent} isLoading={isLoading} />
            ))
          )
        }
      </div>
    </div>
  )
} 