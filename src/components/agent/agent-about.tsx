import { Info } from "lucide-react"
import { Agent } from "@/interfaces/agent.interface"

interface AgentAboutProps {
  agent: Agent
}

export default function AgentAbout({ agent }: AgentAboutProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">About</h2>
      <p className="text-gray-700 mb-4">{agent.description}</p>
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <p>Created by: {agent.userId}</p>
        <Info size={14} className="ml-1 cursor-pointer" />
      </div>
      <p className="text-sm text-gray-500">Created on: {new Date(agent.createdAt).toLocaleDateString()}</p>
    </div>
  )
} 