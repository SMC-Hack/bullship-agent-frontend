import { config } from "@/config";
import { AgentMerchant, AgentMerchant__factory } from "@/typechain-types";
import { BigNumber, ethers } from "ethers";

const { MERCHANT_CONTRACT_ADDRESS, BASE_SEPOLIA_USDC_ADDRESS } = config;

export function getAgentMerchantContract(signerOrProvider: ethers.Signer | ethers.providers.Provider): AgentMerchant {
  return AgentMerchant__factory.connect(MERCHANT_CONTRACT_ADDRESS, signerOrProvider);
}

/**
 * AgentInfo
 */
export interface AgentInfo {
  walletAddress: string;
  stockTokenAddress: string;
  pricePerToken: BigNumber;
  creatorAddress: string;
}

/**
 * Temp data for sell share requests
 */
export interface SellShareRequest {
  userWalletAddress: string;
  tokenAmount: BigNumber;
}


class MerchantContractService {
  /**
   * Create a new agent
   */
  async createAgent(
    signer: ethers.Signer,
    walletAddress: string,
    name: string,
    symbol: string
  ): Promise<ethers.ContractTransaction> {
    const contract = getAgentMerchantContract(signer);
    return contract.createAgent(walletAddress, name, symbol);
  }

  /**
   * Purchase stock tokens for an agent
   */
  async purchaseStock(
    signer: ethers.Signer,
    stockTokenAddress: string,
    tokenAmount: number
  ): Promise<ethers.ContractTransaction> {
    const contract = getAgentMerchantContract(signer);
    return contract.purchaseStock(stockTokenAddress, tokenAmount);
  }

  /**
   * Commit to selling stock tokens
   */
  async commitSellStock(
    signer: ethers.Signer,
    stockTokenAddress: string,
    tokenAmount: number
  ): Promise<ethers.ContractTransaction> {
    const contract = getAgentMerchantContract(signer);
    return contract.commitSellStock(stockTokenAddress, tokenAmount);
  }

  /**
   * Fulfill sell stock requests (agent only)
   */
  async fulfillSellStock(signer: ethers.Signer): Promise<ethers.ContractTransaction> {
    const contract = getAgentMerchantContract(signer);
    return contract.fullfillSellStock();
  }

  /**
   * Get agent info by wallet address
   */
  async getAgentInfo(provider: ethers.providers.Provider, walletAddress: string): Promise<AgentInfo> {
    const contract = getAgentMerchantContract(provider);
    return contract.agentInfoMapper(walletAddress);
  }

  /**
   * Get the wallet address for a stock token
   */
  async getAgentWalletAddress(provider: ethers.providers.Provider, stockTokenAddress: string): Promise<string> {
    const contract = getAgentMerchantContract(provider);
    return contract.stockTokenToWalletAddressMapper(stockTokenAddress);
  }

  /**
   * Get all sell share requests for a stock token
   */
  async getSellShareRequests(
    provider: ethers.providers.Provider,
    stockTokenAddress: string
  ): Promise<SellShareRequest[]> {
    const contract = getAgentMerchantContract(provider);
    const length = await contract.getSellShareRequestsLength(stockTokenAddress);
    
    const requests: SellShareRequest[] = [];
    for (let i = 0; i < length.toNumber(); i++) {
      const request = await contract.sellShareRequests(stockTokenAddress, i);
      requests.push({
        userWalletAddress: request.userWalletAddress,
        tokenAmount: request.tokenAmount,
      });
    }
    
    return requests;
  }

  /**
   * Get the USDC token address
   */
  async getUsdcTokenAddress(provider: ethers.providers.Provider): Promise<string> {
    const contract = getAgentMerchantContract(provider);
    return contract.usdcToken();
  }

  /**
   * Update the USDC token address (owner only)
   */
  async updateUsdcTokenAddress(
    signer: ethers.Signer,
    newUsdcTokenAddress: string
  ): Promise<ethers.ContractTransaction> {
    const contract = getAgentMerchantContract(signer);
    return contract.updateUsdcTokenAddress(newUsdcTokenAddress);
  }

  /**
   * Get the contract owner
   */
  async getOwner(provider: ethers.providers.Provider): Promise<string> {
    const contract = getAgentMerchantContract(provider);
    return contract.owner();
  }

  /**
   * Get agents created by a specific address
   */
  async getAgentsByCreator(
    provider: ethers.providers.Provider,
    creatorAddress: string
  ): Promise<string[]> {
    const contract = getAgentMerchantContract(provider);
    const agentAddresses: string[] = [];
    
    try {
      let index = 0;
      while (true) {
        const address = await contract.creatorAddressToAgentWalletAddressesMapper(creatorAddress, index);
        if (address && address !== ethers.constants.AddressZero) {
          agentAddresses.push(address);
        }
        index++;
      }
    } catch (error) {
      // End of array reached
    }
    
    return agentAddresses;
  }

  /**
   * Listen for AgentCreated events
   */
  listenForAgentCreated(
    provider: ethers.providers.Provider,
    callback: (event: any) => void
  ): ethers.Contract {
    const contract = getAgentMerchantContract(provider);
    contract.on("AgentCreated", callback);
    return contract;
  }

  /**
   * Listen for StockPurchased events
   */
  listenForStockPurchased(
    provider: ethers.providers.Provider,
    callback: (event: any) => void
  ): ethers.Contract {
    const contract = getAgentMerchantContract(provider);
    contract.on("StockPurchased", callback);
    return contract;
  }

  /**
   * Listen for SellStockRequested events
   */
  listenForSellStockRequested(
    provider: ethers.providers.Provider,
    callback: (event: any) => void
  ): ethers.Contract {
    const contract = getAgentMerchantContract(provider);
    contract.on("SellStockRequested", callback);
    return contract;
  }

  /**
   * Listen for SellRequestFulfilled events
   */
  listenForSellRequestFulfilled(
    provider: ethers.providers.Provider,
    callback: (event: any) => void
  ): ethers.Contract {
    const contract = getAgentMerchantContract(provider);
    contract.on("SellRequestFulfilled", callback);
    return contract;
  }

  /**
   * Listen for PricePerTokenUpdated events
   */
  listenForPricePerTokenUpdated(
    provider: ethers.providers.Provider,
    callback: (event: any) => void
  ): ethers.Contract {
    const contract = getAgentMerchantContract(provider);
    contract.on("PricePerTokenUpdated", callback);
    return contract;
  }

  /**
   * Listen for UsdcTokenAddressUpdated events
   */
  listenForUsdcTokenAddressUpdated(
    provider: ethers.providers.Provider,
    callback: (event: any) => void
  ): ethers.Contract {
    const contract = getAgentMerchantContract(provider);
    contract.on("UsdcTokenAddressUpdated", callback);
    return contract;
  }
}

const merchantContractService = new MerchantContractService();
export default merchantContractService;

