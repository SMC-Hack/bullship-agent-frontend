import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import useAgent from "@/hooks/useAgent";
import AgentHeader from "@/components/agent/agent-header";
import AgentStats from "@/components/agent/agent-stats";
import AgentPerformance from "@/components/agent/agent-performance";
import AgentAbout from "@/components/agent/agent-about";
import AgentTradingStrategy from "@/components/agent/agent-trading-strategy";
import AgentTradingTokens from "@/components/agent/agent-trading-tokens";
import { config } from "@/config";
import { useAccount } from "wagmi";
import AgentStockTrade from "@/components/agent/agent-stock-trade";
export default function AgentScreen() {
  const router = useRouter();
  const paramsId = router.query.id as string;
  const { data: agent, isLoading, error } = useAgent(paramsId);
  // const { getConnectedAddress } = useMerchant();


  if (isLoading) {
    return (
      <div className="container px-4 py-6 max-w-md mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="container px-4 py-6 max-w-md mx-auto">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Error Loading Agent
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {error?.message ||
              "Failed to load agent data. Please try again later."}
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-6 max-w-md mx-auto">
      <AgentHeader agent={agent} />
      <AgentStats agent={agent} />
      <AgentPerformance agent={agent} />
      <AgentAbout agent={agent} />
      <AgentTradingStrategy agent={agent} />
      <AgentTradingTokens agent={agent} />
      <AgentStockTrade agent={agent} />
    </div>
  );
}
