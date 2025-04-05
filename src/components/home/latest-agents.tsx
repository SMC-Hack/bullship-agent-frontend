import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import AgentCardSmall from '@/components/agents/agent-card-small';
import AgentCardSmallSkeleton from '../agents/agent-card-small-skeleton';
import { Agent } from '@/interfaces/agent.interface';

interface LatestAgentsProps {
  agents?: Agent[] | null | undefined;
  isLoading?: boolean;
}

export default function LatestAgents({ agents, isLoading }: LatestAgentsProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Latest Agents</h2>
      <ScrollArea className="w-full">
        <div className="flex pb-2 space-x-3">
          {!agents &&
            Array.from({ length: 3 }).map((_, index) => (
              <AgentCardSmallSkeleton key={index} />
            ))}
          {agents &&
            agents?.map((agent) => (
              <AgentCardSmall
                key={agent.id}
                agent={agent}
                isLoading={isLoading}
              />
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
