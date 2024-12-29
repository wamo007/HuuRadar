import { useState, useCallback, useEffect } from 'react'
import { assets } from '../assets/assets'
// import Funda from '../assets/funda.png'
// import Paparius from '../assets/paparius.png'
// import Rentola from '../assets/rentola.png'
import Tab from '../components/Tab.jsx'
import SearchPanel from '../components/Search.jsx'

export default function Home() {
  const [responseData, setResponseData] = useState([])
  const [noResults, setNoResults] = useState({
    paparius: false,
    rentola: false
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!responseData.paparius?.length) {
      const papariusTimer = setTimeout(() => {
        setNoResults({ ...noResults, paparius: true })
      }, 30000)

      return () => clearTimeout(papariusTimer)
    } else {
      setNoResults({ ...noResults, paparius: false })
    }
  }, [responseData.paparius])

  useEffect(() => {
    if (!responseData.rentola?.length) {
      const rentolaTimer = setTimeout(() => {
        setNoResults({ ...noResults, rentola: true })
      }, 30000)

      return () => clearTimeout(rentolaTimer)
    } else {
      setNoResults({ ...noResults, rentola: false })
    }
  }, [responseData.rentola])

  const handleResponseDataChange = useCallback((data, err) => {
    setResponseData(data)
    setError(err)
  }, [])
  
  return (
    <div className='body'>

      <SearchPanel responseDataChange={handleResponseDataChange} />
      {(responseData.funda || responseData.paparius || responseData.rentola) ? (
        <div className='searchResults'>
          {(responseData.funda?.length > 0 ) ? (
            <div className="fundaResults">
              <div className="logo">
                <img src={assets.funda} alt="Funda Logo Image" width={120} height={96} />
                <h3>Results on Funda</h3>
              </div>
              <Tab className='fundaTab' responseData={responseData.funda} />
            </div>
          ) : (
            <h3>No Results on Funda...</h3>
          )}
          
          {(responseData.paparius?.length > 0) ? (
            <>
              <hr className='w-3/4 h-1 mx-auto my-8 bg-gray-200 border-0 dark:bg-gray-700 mt-10'/>
              <div className="papariusResults">
                <div className="logo">
                  <img src={assets.paparius} alt="Paparius Logo Image" width={120} />
                  <h3>Results on Paparius</h3>
                </div>
                <Tab className='papariusTab' responseData={responseData.paparius} />
              </div>
            </>
          ) : (
            noResults.paparius && <h3>No Results on Paparius...</h3>
          )}
          
          {(responseData.rentola?.length > 0 ) ? (
            <>
              <hr className='w-3/4 h-1 mx-auto my-8 bg-gray-200 border-0 dark:bg-gray-700 mt-10'/>
              <div className="rentolaResults">
                <div className="logo">
                  <img src={assets.rentola} alt="Rentola Logo Image" width={120} />
                  <h3>Results on Rentola</h3>
                </div>
                <Tab className='rentolaTab' responseData={responseData.rentola} />
              </div>
            </>
          ) : (
            noResults.rentola && <h3>No Results on Rentola...</h3>
          )}
        </div>
      ) : (
        <></>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    
    </div>
  )
}