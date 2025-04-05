import { Info } from 'lucide-react';
import { Agent } from '@/interfaces/agent.interface';
import { useEnsName } from 'wagmi';
import { sepolia } from 'viem/chains';
import { getENSLink } from '@/utils/getENSLink';

interface AgentAboutProps {
  agent: Agent;
}

export default function AgentAbout({ agent }: AgentAboutProps) {
  const { data: name } = useEnsName({
    address: agent?.user.walletAddress as `0x${string}`,
    chainId: sepolia.id,
  });

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">About</h2>
      <p className="text-gray-700 mb-4">{agent.description}</p>
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <p>
          Created by:{' '}
          <a
            href={getENSLink(name || agent.user.walletAddress)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {name || agent.user.walletAddress}
          </a>
        </p>
        <Info size={14} className="ml-1 cursor-pointer" />
      </div>
      <p className="text-sm text-gray-500">
        Created on: {new Date(agent.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
