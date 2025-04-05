import { ChainInfo } from "@/interfaces/chain.interface";
import api from "@/lib/axios";

const getAvailableChains = async (accessToken: string): Promise<ChainInfo[]> => {
  try {
    const { data } = await api.get<ChainInfo[]>(`/chain/available`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (error) {
    throw new Error("Failed to fetch available chains");
  }
};

const getChainInfo = async (chainId: number): Promise<ChainInfo> => {
  try {
    const { data } = await api.get<ChainInfo>(`/chain/info/${chainId}`);
    return data;
  } catch (error) {
    throw new Error("Failed to fetch chain info");
  }
};

const chainService = {
  getAvailableChains,
  getChainInfo,
};

export default chainService;
