import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { TokenSelector } from "./token-selector"
import { TokenInfo } from "@/interfaces/token.interface"

interface TradingStrategyFormProps {
  availableTokens: TokenInfo[]
  selectedTokens: string[]
  strategy: string
  onTokenToggle: (tokenId: string) => void
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onGoBack: () => void
  onCreateAgent: () => void
  isLoading: boolean
}

export function TradingStrategyForm({
  availableTokens,
  selectedTokens,
  strategy,
  onTokenToggle,
  onInputChange,
  onGoBack,
  onCreateAgent,
  isLoading = false,
}: TradingStrategyFormProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Trading Strategy</h2>
      <div className="space-y-4">
        <TokenSelector
          availableTokens={availableTokens}
          selectedTokens={selectedTokens}
          onTokenToggle={onTokenToggle}
        />

        <div>
          <Label htmlFor="strategy">Trading Instructions</Label>
          <Textarea
            id="strategy"
            name="strategy"
            value={strategy}
            onChange={onInputChange}
            placeholder="How to enter positions, take profit, and cut losses?"
            className="mt-1"
            rows={20}
          />
        </div>

        <div className="pt-4 flex gap-4">
          <Button variant="outline" onClick={onGoBack} className="flex-1">
            Back
          </Button>
          <Button
            onClick={onCreateAgent}
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
            isLoading={isLoading}
            disabled={selectedTokens.length === 0 || !strategy}
          >
            Create Agent
          </Button>
        </div>
      </div>
    </div>
  )
} 