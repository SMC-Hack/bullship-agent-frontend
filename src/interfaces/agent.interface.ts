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
    results: TimeSeriesResult[];
  };
  week: {
    results: TimeSeriesResult[];
    result: TimeSeriesResult[]; // TODO: notify backend to change this
  };
  year: {
    results: TimeSeriesResult[];
  };
  tokenDetailBase: TokenDetailResult;
  tokenDetailPolygon: TokenDetailResult;
}

interface TokenDetailResult {
  result: TokenDetailResultItem[];
  meta: Meta;
}
export interface TokenDetailResultItem {
  chain_id: number;
  contract_address: string;
  name: string;
  symbol: string;
  amount: number;
  price_to_usd: number;
  value_usd: number;
  abs_profit_usd: number;
  roi: number;
  status: number;
}
interface Meta {
  system: System;
}
interface System {
  click_time: number;
  node_time: number;
  microservices_time: number;
  redis_time: number;
  total_time: number;
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
