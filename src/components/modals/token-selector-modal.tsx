import { useState, useCallback, useMemo } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TokenInfo } from "@/interfaces/token.interface"
import { TokenCard } from "@/components/token/token-card"

interface TokenSelectorModalProps {
  availableTokens: TokenInfo[]
  selectedTokens: string[]
  onTokenToggle: (address: string) => void
  isOpen: boolean
  onClose: () => void
}

export function TokenSelectorModal({ 
  availableTokens, 
  selectedTokens, 
  onTokenToggle, 
  isOpen, 
  onClose 
}: TokenSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleTokenSelect = useCallback((token: TokenInfo) => {
    onTokenToggle(token.address)
  }, [onTokenToggle])

  const filteredTokens = useMemo(() => {
    if (!searchQuery) return availableTokens
    const query = searchQuery.toLowerCase()
    return availableTokens.filter(token => 
      token.name.toLowerCase().includes(query) || 
      token.symbol.toLowerCase().includes(query) ||
      token.address.toLowerCase().includes(query)
    )
  }, [availableTokens, searchQuery])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Select Trading Tokens</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Search name, symbol, or address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />

          <ScrollArea className="h-[400px] pr-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {searchQuery ? "Search Results" : "All Tokens"}
              </h3>
              <div className="px-1 grid grid-cols-2 gap-2">
                {filteredTokens.map((token) => (
                  <TokenCard
                    key={`all-${token.address}`}
                    token={token}
                    isSelected={selectedTokens.includes(token.address)}
                    onSelect={() => handleTokenSelect(token)}
                  />
                ))}
              </div>
              
              {filteredTokens.length === 0 && (
                <Card className="p-4 text-center text-gray-500">
                  No tokens found
                </Card>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
} 