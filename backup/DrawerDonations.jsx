import { Minus, Plus } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useEffect, useRef, useState } from "react"

const data = [
  { amount: 4 },
  { amount: 3 },
  { amount: 2 },
  { amount: 3 },
  { amount: 2 },
  { amount: 2.78 },
  { amount: 1.89 },
  { amount: 2.39 },
  { amount: 3 },
  { amount: 2 },
  { amount: 2.78 },
  { amount: 1.89 },
  { amount: 3.49 },
];

export function DrawerDonation() {
  const [amount, setAmount] = useState(5)
  const contentEditableRef = useRef(null)
  const cursorPositionRef = useRef(0)

  function onClick(adjustment) {
    setAmount(prevAmount => Math.max(1, prevAmount + adjustment));
  }

  const handleInput = (e) => {
    const newValue = parseFloat(e.target.textContent)
    if (!isNaN(newValue)) {
        setAmount(Math.max(1, newValue))
    }
    // saving cursor line position
    const selection = window.getSelection()
    // return num of chars
    cursorPositionRef.current = selection.anchorOffset
  }

  useEffect(() => {
    if (contentEditableRef.current) {
        const range = document.createRange()
        const selection = window.getSelection()
        range.setStart(contentEditableRef.current.childNodes[0], cursorPositionRef.current)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
    }
    if (amount === 0) setAmount(1)
  }, [amount])

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="">donate</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Donation amount</DrawerTitle>
            <DrawerDescription>You can choose how much to donate</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(-1)}
                disabled={amount <= 1}
              >
                <Minus />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                <div
                    contentEditable="true"
                    ref={contentEditableRef}
                    className="text-7xl font-bold tracking-tighter dark:text-primary-foreground outline-none"
                    onInput={handleInput}
                    onBlur={handleInput}
                    suppressContentEditableWarning={true}
                    >
                  {amount}
                </div>
                <div className="text-[0.70rem] uppercase text-muted-foreground dark:text-muted">
                  Amount in euro
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(1)}
              >
                <Plus />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
            <div className="mt-3 h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <Bar
                    dataKey="amount"
                    style={{
                      fill: "hsl(var(--primary-foreground))",
                      opacity: 0.9,
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <DrawerFooter>
            <Button variant="outline" className='hover:animate-pulse'>Submit</Button>
            <DrawerClose asChild>
              <Button>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}