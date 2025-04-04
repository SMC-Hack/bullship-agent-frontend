import { TrendingUp, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AgentCard from "@/components/agents/agent-card"

interface Agent {
  id: string
  name: string
  symbol: string
  aum: number
  pnl: number
  image: string
}

interface AgentTabsProps {
  topAgents: Agent[]
  watchlistAgents: Agent[]
}

export default function AgentTabs({ topAgents, watchlistAgents }: AgentTabsProps) {
  return (
    <Tabs defaultValue="top" className="mb-8">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="top" className="flex items-center gap-2">
          <TrendingUp size={16} />
          <span>Top Performing</span>
        </TabsTrigger>
        <TabsTrigger value="watchlist" className="flex items-center gap-2">
          <Star size={16} />
          <span>Watchlist</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="top" className="space-y-4">
        {topAgents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </TabsContent>
      <TabsContent value="watchlist" className="space-y-4">
        {watchlistAgents.length > 0 ? (
          watchlistAgents.map((agent) => <AgentCard key={agent.id} agent={agent} />)
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Star className="mx-auto mb-2" size={24} />
            <p>No agents in your watchlist yet</p>
            <Button variant="link" className="mt-2">
              Explore agents to add
            </Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
} 