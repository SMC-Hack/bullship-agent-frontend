import { Label } from "@/components/ui/label"

interface Token {
  id: string
  name: string
}

interface TokenSelectorProps {
  availableTokens: Token[]
  selectedTokens: string[]
  onTokenToggle: (tokenId: string) => void
}

export function TokenSelector({ availableTokens, selectedTokens, onTokenToggle }: TokenSelectorProps) {
  return (
    <div>
      <Label>Trading Tokens</Label>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {availableTokens.map((token) => (
          <div
            key={token.id}
            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
              selectedTokens.includes(token.id)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onTokenToggle(token.id)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onTokenToggle(token.id)
              }
            }}
            aria-label={`Select ${token.name}`}
          >
            <div className="flex items-center justify-between">
              <span>{token.name}</span>
              {selectedTokens.includes(token.id) && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    width="10"
                    height="8"
                    viewBox="0 0 10 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 