import { PAGE_SIZE } from "@/constants/pagniation";
import {
  AgentResponse,
  CreateAgentDto,
  CreateAgentResponse,
  CreateAgentTokenDto,
  GetAgentsQuery,
} from "@/interfaces/agent.interface";
import api from "@/lib/axios";

const fetchTopAgents = async (page: number, accessToken: string) => {
  return fetchAgents({ page, limit: PAGE_SIZE, sortBy: "createdAt", sortDirection: "desc" }, accessToken);
};

const fetchLatestAgents = async (page: number, accessToken: string) => {
  return fetchAgents({ page, limit: PAGE_SIZE, sortBy: "createdAt", sortDirection: "desc" }, accessToken);
};

const fetchAgents = async (
  query: GetAgentsQuery = {},
  accessToken: string
): Promise<AgentResponse[]> => {
  try {
    const params = new URLSearchParams();
    if (query.page) params.append("page", query.page.toString());
    if (query.limit) params.append("limit", query.limit.toString());
    if (query.search) params.append("search", query.search);
    if (query.sortBy) params.append("sortBy", query.sortBy);
    if (query.sortDirection)
      params.append("sortDirection", query.sortDirection);

    const { data } = await api.get<AgentResponse[]>(
      `/agent?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data;
  } catch (error) {
    throw new Error("Failed to fetch agents");
  }
};

const fetchAgent = async (agentId: string, accessToken: string): Promise<AgentResponse> => {
  try {
    const { data } = await api.get<AgentResponse>(`/agent/${agentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (error) {
    throw new Error("Failed to fetch agent");
  }
};

const createAgent = async (
  createAgentDto: CreateAgentDto,
  accessToken: string
): Promise<CreateAgentResponse> => {
  try {
    const { data } = await api.post<CreateAgentResponse>("/agent", createAgentDto, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (error) {
    throw new Error("Failed to create agent");
  }
};

const createAgentToken = async (
  agentId: string,
  createAgentTokenDto: CreateAgentTokenDto,
  accessToken: string
): Promise<AgentResponse> => {
  try {
    const { data } = await api.post<AgentResponse>(
      `/agent/${agentId}/token`,
      createAgentTokenDto,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data;
  } catch (error) {
    throw new Error("Failed to create agent token");
  }
};

const agentService = {
  fetchTopAgents,
  fetchLatestAgents,
  fetchAgents,
  fetchAgent,
  createAgent,
  createAgentToken,
};

export default agentService;
