import { useAccount, useEnsName } from 'wagmi';
import { sepolia } from 'viem/chains';
import { truncateAddress } from '@/utils/truncate';
import { useEffect, useState } from 'react';
import { getENSLink } from '@/utils/getENSLink';

interface HeadingProps {
  onSearch: (query: string) => void;
}

export default function Heading({ onSearch }: HeadingProps) {
  const { address } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { data: name } = useEnsName({
    address: address,
    chainId: sepolia.id,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounce search query
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      onSearch(searchQuery);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-bold">
        Hi,{' '}
        {mounted && address ? (
          <a
            href={getENSLink(name || address)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent hover:underline"
          >
            {name || truncateAddress(address)}
          </a>
        ) : (
          'there'
        )}
        !
      </h1>
      <div className="relative">
        <input
          type="text"
          placeholder="Search agents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 pr-8 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors text-sm"
        />
        {isSearching ? (
          <svg
            className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
