import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import AgentCardSmall from "@/components/agents/agent-card-small";

export default function LatestAgents() {
  const latestAgents = [
    {
      id: "1",
      name: "DeFi Master",
      symbol: "DEFI",
      pnl: 25.8,
      image: "/placeholder.svg",
    },
    {
      id: "2",
      name: "Yield Hunter",
      symbol: "YIELD",
      pnl: 18.2,
      image: "/placeholder.svg",
    },
    {
      id: "3",
      name: "Stable Growth",
      symbol: "STABLE",
      pnl: 12.5,
      image: "/placeholder.svg",
    },
    {
      id: "4",
      name: "NFT Trader",
      symbol: "NFT",
      pnl: 30.1,
      image: "/placeholder.svg",
    },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Latest Agents</h2>
      <ScrollArea className="w-full">
        <div className="flex pb-2 space-x-3">
          {latestAgents.map((agent) => (
            <AgentCardSmall key={agent.id} agent={agent} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
