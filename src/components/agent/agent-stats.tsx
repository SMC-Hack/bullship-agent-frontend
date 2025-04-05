import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Agent } from "@/interfaces/agent.interface";
import { formatCurrency } from "@/utils/format";

interface AgentStatsProps {
  agent: Agent;
}

export default function AgentStats({ agent }: AgentStatsProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mb-6">
      <div className="flex justify-between mb-2">
        <p className="text-gray-600">Assets Under Management</p>
        {/* <p className="font-semibold">{formatCurrency(agent.aum)}</p> */}
      </div>
      <div className="flex justify-between">
        <p className="text-gray-600">Performance (24h)</p>
        {/* <div
          className={cn(
            "flex items-center font-semibold",
            agent.pnl >= 0 ? "text-green-600" : "text-red-600"
          )}
        >
          {agent.pnl >= 0 ? (
            <ArrowUpRight size={16} className="mr-1" />
          ) : (
            <ArrowDownRight size={16} className="mr-1" />
          )}
          {Math.abs(agent.pnl)}%
        </div> */}
      </div>
    </div>
  );
}
