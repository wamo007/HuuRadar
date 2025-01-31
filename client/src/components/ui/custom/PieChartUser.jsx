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
  hAnywhere: {
    label: "H.Anywhere",
    color: "hsl(var(--chart-4))",
  },
  kamernet: {
    label: "Kamernet",
    color: "hsl(var(--chart-5))",
  },
  kamerNL: {
    label: "KamerNL",
    color: "hsl(var(--chart-3))",
  },
  pararius: {
    label: "Pararius",
    color: "hsl(var(--chart-2))",
  },
  huurwoningen: {
    label: "Huurwoningen",
    color: "hsl(var(--chart-6))",
  },
  rentola: {
    label: "Rentola",
    color: "hsl(var(--chart-7))",
  }
}

export function PieChartUser({ queryData }) {

  const [chartData, setChartData] = useState([
    { provider: "funda", prices: 0, fill: "var(--color-funda)" },
    { provider: "hAnywhere", prices: 0, fill: "var(--color-hAnywhere)" },
    { provider: "kamernet", prices: 0, fill: "var(--color-kamernet)" },
    { provider: "kamerNL", prices: 0, fill: "var(--color-kamerNL)" },
    { provider: "pararius", prices: 0, fill: "var(--color-pararius)" },
    { provider: "huurwoningen", prices: 0, fill: "var(--color-huurwoningen)" },
    { provider: "rentola", prices: 0, fill: "var(--color-rentola)" },
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
    if (queryData) {
      const fundaAverage = averagePrices(queryData?.funda)
      const parariusAverage = averagePrices(queryData?.pararius)
      const rentolaAverage = averagePrices(queryData?.rentola)
      const hAnywhereAverage = averagePrices(queryData?.hAnywhere)
      const kamernetAverage = averagePrices(queryData?.kamernet)
      const kamerNLAverage = averagePrices(queryData?.kamerNL)
      const huurwoningenAverage = averagePrices(queryData?.huurwoningen)

      const averages = [fundaAverage, hAnywhereAverage, kamernetAverage, parariusAverage, huurwoningenAverage, kamerNLAverage, rentolaAverage].filter(average => average > 0)
      const totalAverage = 
        averages.length > 0 ? Math.round(averages.reduce((sum, average) => sum + average, 0) / averages.length) : 0

      setChartData([
        { provider: "Funda", prices: fundaAverage, fill: "var(--color-funda)" },
        { provider: "H.Anywhere", prices: hAnywhereAverage, fill: "var(--color-hAnywhere)" },
        { provider: "Kamernet", prices: kamernetAverage, fill: "var(--color-kamernet)" },
        { provider: "KamerNL", prices: kamerNLAverage, fill: "var(--color-kamerNL)" },
        { provider: "Pararius", prices: parariusAverage, fill: "var(--color-pararius)" },
        { provider: "Huurwoningen", prices: huurwoningenAverage, fill: "var(--color-huurwoningen)" },
        { provider: "Rentola", prices: rentolaAverage, fill: "var(--color-rentola)" },
      ])
      setTotalAveragePrice(totalAverage)
    }
  }, [queryData])

  return (
    <Card className="flex flex-col w-full justify-between dark:bg-gray-800 dark:border-gray-600">
      <CardHeader className="items-center pb-0 px-[21px] max-lg:pt-3">
        <CardTitle>Total Average Price</CardTitle>
        {/* <CardDescription>Top 6 providers</CardDescription> */}
      </CardHeader>
      <CardContent className="place-content-center flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square min-h-44 max-h-[12.5rem]"
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
                          className="fill-foreground dark:fill-current text-3xl font-bold"
                        >
                          €{totalAveragePrice.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground dark:fill-muted"
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
      <CardFooter className="flex-col gap-2 text-sm overflow-hidden ">
        <div className="leading-none text-muted-foreground dark:text-muted">
          Showing total average price
        </div>
      </CardFooter>
    </Card>
  )
}