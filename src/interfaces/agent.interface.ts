export interface BalanceSnapshot {
  id: number;
  agentId: number;
  balanceUSD: number;
  pnl: number;
  createdAt: Date;
}

export interface TimeSeriesResult {
  timestamp: number;
  value_usd: number;
}

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
  balanceSnapshots?: BalanceSnapshot;
  walletKey: {
    address: string;
  };
  user: {
    walletAddress: string;
  };
  month: {
    results: TimeSeriesResult[]
  },
  week: {
    results: TimeSeriesResult[],
    result: TimeSeriesResult[] // TODO: notify backend to change this
  },
  year: {
    results: TimeSeriesResult[]
  }
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
