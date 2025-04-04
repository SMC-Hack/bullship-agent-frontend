import agentService from "@/services/agent.service";
import { useQuery } from "@tanstack/react-query";

const useTopAgents = (page = 1) => {
  const query = useQuery({
    queryKey: ["top-agents", page],
    queryFn: () => agentService.fetchTopAgents(page),
  });

  return query;
};

export default useTopAgents;
