import { useQuery } from "@tanstack/react-query";
import agentService from "@/services/agent.service";
import useAuth from "./useAuth";

const useAgent = (id: string) => {
  const { session } = useAuth();
  const accessToken = session?.accessToken;

  const query = useQuery({
    queryKey: ["agent", id, accessToken],
    queryFn: () =>
      accessToken ? agentService.fetchAgent(id, accessToken) : null,
    enabled: !!accessToken,
  });

  return query;
};

export default useAgent;
