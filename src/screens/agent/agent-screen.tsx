import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, Star, ArrowUpRight, ArrowDownRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PerformanceChart from "@/components/charts/performance-chart"
import BuyModal from "@/components/modals/buy-modal"
import { cn } from "@/lib/utils"
import { useRouter } from "next/router"

export default function AgentScreen() {
  const router = useRouter()
  const [isWatchlisted, setIsWatchlisted] = useState(false)
  const [showBuyModal, setShowBuyModal] = useState(false)

  const paramsId = router.query.id as string;

  // Mock data for demonstration
  const agent = {
    id: paramsId,
    stockTokenAddress: "0xEfad80c27e21c443d4d49E68588bac3fBABeC58b", // TODO: get from backend
    name: "Alpha Trader",
    symbol: "ALPHA",
    description: "A sophisticated AI agent specializing in momentum trading strategies across major cryptocurrencies.",
    aum: 125000,
    pnl: 12.5,
    weeklyPnl: 3.2,
    monthlyPnl: 8.7,
    yearlyPnl: 42.3,
    image: "/placeholder.svg?height=120&width=120",
    creator: "0x1a2b...3c4d",
    createdAt: "2023-10-15",
    tradingInstructions: {
      enterPosition: "Enter positions when RSI is below 30 and MACD shows bullish crossover.",
      takeProfit: "Take profit when price reaches 15% above entry or RSI exceeds 70.",
      stopLoss: "Cut losses when price drops 5% below entry or support level breaks.",
    },
    tradingTokens: ["BTC", "ETH", "SOL", "AVAX"],
  }

  const handleGoBack = () => {
    router.back()
  }

  const handleWatchlistToggle = () => {
    setIsWatchlisted(!isWatchlisted)
  }

  const handleBuy = () => {
    setShowBuyModal(true)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="container px-4 py-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={handleGoBack} className="p-2 rounded-full hover:bg-gray-100" aria-label="Go back" tabIndex={0}>
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={handleWatchlistToggle}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
          tabIndex={0}
        >
          <Star
            size={20}
            className={cn("transition-colors", isWatchlisted ? "fill-yellow-400 text-yellow-400" : "text-gray-400")}
          />
        </button>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative h-16 w-16 mr-4">
          <Image src={agent.image || "/placeholder.svg"} alt={agent.name} fill className="rounded-full object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{agent.name}</h1>
          <p className="text-gray-500">${agent.symbol}</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mb-6">
        <div className="flex justify-between mb-2">
          <p className="text-gray-600">Assets Under Management</p>
          <p className="font-semibold">{formatCurrency(agent.aum)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-600">Performance (24h)</p>
          <div className={cn("flex items-center font-semibold", agent.pnl >= 0 ? "text-green-600" : "text-red-600")}>
            {agent.pnl >= 0 ? (
              <ArrowUpRight size={16} className="mr-1" />
            ) : (
              <ArrowDownRight size={16} className="mr-1" />
            )}
            {Math.abs(agent.pnl)}%
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Performance</h2>
        <Tabs defaultValue="week" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
          <TabsContent value="week">
            <PerformanceChart period="week" pnl={agent.weeklyPnl} />
          </TabsContent>
          <TabsContent value="month">
            <PerformanceChart period="month" pnl={agent.monthlyPnl} />
          </TabsContent>
          <TabsContent value="year">
            <PerformanceChart period="year" pnl={agent.yearlyPnl} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">About</h2>
        <p className="text-gray-700 mb-4">{agent.description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <p>Created by: {agent.creator}</p>
          <Info size={14} className="ml-1 cursor-pointer" />
        </div>
        <p className="text-sm text-gray-500">Created on: {new Date(agent.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Trading Strategy</h2>
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-1">Position Entry</h3>
            <p className="text-gray-700 text-sm">{agent.tradingInstructions.enterPosition}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-1">Profit Taking</h3>
            <p className="text-gray-700 text-sm">{agent.tradingInstructions.takeProfit}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-1">Loss Cutting</h3>
            <p className="text-gray-700 text-sm">{agent.tradingInstructions.stopLoss}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Trading Tokens</h2>
        <div className="flex flex-wrap gap-2">
          {agent.tradingTokens.map((token) => (
            <div key={token} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {token}
            </div>
          ))}
        </div>
      </div>

      <Button
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-6"
        onClick={handleBuy}
      >
        Buy ${agent.symbol}
      </Button>

      {showBuyModal && <BuyModal agent={agent} onClose={() => setShowBuyModal(false)} />}
    </div>
  )
}

