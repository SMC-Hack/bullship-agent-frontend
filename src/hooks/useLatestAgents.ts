import agentService from "@/services/agent.service";
import { useQuery } from "@tanstack/react-query";

const useLatestAgents = (page = 1) => {
  const query = useQuery({
    queryKey: ["latest-agents", page],
    queryFn: () => agentService.fetchTopAgents(page),
  });

  return query;
};

export default useLatestAgents;
