import { TokenInfo } from "@/interfaces/token.interface";
import { useQueries } from "@tanstack/react-query";
import tokenService from "@/services/token.service";
import useAuth from "./useAuth";

const useAvailableTokensInChains = (chainIds: number[] | undefined) => {
  const { session } = useAuth();
  const accessToken = session?.accessToken;

  const queries = useQueries({
    queries: (chainIds ?? []).map((chainId) => ({
      queryKey: ["available-tokens", chainId, accessToken],
      queryFn: () => (accessToken ? tokenService.getAvailableTokens(chainId, accessToken) : null),
      enabled: !!chainId && !!accessToken,
      staleTime: 5 * 60 * 1000 // Cache for 5 minutes
    }))
  });

  const isLoading = queries.some(query => query.isLoading);
  const isError = queries.some(query => query.isError);
  const data = queries.reduce<Record<string, TokenInfo[]>>((acc, query, index) => {
    if (query.data && chainIds?.[index]) {
      acc[chainIds[index].toString()] = query.data;
    }
    return acc;
  }, {});

  return {
    data,
    isLoading,
    isError
  };
};

export default useAvailableTokensInChains;
