import { Agent } from "@/interfaces/agent.interface"

interface AgentTradingTokensProps {
  agent: Agent
}

export default function AgentTradingTokens({ agent }: AgentTradingTokensProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">Trading Tokens</h2>
      <div className="flex flex-wrap gap-2">
        {/* {agent.selectedTokens.split(",").map((token) => (
          <div key={token} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {token}
          </div>
        ))} */}
      </div>
    </div>
  )
} 