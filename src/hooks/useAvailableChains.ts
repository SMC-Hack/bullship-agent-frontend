import chainService from "@/services/chain.service";
import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";

const useAvailableChains = () => {
  const { session } = useAuth();
  const accessToken = session?.accessToken;

  const query = useQuery({
    queryKey: ["available-chains", accessToken],
    queryFn: () => accessToken ? chainService.getAvailableChains(accessToken) : null,
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return query;
};

export default useAvailableChains;
