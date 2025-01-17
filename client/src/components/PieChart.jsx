"use client"

import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
//   ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"

const chartConfig = {
  prices: {
    label: "Prices",
  },
  funda: {
    label: "Funda",
    color: "hsl(var(--chart-1))",
  },
  paparius: {
    label: "Paparius",
    color: "hsl(var(--chart-2))",
  },
  rentola: {
    label: "Rentola",
    color: "hsl(var(--chart-3))",
  },
  hAnywhere: {
    label: "H.Anywhere",
    color: "hsl(var(--chart-4))",
  },
  kamernet: {
    label: "Kamernet",
    color: "hsl(var(--chart-5))",
  },
  other2: {
    label: "Other2",
    color: "hsl(var(--chart-3))",
  },
}

export function AveragePieChart({ responseData }) {

  const [chartData, setChartData] = useState([
    { provider: "funda", prices: 0, fill: "var(--color-funda)" },
    { provider: "paparius", prices: 0, fill: "var(--color-paparius)" },
    { provider: "rentola", prices: 0, fill: "var(--color-rentola)" },
    { provider: "hAnywhere", prices: 0, fill: "var(--color-hAnywhere)" },
    { provider: "kamernet", prices: 0, fill: "var(--color-kamernet)" },
    { provider: "other2", prices: 0, fill: "var(--color-other2)" },
  ])
  const [totalAveragePrice, setTotalAveragePrice] = useState(0)

  const averagePrices = (provider) => {
    if (!provider) return 0

    let validPrices = provider
    .map((tab) => {
      const price = tab.price.replace(/\s/g, "").match(/(\d+[,]*\d+)/g)

      // if two prices are in one tab (1200 - 1900)
      if (price && price.length === 2) {
        const [low, high] = price.map((price) => parseFloat(price.replace(/,/g, "")))
        return (low + high) / 2
        
      } else if (price && price.length === 1) {
        return parseFloat(tab.price.replace(/\D/g, ""))
      }
      return NaN
    })
    .filter((price) => !isNaN(price))

    if (validPrices.length > 0) {
      const totalPrice = validPrices.reduce((sum, price) => sum + price)
      return Math.round(totalPrice / validPrices.length)
    }
    return 0
  }

  useEffect(() => {
    if (responseData) {
      const fundaAverage = averagePrices(responseData?.funda)
      const papariusAverage = averagePrices(responseData?.paparius)
      const rentolaAverage = averagePrices(responseData?.rentola)
      const hAnywhereAverage = averagePrices(responseData?.hAnywhere)
      const kamernetAverage = averagePrices(responseData?.kamernet)

      const averages = [fundaAverage, papariusAverage, rentolaAverage, hAnywhereAverage, kamernetAverage].filter(average => average > 0)
      const totalAverage = 
        averages.length > 0 ? Math.round(averages.reduce((sum, average) => sum + average, 0) / averages.length) : 0

      setChartData([
        { provider: "Funda", prices: fundaAverage, fill: "var(--color-funda)" },
        { provider: "Paparius", prices: papariusAverage, fill: "var(--color-paparius)" },
        { provider: "Rentola", prices: rentolaAverage, fill: "var(--color-rentola)" },
        { provider: "H.Anywhere", prices: hAnywhereAverage, fill: "var(--color-hAnywhere)" },
        { provider: "Kamernet", prices: kamernetAverage, fill: "var(--color-kamernet)" },
      ])
      setTotalAveragePrice(totalAverage)
    }
  }, [responseData])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Total Average</CardTitle>
        <CardDescription>Top 6 providers</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-52 min-h-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="prices"
              nameKey="provider"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          €{totalAveragePrice.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          p/mo.
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {/* <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="leading-none text-muted-foreground">
          Showing total average price for the selection
        </div>
      </CardFooter>
    </Card>
  )
}