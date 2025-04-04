import { TrendingUp } from "lucide-react"
import AgentCard from "@/components/agents/agent-card"

interface Agent {
  id: string
  name: string
  symbol: string
  aum: number
  pnl: number
  image: string
}

interface TrendingAgentsProps {
  agents: Agent[]
}

export default function TrendingAgents({ agents }: TrendingAgentsProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        Trending Agents
      </h2>
      <div className="space-y-4">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  )
} 