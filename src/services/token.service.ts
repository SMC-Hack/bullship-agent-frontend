import { TokenInfo } from "@/interfaces/token.interface";
import api from "@/lib/axios";

const getAvailableTokens = async (chainId: number, accessToken: string): Promise<TokenInfo[]> => {
  try {
    const { data } = await api.get<TokenInfo[]>(
      `/token/available-tokens?chainId=${chainId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data;
  } catch (error) {
    throw new Error("Failed to fetch available tokens");
  }
};

const tokenService = {
  getAvailableTokens,
};

export default tokenService;
