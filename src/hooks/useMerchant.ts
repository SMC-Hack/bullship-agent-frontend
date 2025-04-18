import { useCallback, useEffect, useState } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';
import { BigNumber, ethers } from 'ethers';
import { useQuery } from '@tanstack/react-query';
import merchantContractService, { AgentInfo, SellShareRequest, GasEstimation } from '@/services/merchant-contract.service';
import { getAgentMerchantContract } from "@/services/merchant-contract.service";
import { PublicClient, WalletClient } from 'viem';

// Helper adapters for compatibility between wagmi v2 and ethers v5
function walletClientToEthersSigner(walletClient: WalletClient): ethers.Signer | null {
  if (!walletClient) return null;
  // Create a custom ethers signer
  const ethersProvider = new ethers.providers.Web3Provider(
    walletClient.transport as unknown as ethers.providers.ExternalProvider
  );
  return ethersProvider.getSigner(walletClient.account?.address || '');
}

function publicClientToEthersProvider(publicClient: PublicClient): ethers.providers.Provider | null {
  if (!publicClient) return null;
  // Use ethers.providers.JsonRpcProvider for most compatibility
  return new ethers.providers.JsonRpcProvider(
    publicClient.transport.url
  );
}

// Response types for different contract operations
interface ContractWriteResponse {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  txHash: string | null;
  reset: () => void;
}

interface CreateAgentResponse extends ContractWriteResponse {}
interface PurchaseStockResponse extends ContractWriteResponse {}
interface PurchaseStockByUsdcResponse extends ContractWriteResponse {}
interface CommitSellStockResponse extends ContractWriteResponse {}
interface FulfillSellStockResponse extends ContractWriteResponse {}
interface UpdateUsdcTokenAddressResponse extends ContractWriteResponse {}

