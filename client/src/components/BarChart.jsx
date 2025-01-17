"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
//   ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState, useEffect } from "react";

const chartConfig = {
  desktop: {
    label: "in average €",
    color: "#2563EB",
  },
};

export default function AverageBarChart({ responseData }) {

  const [chartData, setChartData] = useState([
    { provider: "Funda", desktop: 0 },
    { provider: "Paparius", desktop: 0 },
    { provider: "Rentola", desktop: 0 },
    { provider: "H.Anywhere", desktop: 0 },
    { provider: "Kamernet", desktop: 0 },
    { provider: "June", desktop: 0 },
  ])

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

      setChartData([
        { provider: "Funda", desktop: fundaAverage },
        { provider: "Paparius", desktop: papariusAverage },
        { provider: "Rentola", desktop: rentolaAverage },
        { provider: "H.Anywhere", desktop: hAnywhereAverage },
        { provider: "Kamernet", desktop: kamernetAverage },
      ])
    }
  }, [responseData])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Average Prices</CardTitle>
        <CardDescription>Top 6 providers</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] max-h-52 w-full">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="provider"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-center gap-2 text-sm">
        {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="leading-none text-muted-foreground">
          Showing average prices for the top 6 providers
        </div>
      </CardFooter>
    </Card>
  );
}