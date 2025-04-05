import { Button } from '../ui/button';
import { Agent } from '@/interfaces/agent.interface';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { config } from '@/config';
import { useAccount } from 'wagmi';
import SellModal from '../modals/sell-modal';
import BuyModal from '../modals/buy-modal';

export default function AgentStockTrade({ agent }: { agent: Agent }) {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);

  const { BASE_SEPOLIA_USDC_ADDRESS } = config;

  const { address: userAddress } = useAccount();

  const handleBuy = () => {
    setShowBuyModal(true);
  };

  const handleSell = () => {
    setShowSellModal(true);
  };
  // Check if user has any agent tokens in their wallet
  const {
    data: tokenBalance,
    isLoading: isTokenBalanceLoading,
    refetch: refetchTokenBalance,
  } = useQuery({
    queryKey: ['agentTokenBalance', agent.stockAddress, userAddress],
    queryFn: async () => {
      if (!userAddress || !agent.stockAddress) {
        console.log('Missing required data:', {
          userAddress,
          stockAddress: agent.stockAddress,
        });
        return ethers.BigNumber.from(0);
      }

      try {
        // Create contract interface for ERC20 token with minimal ABI
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // Verify network connection
        const network = await provider.getNetwork();
        console.log('Connected to network:', network);

        // Verify contract address format
        if (!ethers.utils.isAddress(agent.stockAddress)) {
          console.error('Invalid contract address:', agent.stockAddress);
          return ethers.BigNumber.from(0);
        }

        // Check if contract exists by getting its code
        const code = await provider.getCode(agent.stockAddress);
        if (code === '0x') {
          console.error(
            'No contract code found at address:',
            agent.stockAddress
          );
          return ethers.BigNumber.from(0);
        }

        const minimalAbi = [
          'function balanceOf(address) view returns (uint256)',
        ];

        const tokenContract = new ethers.Contract(
          agent.stockAddress,
          minimalAbi,
          provider
        );

        // Get balance
        const balance = await tokenContract.balanceOf(userAddress);
        console.log(`User token balance: ${balance.toString()}`);
        return balance;
      } catch (error: Error | unknown) {
        console.error('Error getting token balance:', error);
        console.error('Contract address:', agent.stockAddress);
        console.error('User address:', userAddress);
        if (
          error instanceof Error &&
          'code' in error &&
          error.code === 'NETWORK_ERROR'
        ) {
          console.error(
            'Network connection error - please check your wallet connection'
          );
        }
        return ethers.BigNumber.from(0);
      }
    },
    enabled: !!userAddress && !!agent.stockAddress,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const {
    data: usdcBalance,
    isLoading: isUsdcBalanceLoading,
    refetch: refetchUsdcBalance,
  } = useQuery({
    queryKey: ['userUsdcBalance', BASE_SEPOLIA_USDC_ADDRESS],
    queryFn: async () => {
      if (!userAddress) return ethers.BigNumber.from(0);

      try {
        // Create contract interface for ERC20 token
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const tokenContract = new ethers.Contract(
          BASE_SEPOLIA_USDC_ADDRESS,
          ['function balanceOf(address) view returns (uint256)'],
          provider
        );

        // Get balance
        const balance = await tokenContract.balanceOf(userAddress);
        return balance.div(ethers.BigNumber.from(10).pow(6));
      } catch (error) {
        console.error('Error getting token balance:', error);
        return ethers.BigNumber.from(0);
      }
    },
    enabled: !!userAddress && !!agent.stockAddress,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const hasTokens = useMemo(() => {
    return tokenBalance && !tokenBalance.isZero();
  }, [tokenBalance]);

  const onPurchaseOrSellSuccess = () => {
    refetchTokenBalance();
    refetchUsdcBalance();
  };

  return (
    <>
      {/* Add Buy and Sell buttons */}
      <div className="text-lg font-semibold mb-2">
        Balance: {tokenBalance?.toString() + ' $' + agent.stockSymbol}
      </div>

      <div className="space-y-3">
        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-6"
          onClick={handleBuy}
        >
          Buy ${agent.stockSymbol}
        </Button>

        {hasTokens && (
          <Button
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white py-6"
            onClick={handleSell}
          >
            Sell ${agent.stockSymbol}
          </Button>
        )}
      </div>

      {showBuyModal && (
        <BuyModal
          agent={agent}
          usdcBalance={Number.parseInt(usdcBalance?.toString() ?? '0')}
          onClose={() => setShowBuyModal(false)}
          onSuccess={onPurchaseOrSellSuccess}
        />
      )}

      {showSellModal && (
        <SellModal
          agent={agent}
          stockTokenBalance={tokenBalance ?? 0}
          onClose={() => setShowSellModal(false)}
          onSuccess={onPurchaseOrSellSuccess}
        />
      )}
    </>
  );
}
