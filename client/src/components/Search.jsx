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
import { toast } from 'react-hot-toast'
import { useState } from 'react'
import { Loader2 } from "lucide-react"
import { ComboboxCity } from "./ui/combobox"
import { cn } from "@/lib/utils"

function SearchPanel({ responseDataChange }) {
  const [city, setCity] = useState('')
  const [radius, setRadius] = useState('0')
  const [sortGlobal, setSortGlobal] = useState('new')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [animateCount, setAnimateCount] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!city) return

    setLoading(true)
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
        toast.error(response.error)
      } else {
        toast.success('Search Successful!')
      }

    } catch (err) {
      console.error(err)
      responseDataChange([])
    }

    setLoading(false)
  }

  return (
    <>
      <div className="container mx-auto justify-between items-center py-4 px-6 md:px-2 lg:px-10 xl:px-14 2xl:px-30">
        <form onSubmit={handleSubmit} className="flex flex-wrap flex-col sm:flex-row gap-6 justify-center md:justify-start items-center animate-slideIn4">

          <ComboboxCity selectedCity={city} onCityChange={setCity}/>
          
          {( city ) ? (
            <>
              <Select name="radiusDrop" id="radiusDrop" onValueChange={setRadius}>
                <SelectTrigger className="w-52 animate-slideIn4">
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
                <SelectTrigger className="w-52 animate-slideIn5">
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
                className="max-w-52 animate-slideIn6"
                id="minPrice"
                name="minPrice"
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Enter Minimum Price"
              />
              <Input
                type="number"
                className="max-w-52 animate-slideIn7"
                id="maxPrice"
                name="maxPrice"
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Enter Maximum Price"
              />
              <div className="flex gap-5 flex-wrap flex-col sm:flex-row justify-center">
              <Button type="submit" className={`${(animateCount === true) ? '' : 'animate-slideIn8'} w-[120px]`} disabled={loading}>
                {loading && <Loader2 className="animate-spin" />}
                Search</Button>
              <Button className='w-[120px] animate-slideIn10' type='button'>Notify me!</Button>
              </div>
            </>
          ) : (<></>)}
        </form>
      </div>
    </>
  )
}

export default SearchPanel