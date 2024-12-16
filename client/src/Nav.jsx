import { useState, useEffect } from 'react'
import { City } from 'country-state-city'

import axios from 'axios'

function Nav({ responseDataChange }) {
  const [city, setCity] = useState('')
  const [radius, setRadius] = useState('0')
  const [sortGlobal, setSortGlobal] = useState('new')
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
          <select name="cityDrop" id="cityDrop" onChange={(e) => setCity(e.target.value)} value={city}>
            <option value="" disabled>City</option>
            {City.getCitiesOfCountry('NL').map((city) => (
                  <option key={city.name+city.latitude} value={city.name}>{city.name}</option>
                ))}
          </select>
              
          {( city ) ? (
            <>
              <select name="radiusDrop" id="radiusDrop" onChange={(e) => setRadius(e.target.value)} defaultValue=''>
                <option value="" disabled>Radius</option>
                <option value="0">No Preference</option>
                <option value="1">1KM</option>
                <option value="5">5KM</option>
                <option value="10">10KM</option>
              </select>

              <select name="sortDrop" id="sortDrop" onChange={(e) => setSortGlobal(e.target.value)} defaultValue=''>
                <option value="" disabled>Order</option>
                <option value="new">Latest First</option>
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