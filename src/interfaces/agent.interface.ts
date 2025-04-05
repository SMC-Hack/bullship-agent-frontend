export interface Agent {
  id: string;
  name: string;
  symbol: string;
  aum: number;
  pnl: number;
  image: string;
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
  strategy: string;
  selectedTokens: string;
}

export interface CreateAgentTokenDto {
  stockSymbol: string;
  stockAddress: string;
}

export interface AgentResponse {
  walletAddress: string;
  id: number;
  name: string;
  createdAt: Date;
  userId: number;
  stockSymbol: string | null;
  stockAddress: string | null;
  imageUrl: string | null;
  selectedTokens: string;
  strategy: string;
  isRunning: boolean;
  nextFinalizeAt: Date | null;
}
