import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import useMerchant from "@/hooks/useMerchant"
import { ethers } from "ethers"
import { AgentResponse } from "@/types/agent"

interface BuyModalProps {
  agent: Pick<AgentResponse, "id" | "name" | "symbol" | "imageUrl" | "stockTokenAddress">;
  onClose: () => void;
}

const BuyModal = ({ agent, onClose }: BuyModalProps) => {
  const [amount, setAmount] = useState("100")
  const [isProcessing, setIsProcessing] = useState(false)
  const { purchaseStockByUsdc } = useMerchant()
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "")
    setAmount(value)
  }

  const handleSliderChange = (value: number[]) => {
    setAmount(value[0].toString())
  }

  const handleBuy = async () => {
    setIsProcessing(true)

    await purchaseStockByUsdc(agent.stockTokenAddress || "", ethers.utils.parseUnits(amount, 6))

    // Simulate transaction processing
    setTimeout(() => {
      setIsProcessing(false)
      onClose()
      // Show success notification here
    }, 2000)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Buy ${agent.symbol}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-center mb-6">
          <div className="relative h-16 w-16 mr-3">
            <Image
              src={agent.imageUrl || "/placeholder.svg"}
              alt={agent.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold">{agent.name}</h3>
            <p className="text-sm text-gray-500">${agent.symbol}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount (USDC)
            </label>
            <div className="relative">
              <Input id="amount" type="text" value={amount} onChange={handleAmountChange} className="pl-10 pr-4" />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
            </div>
          </div>

          <div>
            <Slider
              defaultValue={[100]}
              max={1000}
              step={10}
              value={[Number.parseFloat(amount) || 0]}
              onValueChange={handleSliderChange}
              className="my-6"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>$10</span>
              <span>$500</span>
              <span>$1000</span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Amount</span>
              <span className="font-medium">${amount} USDC</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Fee (1%)</span>
              <span className="font-medium">${(Number.parseFloat(amount) * 0.01).toFixed(2)} USDC</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between">
              <span className="text-gray-700 font-medium">You will receive</span>
              <span className="font-semibold">
                ${amount} ${agent.symbol}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            onClick={handleBuy}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
            disabled={isProcessing || Number.parseFloat(amount) <= 0}
          >
            {isProcessing ? "Processing..." : "Confirm Purchase"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BuyModal

