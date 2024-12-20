import { useState, useCallback } from 'react'
import './App.css'
import Funda from './assets/funda.png'
import Paparius from './assets/paparius.png'
import Rentola from './assets/rentola.png'
import Tab from './Tab.jsx'
import Nav from './Nav.jsx'

function App() {
  const [responseData, setResponseData] = useState([])
  const [error, setError] = useState(null)

  const handleResponseDataChange = useCallback((data, err) => {
    setResponseData(data)
    setError(err)
  }, [])
  
  return (
    <div>
      
      <Nav responseDataChange={handleResponseDataChange} />

      {(responseData.funda || responseData.paparius || responseData.rentola) ? (
        <div className='searchResults'>
          {(responseData.funda.length > 0 ) ? (
            <div className="fundaResults">
              <div className="logo">
                <img src={Funda} alt="Funda Logo Image" width={120} height={96} />
                <h3>Results on Funda</h3>
              </div>
              <Tab className='fundaTab' responseData={responseData.funda} />
            </div>
          ) : (
            <h3>No Results on Funda...</h3>
          )}
          <hr className='w-3/4 h-1 mx-auto my-8 bg-gray-200 border-0 dark:bg-gray-700 mt-10'/>
          {(responseData.paparius.length > 0 ) ? (
            <div className="papariusResults">
              <div className="logo">
                <img src={Paparius} alt="Paparius Logo Image" width={120} />
                <h3>Results on Paparius</h3>
              </div>
              <Tab className='papariusTab' responseData={responseData.paparius} />
            </div>
          ) : (
            <h3>No Results on Paparius...</h3>
          )}
          <hr className='w-3/4 h-1 mx-auto my-8 bg-gray-200 border-0 dark:bg-gray-700 mt-10'/>
          {(responseData.rentola.length > 0 ) ? (
            <div className="rentolaResults">
              <div className="logo">
                <img src={Rentola} alt="Rentola Logo Image" width={120} />
                <h3>Results on Rentola</h3>
              </div>
              <Tab className='rentolaTab' responseData={responseData.rentola} />
            </div>
          ) : (
            <h3>No Results on Rentola...</h3>
          )}
        </div>
      ) : (
        <p>No data available. Please provide a valid link.</p>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    
    </div>
  )
}

export default App
