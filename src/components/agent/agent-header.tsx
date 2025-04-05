import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import { Agent } from '@/interfaces/agent.interface';
import { useEnsName } from 'wagmi';
import { sepolia } from 'viem/chains';
import { getENSLink } from '@/utils/getENSLink';

interface AgentHeaderProps {
  agent: Agent;
}

export default function AgentHeader({ agent }: AgentHeaderProps) {
  const { data: name } = useEnsName({
    address: agent?.walletKey.address as `0x${string}`,
    chainId: sepolia.id,
  });

  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleGoBack}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Go back"
          tabIndex={0}
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative h-16 w-16 mr-4">
          <Image
            src={agent.imageUrl || '/placeholder.svg'}
            alt={agent.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            <a
              href={getENSLink(name || agent.walletKey.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {name || agent.name}
            </a>
          </h1>
          <p className="text-gray-500">${agent.stockSymbol}</p>
        </div>
      </div>
    </>
  );
}
