import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TokenInfo } from "@/interfaces/token.interface"
import { Button } from "@/components/ui/button"
import { TokenSelectorModal } from "@/components/modals/token-selector-modal"
import { PlusIcon } from "lucide-react"
import { TokenCard } from "@/components/token/token-card"

interface TokenSelectorProps {
  availableTokens: TokenInfo[]
  selectedTokens: string[]
  onTokenToggle: (address: string) => void
  isLoading?: boolean
}

export function TokenSelector({ availableTokens, selectedTokens, onTokenToggle, isLoading = false }: TokenSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const selectedTokensList = availableTokens.filter(token => selectedTokens.includes(token.address))

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-base font-semibold">Trading Tokens</Label>
          <Button variant="outline" size="sm" disabled>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Tokens
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-[72px] w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base font-semibold">Trading Tokens</Label>
        <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Tokens
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {selectedTokensList.map((token) => (
          <TokenCard
            key={token.address}
            token={token}
            isSelected={true}
            onSelect={() => onTokenToggle(token.address)}
            showRemoveButton
          />
        ))}

        {selectedTokensList.length === 0 && (
          <Card className="col-span-2 p-6 text-center text-muted-foreground bg-muted/50">
            No tokens selected. Click "Add Tokens" to select trading tokens.
          </Card>
        )}
      </div>

      <TokenSelectorModal
        availableTokens={availableTokens}
        selectedTokens={selectedTokens}
        onTokenToggle={onTokenToggle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
} 