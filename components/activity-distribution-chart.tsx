"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ActivityIcon as Activity2 } from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import type { ActivityDistribution } from "../types"

interface ActivityDistributionChartProps {
  data: ActivityDistribution[]
}

export function ActivityDistributionChart({ data }: ActivityDistributionChartProps) {
  const chartConfig = data.reduce(
    (config, item) => ({
      ...config,
      [item.tag.toLowerCase()]: {
        label: item.tag,
        color: item.color,
      },
    }),
    {},
  )

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <Activity2 className="h-5 w-5 text-purple-400" />
          Activity Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={2} dataKey="minutes">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      `${value} minutes (${data.find((d) => d.tag.toLowerCase() === name)?.percentage.toFixed(1)}%)`,
                      data.find((d) => d.tag.toLowerCase() === name)?.tag,
                    ]}
                  />
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {data.map((item) => (
            <div key={item.tag} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{item.tag}</p>
                <p className="text-xs text-gray-400">
                  {item.minutes}min ({item.percentage.toFixed(1)}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
