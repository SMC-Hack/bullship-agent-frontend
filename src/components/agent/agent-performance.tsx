import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PerformanceChart from "@/components/charts/performance-chart"
import { Agent, AgentResponse } from "@/interfaces/agent.interface"

interface AgentPerformanceProps {
  agent: AgentResponse
}

export default function AgentPerformance({ agent }: AgentPerformanceProps) {
  // Extract time series data safely
  const weekData = agent.week?.results ? Array.isArray(agent.week.results) ? agent.week.results : [agent.week.results] : []
  const monthData = agent.month?.results ? Array.isArray(agent.month.results) ? agent.month.results : [agent.month.results] : []
  const yearData = agent.year?.results ? Array.isArray(agent.year.results) ? agent.year.results : [agent.year.results] : []

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Performance</h2>
      <Tabs defaultValue="week" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
        </TabsList>
        <TabsContent value="week">
          <PerformanceChart 
            period="week" 
            pnl={agent.balanceSnapshots?.pnl || 0} 
            timeSeriesData={weekData} 
          />
        </TabsContent>
        <TabsContent value="month">
          <PerformanceChart 
            period="month" 
            pnl={agent.balanceSnapshots?.pnl || 0} 
            timeSeriesData={monthData} 
          />
        </TabsContent>
        <TabsContent value="year">
          <PerformanceChart 
            period="year" 
            pnl={agent.balanceSnapshots?.pnl || 0} 
            timeSeriesData={yearData} 
          />
        </TabsContent>
      </Tabs>
    </div>
  )
} 