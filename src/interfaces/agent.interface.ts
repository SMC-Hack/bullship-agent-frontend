export interface Agent {
  id: number;
  name: string;
  description: string;
  userId: number;
  stockSymbol: string;
  stockAddress: string;
  imageUrl: string | null;
  selectedTokens: string;
  strategy: string;
  isRunning: boolean;
  nextFinalizeAt: Date | null;
  createdAt: Date;
  walletKey: {
    address: string;
  };
  user: {
    walletAddress: string;
  };
}

export interface GetAgentsQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: string;
}

export interface CreateAgentDto {
  name: string;
  stockSymbol: string;
  description: string;
  strategy: string;
  selectedTokens: string;
  imageUrl?: string | undefined;
}

export interface CreateAgentTokenDto {
  stockAddress: string;
}

export interface AgentResponse extends Agent {}

export interface CreateAgentResponse extends Agent {
  walletAddress: string;
}
