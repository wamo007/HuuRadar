import { Input } from "@/components/ui/input"
import { Button } from "./ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useState } from 'react'
import { Loader2 } from "lucide-react"
import { ComboboxCity } from "./ui/combobox"

function SearchPanel({ responseDataChange, loadingStatus }) {
  const [city, setCity] = useState('')
  const [radius, setRadius] = useState('0')
  const [sortGlobal, setSortGlobal] = useState('new')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [animateCount, setAnimateCount] = useState(false)

  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!city) return

    setLoading(true)
    loadingStatus(true)
    setAnimateCount(true)

    try {
      const response = await fetch('http://localhost:8080/api/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, radius, sortGlobal, minPrice, maxPrice }),
      })
      
      const reader = response.body.getReader()
      const decoder = new TextDecoder("utf-8")
      let responseData = {}
      let buffer = '' // to avoid errors while parsing incomplete chunks

      while (true) {
          const { value, done } = await reader.read()

          if (value) {
              buffer += decoder.decode(value, { stream: true })
              
              const lines = buffer.split("\n")
              buffer = lines.pop() // keeping incomplete lines in the buffer

              lines.forEach((line) => {
                  try {
                      const jsonData = JSON.parse(line)
                      responseData = { ...responseData, ...jsonData}
                      responseDataChange(responseData)
                  } catch (error) {
                      console.error("Error parsing chunk:", line, error)
                  }
              })
          }

          if (done) break
      }

      if (response.error) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong...',
          description: 'There was a problem with your request.',
        })
      } else {
        toast({title: 'Search Successful!'})
      }

    } catch (err) {
      console.error(err)
      responseDataChange([])
    }

    setLoading(false)
    loadingStatus(false)
  }

  return (
    <>
      <div className="">
        <form onSubmit={handleSubmit} className="flex flex-wrap flex-col sm:flex-row gap-6 justify-center md:justify-start items-center animate-slideIn4">

          <ComboboxCity selectedCity={city} onCityChange={setCity}/>
          
          {( city ) ? (
            <>
              <Select name="radiusDrop" id="radiusDrop" onValueChange={setRadius}>
                <SelectTrigger className="w-52 animate-slideIn4 text-md">
                  <SelectValue placeholder="Select the radius" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                  <SelectLabel>Radius</SelectLabel>
                    <SelectItem value="0">No Preference</SelectItem>
                    <SelectItem value="1">1KM</SelectItem>
                    <SelectItem value="5">5KM</SelectItem>
                    <SelectItem value="10">10KM</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
          
              <Select name="sortDrop" id="sortDrop" onValueChange={setSortGlobal}>
                <SelectTrigger className="w-52 animate-slideIn5 text-md">
                  <SelectValue placeholder="Select the order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                  <SelectLabel>Order</SelectLabel>
                    <SelectItem value="new">Newest First</SelectItem>
                    <SelectItem value="old">Oldest First</SelectItem>
                    <SelectItem value="cheap">Cheapest First</SelectItem>
                    <SelectItem value="pricy">Priciest First</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Input
                type="number"
                className="max-w-52 animate-slideIn6 md:text-md"
                id="minPrice"
                name="minPrice"
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Enter Minimum Price"
              />
              <Input
                type="number"
                className="max-w-52 animate-slideIn7 md:text-md"
                id="maxPrice"
                name="maxPrice"
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Enter Maximum Price"
              />
              <div className="flex gap-5 flex-wrap flex-col sm:flex-row justify-center">
              <Button type="submit" className={`${(animateCount === true) ? '' : 'animate-slideIn8'} w-[120px] text-md`} disabled={loading}>
                {loading && <Loader2 className="animate-spin" />}
                Search</Button>
              <Button className='w-[120px] animate-slideIn10 text-md' type='button'>Notify me!</Button>
              </div>
            </>
          ) : (<></>)}
        </form>
      </div>
    </>
  )
}

export default SearchPanel