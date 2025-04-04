import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PerformanceChartProps {
  period: "week" | "month" | "year"
  pnl: number
}

const PerformanceChart = ({ period, pnl }: PerformanceChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Generate random data based on pnl
    const dataPoints = 30 // Adjust based on period
    const data: number[] = []
    let value = 100

    for (let i = 0; i < dataPoints; i++) {
      // Create a trend that ends with the given pnl
      const randomFactor = Math.random() * 2 - 1
      const trend = ((pnl / dataPoints) * (i + 1)) / dataPoints
      const change = trend + randomFactor * 0.5
      value += value * (change / 100)
      data.push(value)
    }

    // Find min and max for scaling
    const min = Math.min(...data) * 0.99
    const max = Math.max(...data) * 1.01
    const range = max - min

    // Draw gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, rect.height)
    if (pnl >= 0) {
      gradient.addColorStop(0, "rgba(34, 197, 94, 0.2)")
      gradient.addColorStop(1, "rgba(34, 197, 94, 0)")
    } else {
      gradient.addColorStop(0, "rgba(239, 68, 68, 0.2)")
      gradient.addColorStop(1, "rgba(239, 68, 68, 0)")
    }

    // Draw line
    ctx.beginPath()
    data.forEach((value, index) => {
      const x = (index / (dataPoints - 1)) * rect.width
      const y = rect.height - ((value - min) / range) * rect.height

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    // Draw line
    ctx.strokeStyle = pnl >= 0 ? "#22c55e" : "#ef4444"
    ctx.lineWidth = 2
    ctx.stroke()

    // Fill area under the line
    const lastY = rect.height - ((data[data.length - 1] - min) / range) * rect.height
    ctx.lineTo(rect.width, lastY)
    ctx.lineTo(rect.width, rect.height)
    ctx.lineTo(0, rect.height)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()
  }, [period, pnl])

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-500 capitalize">{period}ly Performance</h3>
        <div className={cn("flex items-center font-medium", pnl >= 0 ? "text-green-600" : "text-red-600")}>
          {pnl >= 0 ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
          {Math.abs(pnl)}%
        </div>
      </div>
      <div className="w-full h-40">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          aria-label={`${period}ly performance chart showing ${pnl}% ${pnl >= 0 ? "gain" : "loss"}`}
        />
      </div>
    </Card>
  )
}

export default PerformanceChart

