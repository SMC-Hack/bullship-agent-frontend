import TrendingAgents from "@/components/home/trending-agents"
import Heading from "@/components/home/heading"
import BannerCarousel from "@/components/home/banner-carousel"
import LatestAgents from "@/components/home/latest-agents"

export default function HomeScreen() {

  // Mock data for demonstration
  const topAgents = [
    {
      id: "1",
      name: "Alpha Trader",
      symbol: "ALPHA",
      aum: 125000,
      pnl: 12.5,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "2",
      name: "Beta Investor",
      symbol: "BETA",
      aum: 85000,
      pnl: 8.2,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "3",
      name: "Gamma Strategy",
      symbol: "GAMMA",
      aum: 250000,
      pnl: 15.7,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "4",
      name: "Delta Hedge",
      symbol: "DELTA",
      aum: 175000,
      pnl: -2.3,
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  const agents = topAgents.slice(0, 10)

  return (
    <div className="container px-4 py-6 max-w-md mx-auto">
      <Heading />
      <BannerCarousel />
      <LatestAgents />
      <TrendingAgents agents={agents} />
    </div>
  )
}

