import tokenService from "@/services/token.service";
import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";

const useAvailableTokens = (chainId: number | undefined) => {
  const { session } = useAuth();
  const accessToken = session?.accessToken;

  const query = useQuery({
    queryKey: ["available-tokens", chainId, accessToken],
    queryFn: () => ((chainId && accessToken) ? tokenService.getAvailableTokens(chainId, accessToken) : null),
    enabled: !!chainId && !!accessToken,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return query;
};

export default useAvailableTokens;
