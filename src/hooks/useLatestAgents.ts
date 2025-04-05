import agentService from "@/services/agent.service";
import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";

const useLatestAgents = (page = 1) => {
  const { session } = useAuth();
  const accessToken = session?.accessToken;

  const query = useQuery({
    queryKey: ["latest-agents", page, accessToken],
    queryFn: () => accessToken ? agentService.fetchLatestAgents(page, accessToken) : null,
    enabled: !!accessToken,
  });

  return query;
};

export default useLatestAgents;
