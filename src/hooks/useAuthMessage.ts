import authService from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";

const useAuthMessage = (walletAddress: string | undefined) => {
  const query = useQuery({
    queryKey: ["auth-message", walletAddress],
    queryFn: () => walletAddress ? authService.getAuthMessage(walletAddress) : null,
    enabled: !!walletAddress,
    refetchInterval: 60 * 1000
  });

  return query;
};

export default useAuthMessage;
