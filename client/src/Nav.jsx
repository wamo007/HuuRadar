import { Input } from "@/components/ui/input"
import { Button } from "./components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from 'react'

function Nav({ responseDataChange }) {
  const [city, setCity] = useState('')
  const [radius, setRadius] = useState('')
  const [sortGlobal, setSortGlobal] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [error, setError] = useState(null)

  

  useEffect(() => {
    if (city) {
      setRadius('0')
      setSortGlobal('new')
      setMinPrice('')
      setMaxPrice('')
    } 
  }, [city]);

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!city) return

    try {
      const response = await fetch('http://localhost:8080/api/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, radius, sortGlobal, minPrice, maxPrice }),
      })
      
      const reader = response.body.getReader()
      const decoder = new TextDecoder("utf-8")
      let finished = false;

      while (!finished) {
          const { value, finished: streamDone } = await reader.read()
          finished = streamDone;

          if (value) {
              const chunk = decoder.decode(value, { stream: true })
              const lines = chunk.split("\n").filter(Boolean)

              lines.forEach((line) => {
                  try {
                      const jsonData = JSON.parse(line);
                      responseDataChange((prev) => [...prev, jsonData])
                  } catch (error) {
                      console.error("Error parsing chunk:", line, error)
                  }
              })
          }
      }
    } catch (err) {
      console.error(err)
      responseDataChange([])
      setError(err.response?.data?.error || 'An unexpected error occured')
    }
  }
  
  return (
    <>
      <header>
        <form onSubmit={handleSubmit}>
          <Select name="cityDrop" id="cityDrop" onValueChange={setCity} >
            <SelectTrigger className="w-[15rem]">
              <SelectValue placeholder="Select the city" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>City</SelectLabel>
                <SelectItem value="amstelveen">Amstelveen</SelectItem>
                <SelectItem value="amsterdam">Amsterdam</SelectItem>
                <SelectItem value="arnhem">Arnhem</SelectItem>
                <SelectItem value="breda">Breda</SelectItem>
                <SelectItem value="delft">Delft</SelectItem>
                <SelectItem value="den-haag">The Hague (Den Haag)</SelectItem>
                <SelectItem value="diemen">Diemen</SelectItem>
                <SelectItem value="eindhoven">Eindhoven</SelectItem>
                <SelectItem value="groningen">Groningen</SelectItem>
                <SelectItem value="haarlem">Haarlem</SelectItem>
                <SelectItem value="leiden">Leiden</SelectItem>
                <SelectItem value="maastricht">Maastricht</SelectItem>
                <SelectItem value="rotterdam">Rotterdam</SelectItem>
                <SelectItem value="tilburg">Tilburg</SelectItem>
                <SelectItem value="utrecht">Utrecht</SelectItem>        
              </SelectGroup>
            </SelectContent>
          </Select>
              
          {( city ) ? (
            <>
              <Select name="radiusDrop" id="radiusDrop" onValueChange={setRadius}>
                <SelectTrigger className="w-[15rem]">
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
                <SelectTrigger className="w-[15rem]">
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
                className="max-w-[12rem]"
                id="minPrice"
                name="minPrice"
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Enter Minimum Price"
              />
              <Input
                type="number"
                className="max-w-[12rem]"
                id="maxPrice"
                name="maxPrice"
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Enter Maximum Price"
              />
            </>
          ) : (<></>)}

          <Button type="submit">Confirm</Button>
        </form>

      </header>
    </>
  )
}

export default Nav