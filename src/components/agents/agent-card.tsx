import type React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AgentCardSkeleton from "@/components/agents/agent-card-skeleton";
import { Agent } from "@/interfaces/agent.interface";

interface AgentCardProps {
  agent?: Agent | undefined | null;
  isLoading?: boolean;
}

const AgentCard = ({ agent, isLoading }: AgentCardProps) => {
  const router = useRouter();

  // Default performance data if none provided
  const defaultData = [
    { timestamp: "1", value: 100 },
    { timestamp: "2", value: 120 },
    { timestamp: "3", value: 110 },
    { timestamp: "4", value: 140 },
    { timestamp: "5", value: 130 },
    { timestamp: "6", value: 160 },
  ];

  const handleCardClick = () => {
    router.push(`/agent/${agent?.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      handleCardClick();
    }
  };

  if (isLoading || !agent) {
    return <AgentCardSkeleton />;
  }

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={`View details for ${agent?.name}`}
    >
      {/* Left section: Avatar and Name */}
      <div className="flex items-center">
        <div className="relative h-12 w-12">
          <Image
            src={agent.imageUrl || "/placeholder.svg"}
            alt={agent.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{agent.name}</h3>
          <p className="text-sm text-gray-500">${agent.stockSymbol}</p>
        </div>
      </div>

      {/* Middle section: Chart */}
      {/* <div className="flex-1 h-12 mx-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={performanceData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <Area
              type="monotone"
              dataKey="value"
              stroke={agent.pnl >= 0 ? "#16a34a" : "#dc2626"}
              fill={agent.pnl >= 0 ? "#16a34a20" : "#dc262620"}
              strokeWidth={1.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div> */}

      {/* Right section: Compact Metrics */}
      {/* <div className="flex flex-col items-end text-right">
        <div
          className={cn(
            "flex items-center text-sm font-medium",
            agent.pnl >= 0 ? "text-green-600" : "text-red-600"
          )}
        >
          {agent.pnl >= 0 ? (
            <ArrowUpRight size={14} className="mr-0.5" />
          ) : (
            <ArrowDownRight size={14} className="mr-0.5" />
          )}
          {Math.abs(agent.pnl)}%
        </div>
        <p className="text-xs text-gray-500">{formatCurrency(agent.aum)}</p>
      </div> */}
    </div>
  );
};

export default AgentCard;
