import { Agent, TokenDetailResultItem } from '@/interfaces/agent.interface';

interface AgentCurrentHoldingsProps {
  agent: Agent;
}

export default function AgentCurrentHoldings({
  agent,
}: AgentCurrentHoldingsProps) {
  const { tokenDetailBase, tokenDetailPolygon } = agent;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatROI = (roi: number) => {
    return `${(roi * 100).toFixed(2)}%`;
  };

  const renderTokenDetails = (
    tokens: TokenDetailResultItem[],
    chain: string
  ) => {
    if (!tokens || tokens.length === 0) return null;

    return (
      <div className="mb-6">
        {/* <h3 className="text-lg font-semibold mb-4 text-gray-700">
          {chain} Chain
        </h3> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokens.map((token) => (
            <div
              key={`${chain}-${token.contract_address}`}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800">{token.name}</h4>
                  <p className="text-sm text-gray-500">{token.symbol}</p>
                </div>
                <div
                  className={`text-sm font-medium ${
                    token.roi >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatROI(token.roi)}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">
                    {formatNumber(token.amount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price (USD):</span>
                  <span className="font-medium">
                    ${formatNumber(token.price_to_usd)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Value (USD):</span>
                  <span className="font-medium">
                    ${formatNumber(token.value_usd)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Profit/Loss:</span>
                  <span
                    className={`font-medium ${
                      token.abs_profit_usd >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    ${formatNumber(token.abs_profit_usd)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Chain</span>
                  <span className={`font-medium`}>{chain}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg mt-5 font-semibold mb-6 text-gray-800">
        Current Holdings
      </h2>
      {renderTokenDetails(tokenDetailBase?.result || [], 'Base')}
      {renderTokenDetails(tokenDetailPolygon?.result || [], 'Polygon')}
    </div>
  );
}
