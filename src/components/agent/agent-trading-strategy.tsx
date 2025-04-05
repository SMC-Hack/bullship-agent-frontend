import { Agent } from "@/interfaces/agent.interface"

interface AgentTradingStrategyProps {
  agent: Agent
}

export default function AgentTradingStrategy({ agent }: AgentTradingStrategyProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Trading Strategy</h2>
      <div className="space-y-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-1">Main Strategy</h3>
          <p className="text-gray-700 text-sm">{agent.strategy}</p>
        </div>
      </div>
    </div>
  )
} 