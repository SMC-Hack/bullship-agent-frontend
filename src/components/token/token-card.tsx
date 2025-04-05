import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TokenInfo } from "@/interfaces/token.interface"
import { XIcon } from "lucide-react"
import Image from "next/image"

interface TokenCardProps {
  token: TokenInfo
  isSelected: boolean
  onSelect: () => void
  showRemoveButton?: boolean
}

export function TokenCard({ token, isSelected, onSelect, showRemoveButton = false }: TokenCardProps) {
  return (
    <Card
      className={`relative p-3 cursor-pointer transition-all hover:bg-accent ${
        isSelected ? "ring-2 ring-primary bg-accent" : ""
      }`}
      onClick={onSelect}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect()
        }
      }}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Select ${token.name}`}
    >
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted flex items-center justify-center">
          {token.logoURI ? (
            <Image
              src={token.logoURI}
              alt={`${token.name} logo`}
              fill
              className="object-cover"
              sizes="32px"
            />
          ) : (
            <span className="text-xs font-medium">{token.symbol.slice(0, 2)}</span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-medium truncate">{token.symbol}</span>
            {showRemoveButton ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mr-1 hover:bg-destructive/10 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect()
                }}
              >
                <XIcon className="w-4 h-4" />
              </Button>
            ) : isSelected && (
              <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
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
          <p className="text-sm text-muted-foreground truncate">{token.name}</p>
        </div>
      </div>
    </Card>
  )
} 