import agentService from "@/services/agent.service";
import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";

const useTopAgents = (page = 1) => {
  const { session } = useAuth();
  const accessToken = session?.accessToken;

  const query = useQuery({
    queryKey: ["top-agents", page, accessToken],
    queryFn: () => accessToken ? agentService.fetchTopAgents(page, accessToken) : null,
    enabled: !!accessToken,
  });

  return query;
};

export default useTopAgents;
