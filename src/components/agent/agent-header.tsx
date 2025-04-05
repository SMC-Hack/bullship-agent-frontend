import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/router"
import { Agent } from "@/interfaces/agent.interface"

interface AgentHeaderProps {
  agent: Agent
}

export default function AgentHeader({ agent }: AgentHeaderProps) {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <button onClick={handleGoBack} className="p-2 rounded-full hover:bg-gray-100" aria-label="Go back" tabIndex={0}>
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative h-16 w-16 mr-4">
          <Image src={agent.imageUrl || "/placeholder.svg"} alt={agent.name} fill className="rounded-full object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{agent.name}</h1>
          <p className="text-gray-500">${agent.stockSymbol}</p>
        </div>
      </div>
    </>
  )
} 