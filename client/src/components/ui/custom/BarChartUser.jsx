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
    darkColor: "#60A5FA",
  },
}

export function BarChartUser({ queryData }) {

  const [chartData, setChartData] = useState([
    { provider: "Funda", desktop: 0 },
    { provider: "H.Anywhere", desktop: 0 },
    { provider: "Kamernet", desktop: 0 },
    { provider: "Paparius", desktop: 0 },
    { provider: "Huurwoningen", desktop: 0 },
    { provider: "Rentola", desktop: 0 },
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
    if (queryData) {
      const fundaAverage = averagePrices(queryData?.funda)
      const papariusAverage = averagePrices(queryData?.paparius)
      const rentolaAverage = averagePrices(queryData?.rentola)
      const hAnywhereAverage = averagePrices(queryData?.hAnywhere)
      const kamernetAverage = averagePrices(queryData?.kamernet)
      const huurwoningenAverage = averagePrices(queryData?.huurwoningen)

      setChartData([
        { provider: "Funda", desktop: fundaAverage },
        { provider: "HAnywhere", desktop: hAnywhereAverage },
        { provider: "Kamernet", desktop: kamernetAverage },
        { provider: "Paparius", desktop: papariusAverage },
        { provider: "Huurwoningen", desktop: huurwoningenAverage },
        { provider: "Rentola", desktop: rentolaAverage },
      ])
    }
  }, [queryData])

  return (
    <Card className='flex flex-col max-lg:justify-between w-full max-h-72 dark:bg-gray-800 dark:border-gray-600'>
      <CardHeader className='max-lg:pt-3 px-3'>
        <CardTitle>Provider's Latest Average Price</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[5.5rem] max-h-36 w-full">
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
              interval={0}
              angle={-20}
              tick={{ dy: -5 }}
              tickFormatter={(value) => value.slice(0, 9)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground dark:fill-current"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-center gap-2 text-sm">
        <div className="leading-none text-muted-foreground dark:text-muted">
          Showing average prices
        </div>
      </CardFooter>
    </Card>
  );
}