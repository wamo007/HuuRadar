import * as React from "react"

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

import axios from 'axios'

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
      const response = await axios.post(
        'http://localhost:8080/api/', 
        { city, radius, sortGlobal, minPrice, maxPrice }
      )

      responseDataChange(response.data)
      setError(null)
    } catch (err) {
      console.error(err)
      responseDataChange([])
      setError(err.response?.data?.error || 'An unexpected error occured')
    }
  }

  // Notify App.jsx and Tab.jsx
  // useEffect(() => {
  //   responseDataChange(responseData, error)
  // }, [responseData, error, responseDataChange])
  
  return (
    <>
      <header>

        <form onSubmit={handleSubmit}>
          <Select name="cityDrop" id="cityDrop" onValueChange={(e) => setCity(e)} >
                <SelectTrigger className="w-[280px]">
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
              <select name="radiusDrop" id="radiusDrop" onChange={(e) => setRadius(e.target.value)} value={radius}>
                <option value="" disabled>Radius</option>
                <option value="0">No Preference</option>
                <option value="1">1KM</option>
                <option value="5">5KM</option>
                <option value="10">10KM</option>
              </select>

              <select name="sortDrop" id="sortDrop" onChange={(e) => setSortGlobal(e.target.value)} value={sortGlobal}>
                <option value="" disabled>Order</option>
                <option value="new">Newest First</option>
                <option value="old">Oldest First</option>
                <option value="cheap">Cheapest First</option>
                <option value="pricy">Priciest First</option>
              </select>
                        
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Enter Minimum Price"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Enter Maximum Price"
              />
            </>
          ) : (<></>)}

          <button type="submit">Confirm</button>
        </form>

      </header>
    </>
  )
}

export default Nav