// Custom hook for merchant contract interactions
export default function useMerchant() {
  const wagmiPublicClient = usePublicClient();
  const { data: wagmiWalletClient } = useWalletClient();
  
  // Convert wagmi clients to ethers equivalents
  const [provider, setProvider] = useState<ethers.providers.Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  
  useEffect(() => {
    if (wagmiPublicClient) {
      setProvider(publicClientToEthersProvider(wagmiPublicClient));
    }
  }, [wagmiPublicClient]);
  
  useEffect(() => {
    if (wagmiWalletClient) {
      setSigner(walletClientToEthersSigner(wagmiWalletClient));
    }
  }, [wagmiWalletClient]);
  
  
  // Create Agent
  const [createAgentState, setCreateAgentState] = useState<CreateAgentResponse>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    txHash: null,
    reset: () => setCreateAgentState({
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      txHash: null,
      reset: createAgentState.reset
    })
  });
  
  const createAgent = useCallback(async (walletAddress: string, name: string, symbol: string) => {
    if (!signer) return;
    
    setCreateAgentState({
      ...createAgentState,
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
      txHash: null
    });
    
    try {
      const tx = await merchantContractService.createAgent(signer, walletAddress, name, symbol);
      const receipt = await tx.wait();
      
      setCreateAgentState({
        ...createAgentState,
        isLoading: false,
        isSuccess: true,
        txHash: receipt.transactionHash
      });
      
      return receipt;
    } catch (error) {
      setCreateAgentState({
        ...createAgentState,
        isLoading: false,
        isError: true,
        error: error as Error
      });
      throw error;
    }
  }, [signer, createAgentState]);
  
  // Purchase Stock
  const [purchaseStockState, setPurchaseStockState] = useState<PurchaseStockResponse>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    txHash: null,
    reset: () => setPurchaseStockState({
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      txHash: null,
      reset: purchaseStockState.reset
    })
  });
  
  const purchaseStock = useCallback(async (stockTokenAddress: string, tokenAmount: number) => {
    if (!signer) return;
    
    setPurchaseStockState({
      ...purchaseStockState,
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
      txHash: null
    });
    
    try {
      const tx = await merchantContractService.purchaseStock(signer, stockTokenAddress, tokenAmount);
      const receipt = await tx.wait();
      
      setPurchaseStockState({
        ...purchaseStockState,
        isLoading: false,
        isSuccess: true,
        txHash: receipt.transactionHash
      });
      
      return receipt;
    } catch (error) {
      setPurchaseStockState({
        ...purchaseStockState,
        isLoading: false,
        isError: true,
        error: error as Error
      });
      throw error;
    }
  }, [signer, purchaseStockState]);
  
  // Purchase Stock By USDC
  const [purchaseStockByUsdcState, setPurchaseStockByUsdcState] = useState<PurchaseStockByUsdcResponse>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    txHash: null,
    reset: () => setPurchaseStockByUsdcState({
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      txHash: null,
      reset: purchaseStockByUsdcState.reset
    })
  });
  
  const purchaseStockByUsdc = useCallback(async (stockTokenAddress: string, usdcAmount: BigNumber) => {
    if (!signer) return;
    
    setPurchaseStockByUsdcState(prevState => ({
      ...prevState,
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
      txHash: null
    }));
    
    try {
      // Get the USDC token address from the contract
      const merchantContract = getAgentMerchantContract(signer);
      const usdcTokenAddress = await merchantContract.usdcToken();
      
      // Create USDC token contract instance
      const usdcContract = new ethers.Contract(
        usdcTokenAddress,
        [
          'function approve(address spender, uint256 amount) returns (bool)',
          'function allowance(address owner, address spender) view returns (uint256)'
        ],
        signer
      );
      
      // Check if user has given enough allowance
      const userAddress = await signer.getAddress();
      const currentAllowance = await usdcContract.allowance(
        userAddress,
        merchantContract.address
      );
      
      // If allowance is insufficient, request approval
      if (currentAllowance.lt(usdcAmount)) {
        console.log("Insufficient allowance. Current:", currentAllowance.toString(), "Needed:", usdcAmount.toString());
        console.log("Requesting USDC approval...");
        
        const approveTx = await usdcContract.approve(
          merchantContract.address,
          ethers.constants.MaxUint256 // Unlimited approval - or use usdcAmount for exact amount
        );
        
        // Wait for approval transaction to be confirmed
        const approveReceipt = await approveTx.wait();
        console.log("USDC approved successfully:", approveReceipt.transactionHash);
      }
      
      // Now proceed with the purchase transaction
      const tx = await merchantContractService.purchaseStockByUsdc(signer, stockTokenAddress, usdcAmount);
      const receipt = await tx.wait();
      
      setPurchaseStockByUsdcState(prevState => ({
        ...prevState,
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        txHash: receipt.transactionHash
      }));
      
      return receipt;
    } catch (error) {
      console.error("Failed to purchase tokens by USDC:", error);
      setPurchaseStockByUsdcState(prevState => ({
        ...prevState,
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: error as Error,
        txHash: null
      }));
      throw error;
    }
  }, [signer, setPurchaseStockByUsdcState, merchantContractService]);
  
  // Commit Sell Stock
  const [commitSellStockState, setCommitSellStockState] = useState<CommitSellStockResponse>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    txHash: null,
    reset: () => setCommitSellStockState({
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      txHash: null,
      reset: commitSellStockState.reset
    })
  });
  
  const commitSellStock = useCallback(async (stockTokenAddress: string, tokenAmount: number) => {
    if (!signer) return;
    
    setCommitSellStockState({
      ...commitSellStockState,
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
      txHash: null
    });
    
    try {
      const tx = await merchantContractService.commitSellStock(signer, stockTokenAddress, tokenAmount);
      const receipt = await tx.wait();
      
      setCommitSellStockState({
        ...commitSellStockState,
        isLoading: false,
        isSuccess: true,
        txHash: receipt.transactionHash
      });
      
      return receipt;
    } catch (error) {
      setCommitSellStockState({
        ...commitSellStockState,
        isLoading: false,
        isError: true,
        error: error as Error
      });
      throw error;
    }
  }, [signer, commitSellStockState]);
  
  // Fulfill Sell Stock
  const [fulfillSellStockState, setFulfillSellStockState] = useState<FulfillSellStockResponse>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    txHash: null,
    reset: () => setFulfillSellStockState({
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      txHash: null,
      reset: fulfillSellStockState.reset
    })
  });
  
  const fulfillSellStock = useCallback(async () => {
    if (!signer) return;
    
    setFulfillSellStockState({
      ...fulfillSellStockState,
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
      txHash: null
    });
    
    try {
      const tx = await merchantContractService.fulfillSellStock(signer);
      const receipt = await tx.wait();
      
      setFulfillSellStockState({
        ...fulfillSellStockState,
        isLoading: false,
        isSuccess: true,
        txHash: receipt.transactionHash
      });
      
      return receipt;
    } catch (error) {
      setFulfillSellStockState({
        ...fulfillSellStockState,
        isLoading: false,
        isError: true,
        error: error as Error
      });
      throw error;
    }
  }, [signer, fulfillSellStockState]);
  
  // Update USDC Token Address
  const [updateUsdcTokenAddressState, setUpdateUsdcTokenAddressState] = useState<UpdateUsdcTokenAddressResponse>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    txHash: null,
    reset: () => setUpdateUsdcTokenAddressState({
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      txHash: null,
      reset: updateUsdcTokenAddressState.reset
    })
  });
  
  const updateUsdcTokenAddress = useCallback(async (newUsdcTokenAddress: string) => {
    if (!signer) return;
    
    setUpdateUsdcTokenAddressState({
      ...updateUsdcTokenAddressState,
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
      txHash: null
    });
    
    try {
      const tx = await merchantContractService.updateUsdcTokenAddress(signer, newUsdcTokenAddress);
      const receipt = await tx.wait();

      
      setUpdateUsdcTokenAddressState({
        ...updateUsdcTokenAddressState,
        isLoading: false,
        isSuccess: true,
        txHash: receipt.transactionHash
      });
      
      return receipt;
    } catch (error) {
      setUpdateUsdcTokenAddressState({
        ...updateUsdcTokenAddressState,
        isLoading: false,
        isError: true,
        error: error as Error
      });
      throw error;
    }
  }, [signer, updateUsdcTokenAddressState]);
  
  // Read functions using React Query
  const useAgentInfo = (walletAddress: string) => {
    return useQuery({
      queryKey: ['agentInfo', provider, walletAddress],
      queryFn: async () => {
        if (!provider || !walletAddress) return null;
        try {
          return await merchantContractService.getAgentInfo(provider, walletAddress);
        } catch (error) {
          console.error('Error getting agent info:', error);
          return null;
        }
      },
      enabled: !!provider && !!walletAddress
    });
  };
  
  const useAgentWalletAddress = (stockTokenAddress: string) => {
    return useQuery({
      queryKey: ['agentWalletAddress', provider, stockTokenAddress],
      queryFn: async () => {
        if (!provider || !stockTokenAddress) return null;
        try {
          return await merchantContractService.getAgentWalletAddress(provider, stockTokenAddress);
        } catch (error) {
          console.error('Error getting agent wallet address:', error);
          return null;
        }
      },
      enabled: !!provider && !!stockTokenAddress
    });
  };
  
  const useSellShareRequests = (stockTokenAddress: string) => {
    return useQuery({
      queryKey: ['sellShareRequests', provider, stockTokenAddress],
      queryFn: async () => {
        if (!provider || !stockTokenAddress) return [];
        try {
          return await merchantContractService.getSellShareRequests(provider, stockTokenAddress);
        } catch (error) {
          console.error('Error getting sell share requests:', error);
          return [];
        }
      },
      enabled: !!provider && !!stockTokenAddress
    });
  };
  
  const useAgentsByCreator = (creatorAddress: string) => {
    return useQuery({
      queryKey: ['agentsByCreator', provider, creatorAddress],
      queryFn: async () => {
        if (!provider || !creatorAddress) return [];
        try {
          return await merchantContractService.getAgentsByCreator(provider, creatorAddress);
        } catch (error) {
          console.error('Error getting agents by creator:', error);
          return [];
        }
      },
      enabled: !!provider && !!creatorAddress
    });
  };
  
  // Keep the original functions for components that don't need React Query's features
  const getAgentInfo = useCallback(async (walletAddress: string): Promise<AgentInfo | null> => {
    console.log("getAgentInfo", walletAddress);
    if (!provider) return null;
    
    try {
      return await merchantContractService.getAgentInfo(provider, walletAddress);
    } catch (error) {
      console.error('Error getting agent info:', error);
      return null;
    }
  }, [provider]);
  
  // Return connected wallet address
  const getConnectedAddress = useCallback((): string | undefined => {
    return wagmiWalletClient?.account?.address;
  }, [wagmiWalletClient]);
  

  
  // Return everything
  return {
    // Contract state
    getConnectedAddress,
    
    // Write functions with states
    createAgent,
    createAgentState,
    
    purchaseStock,
    purchaseStockState,
    
    purchaseStockByUsdc,
    purchaseStockByUsdcState,
    
    commitSellStock,
    commitSellStockState,
    
    fulfillSellStock,
    fulfillSellStockState,
    
    updateUsdcTokenAddress,
    updateUsdcTokenAddressState,
    
    // Read functions - React Query hooks
    useAgentInfo,
    useAgentWalletAddress,
    useSellShareRequests,
    useAgentsByCreator,
    
    // Legacy read functions (for backward compatibility)
    getAgentInfo,
  };
}
