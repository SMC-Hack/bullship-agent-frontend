import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import BuyModal from "@/components/modals/buy-modal";
import useAgent from "@/hooks/useAgent";
import AgentHeader from "@/components/agent/agent-header";
import AgentStats from "@/components/agent/agent-stats";
import AgentPerformance from "@/components/agent/agent-performance";
import AgentAbout from "@/components/agent/agent-about";
import AgentTradingStrategy from "@/components/agent/agent-trading-strategy";
import AgentTradingTokens from "@/components/agent/agent-trading-tokens";
import useMerchant from "@/hooks/useMerchant";
import { ethers } from "ethers";
import { useQuery } from "@tanstack/react-query";
import SellModal from "@/components/modals/sell-modal";
import { config } from "@/config";

export default function AgentScreen() {
  const router = useRouter();
  const [showBuyModal, setShowBuyModal] = useState(false);
  const paramsId = router.query.id as string;
  const { data: agent, isLoading, error } = useAgent(paramsId);
  const [showSellModal, setShowSellModal] = useState(false);
  const { getConnectedAddress } = useMerchant();

  const { BASE_SEPOLIA_USDC_ADDRESS } = config;

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
  // Get user's wallet address
  const userAddress = getConnectedAddress();

  // Check if user has any agent tokens in their wallet
  const {
    data: tokenBalance,
    isLoading: isTokenBalanceLoading,
    refetch: refetchTokenBalance,
  } = useQuery({
    queryKey: ["agentTokenBalance", agent.stockAddress, userAddress],
    queryFn: async () => {
      if (!userAddress || !agent.stockAddress) return ethers.BigNumber.from(0);

      try {
        // Create contract interface for ERC20 token
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const tokenContract = new ethers.Contract(
          agent.stockAddress,
          ["function balanceOf(address) view returns (uint256)"],
          provider
        );

        // Get balance
        const balance = await tokenContract.balanceOf(userAddress);
        console.log(`User token balance: ${balance.toString()}`);
        return balance;
      } catch (error) {
        console.error("Error getting token balance:", error);
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
    queryKey: ["userUsdcBalance", BASE_SEPOLIA_USDC_ADDRESS],
    queryFn: async () => {
      if (!userAddress) return ethers.BigNumber.from(0);

      try {
        // Create contract interface for ERC20 token
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const tokenContract = new ethers.Contract(
          BASE_SEPOLIA_USDC_ADDRESS,
          ["function balanceOf(address) view returns (uint256)"],
          provider
        );

        // Get balance
        const balance = await tokenContract.balanceOf(userAddress);
        console.log(`User token balance: ${balance.toString()}`);
        return balance.div(ethers.BigNumber.from(10).pow(6));
      } catch (error) {
        console.error("Error getting token balance:", error);
        return ethers.BigNumber.from(0);
      }
    },
    enabled: !!userAddress && !!agent.stockAddress,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Determine if user has tokens
  const hasTokens = tokenBalance && !tokenBalance.isZero();
  const handleGoBack = () => {
    router.back();
  };

  const handleBuy = () => {
    setShowBuyModal(true);
  };

  const handleSell = () => {
    setShowSellModal(true);
    // TODO: Implement sell modal component and functionality
  };

  // Function to be called from buy modal after successful purchase
  const onPurchaseOrSellSuccess = () => {
    refetchTokenBalance();
  };

  return (
    <div className="container px-4 py-6 max-w-md mx-auto">
      <AgentHeader agent={agent} />
      <AgentStats agent={agent} />
      <AgentPerformance agent={agent} />
      <AgentAbout agent={agent} />
      <AgentTradingStrategy agent={agent} />
      <AgentTradingTokens agent={agent} />

      <Button
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-6"
        onClick={handleBuy}
      >
        Buy ${agent.stockSymbol}
      </Button>

      {/* Add Buy and Sell buttons */}
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
          usdcBalance={Number.parseInt(usdcBalance?.toString() ?? "0")}
          onClose={() => setShowBuyModal(false)}
          onSuccess={onPurchaseOrSellSuccess}
        />
      )}
      {/* TODO: Add SellModal component when implemented */}
      {showSellModal && (
        <SellModal
          agent={agent}
          stockTokenBalance={tokenBalance ?? 0}
          onClose={() => setShowSellModal(false)}
          onSuccess={onPurchaseOrSellSuccess}
        />
      )}
    </div>
  );
}
