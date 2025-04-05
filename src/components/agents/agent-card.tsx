import type React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AgentCardSkeleton from '@/components/agents/agent-card-skeleton';
import { Agent } from '@/interfaces/agent.interface';
import { useEnsName } from 'wagmi';
import { sepolia } from 'viem/chains';
import { Area } from 'recharts';
import { AreaChart } from 'recharts';
import { ResponsiveContainer } from 'recharts';
import { useEffect, useMemo } from 'react';
import { ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import CountdownTimer from './countdown-timer';

interface AgentCardProps {
  agent?: Agent | undefined | null;
  isLoading?: boolean;
}

const AgentCard = ({ agent, isLoading }: AgentCardProps) => {
  const { data: name } = useEnsName({
    address: agent?.walletKey.address as `0x${string}`,
    chainId: sepolia.id,
  });

  const router = useRouter();

  // Default performance data if none provided
  const defaultData = useMemo(() => {
    return (
      agent?.week?.result.map((result) => ({
        timestamp: result.timestamp,
        value: result.value_usd,
      })) ?? []
    );
  }, [agent]);

  const handleCardClick = () => {
    router.push(`/agent/${agent?.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleCardClick();
    }
  };

  if (isLoading || !agent) {
    return <AgentCardSkeleton />;
  }

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center hover:shadow-md transition-shadow duration-200 cursor-pointer relative"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={`View details for ${agent?.name}`}
    >
      <div className="absolute -top-5 -right-5">
        <CountdownTimer />
      </div>
      {/* Left section: Avatar and Name */}
      <div className="flex items-center">
        <div className="relative h-12 w-12 mr-3">
          <Image
            src={agent.imageUrl || '/placeholder.svg'}
            alt={agent.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{name || agent.name}</h3>
          <p className="text-sm text-gray-500">${agent.stockSymbol}</p>
        </div>
      </div>

      {/* Middle section: Chart */}
      <div className="flex-1 h-12 mx-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={defaultData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <Area
              type="monotone"
              dataKey="value"
              stroke={
                agent.balanceSnapshots?.pnl && agent.balanceSnapshots?.pnl >= 0
                  ? '#16a34a'
                  : '#dc2626'
              }
              fill={
                agent.balanceSnapshots?.pnl && agent.balanceSnapshots?.pnl >= 0
                  ? '#16a34a20'
                  : '#dc262620'
              }
              strokeWidth={1.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Right section: Compact Metrics */}
      <div className="flex flex-col items-end text-right">
        <div
          className={cn(
            'flex items-center text-sm font-medium',
            agent.balanceSnapshots?.pnl && agent.balanceSnapshots?.pnl >= 0
              ? 'text-green-600'
              : 'text-red-600'
          )}
        >
          {agent.balanceSnapshots?.pnl && agent.balanceSnapshots?.pnl >= 0 ? (
            <ArrowUpRight size={14} className="mr-0.5" />
          ) : (
            <ArrowDownRight size={14} className="mr-0.5" />
          )}
          {Math.abs(agent.balanceSnapshots?.pnl || 0)}%
        </div>
        <p className="text-xs text-gray-500">
          {formatCurrency(agent.balanceSnapshots?.balanceUSD || 0)}
        </p>
      </div>
    </div>
  );
};

export default AgentCard;
