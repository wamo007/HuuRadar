import { useState, useCallback } from 'react'
import './App.css'
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

      {(responseData.funda || responseData.paparius) ? (
        <div className='searchResults'>
          {(responseData.funda.length > 0 ) ? (
            <div className="fundaResults">Results on Funda
              <Tab className='fundaTab' responseData={responseData.funda} />
            </div>
          ) : (
            <p>No Results on Funda...</p>
          )}
          {(responseData.paparius.length > 0 ) ? (
            <div className="papariusResults">Results on Paparius
              <Tab className='papariusTab' responseData={responseData.paparius} />
            </div>
          ) : (
            <p>No Results on Paparius...</p>
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
