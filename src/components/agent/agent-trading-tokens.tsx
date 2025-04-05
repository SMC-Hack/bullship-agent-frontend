import { Agent } from '@/interfaces/agent.interface';
import AgentCurrentHoldings from './agent-current-holdings';

interface AgentTradingTokensProps {
  agent: Agent;
}

export default function AgentTradingTokens({ agent }: AgentTradingTokensProps) {
  let tokens;
  try {
    tokens = JSON.parse(agent.selectedTokens);
    console.log('Parsed tokens:', tokens);
  } catch (error) {
    console.error('Error parsing tokens:', error);
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">Trading Tokens</h2>
      <div className="flex flex-wrap gap-2">
        {Array.isArray(tokens) &&
          tokens.map((token: { symbol: string }) => (
            <div
              key={token.symbol}
              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {token.symbol}
            </div>
          ))}
      </div>
      <AgentCurrentHoldings agent={agent} />
    </div>
  );
}
