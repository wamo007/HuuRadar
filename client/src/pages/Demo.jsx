import { assets } from '../assets/assets'
import { useState, useCallback, useEffect } from 'react'
import Tab from '../components/Tab.jsx'
import SearchPanel from '../components/Search.jsx'
import Nav from '@/components/Nav'
import { Button } from '@/components/ui/button'
import PlaceholderTab from '@/components/PlaceholderTab'
import AverageBarChart from '@/components/BarChart'
import { AveragePieChart } from '@/components/PieChart'
import WinnerChickenDinner from '@/components/WinnerChickenDinner'

export default function Demo() {
    
    const [responseData, setResponseData] = useState([])
    const [noResults, setNoResults] = useState({
      paparius: false,
      rentola: false
    })
    const [visibleItems, setVisibleItems] = useState({
      funda: 5,
      paparius: 5,
      rentola: 5,
    })
    const [loadingStatus, setLoadingStatus] = useState(false)
    const [error, setError] = useState(null)
  

    useEffect(() => {
      if ((responseData.funda?.length || responseData.paparius?.length) && !responseData.paparius?.length) {
        const papariusTimer = setTimeout(() => {
          setNoResults({ ...noResults, paparius: true })
        }, 30000)
  
        return () => clearTimeout(papariusTimer)
      } else {
        setNoResults({ ...noResults, paparius: false })
      }
    }, [responseData.paparius])
  
    useEffect(() => {
      if ((responseData.funda?.length || responseData.paparius?.length) && !responseData.rentola?.length) {
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
    
    const handleSeeMore = (itemContainer) => {
      setVisibleItems((prev) => ({
        ...prev,
        [itemContainer]: prev[itemContainer] + 5,
      }))
    }

    return (
      <>
        <div className='relative bg-slate-100 min-h-screen'>
          <Nav />
          <div className='bg-blue-700 bg-clip-padding backdrop-filter backdrop-blur bg-opacity-50 backdrop-saturate-50 backdrop-contrast-125 rounded-t-lg container flex flex-wrap justify-between items-center mx-auto py-4 sm:px-2 md:px-2 lg:px-10 xl:px-14 2xl:px-30 text-center'>
            {(responseData.funda || responseData.paparius || responseData.rentola) ? (
              <>
                <AverageBarChart responseData={responseData} />
                <div className="flex py-14 mx-auto">
                  {loadingStatus ? (
                    <div className="w-full text-xl sm:text-2x tracking-wider font-semibold text-center 
                      whitespace-nowrap overflow-hidden border-r-2 border-r-[rgba(255,255,255,.75)] animate-typewriterBlinkCursor">
                      Loading the results...
                    </div>
                  ) : (
                    <div className="w-full text-xl sm:text-2xl tracking-wider font-semibold text-center 
                      whitespace-nowrap overflow-hidden border-r-2 border-r-[rgba(255,255,255,.75)] animate-typewriterBlinkCursor">
                      Done! Check them out.
                    </div>
                  )}
                </div>
                <AveragePieChart responseData={responseData} />
              </>
            ) : (
              <div className="flex mx-auto">
                <div className="w-full text-sm sm:text-lg md:text-2xl  tracking-wider font-semibold text-center 
                  whitespace-nowrap overflow-hidden border-r-2 border-r-[rgba(255,255,255,.75)] animate-typewriterBlinkCursor">
                  Please initialize the search by choosing the city...
                </div>
              </div>
            )}
          </div>
          <div className='bg-blue-700 bg-clip-padding backdrop-filter backdrop-blur bg-opacity-50 backdrop-saturate-50 backdrop-contrast-125 rounded-b-lg container mx-auto justify-between items-center pb-4 px-6 md:px-2 lg:px-10 xl:px-14 2xl:px-30'>
            <hr className='w-3/4 h-1 mx-auto bg-gray-200 border-0 dark:bg-gray-700 rounded-xl mb-3.5'/>
            <SearchPanel responseDataChange={handleResponseDataChange} loadingStatus={setLoadingStatus} />
          </div>
          <div className="flex md:items-center w-full overflow-hidden" id='Demo'>
            <div className='container text-left mx-auto py-4 sm:px-2 md:px-2 lg:px-10 xl:px-14 2xl:px-30'>
              {(responseData.funda || responseData.paparius || responseData.rentola) ? (
                <div className='*:grid *:grid-cols-[repeat(auto-fill,_204px)] max-[408px]:*:grid-cols-[repeat(auto-fill,_180px)] *:justify-center *:justify-items-center *:items-center lg:*:gap-20 md:*:gap-16'>
                  {(responseData.funda?.length > 0 ) ? (
                    <div className="fundaResults">
                      <div className="logo place-items-center">
                        <img src={assets.funda} alt="Funda Logo Image" width={120} height={96} />
                        <h3 className='pt-4'>Results on Funda</h3>
                      </div>
                      <Tab className='fundaTab' responseData={responseData.funda.slice(0, visibleItems.funda)} />
                      {responseData.funda.length > visibleItems.funda && (
                        <div className='relative p-3 w-[204px] h-[304px] md:rounded-lg md:shadow-2xl max-md:border max-md:border-slate-400 max-[408px]:w-[180px]'>
                          <PlaceholderTab />
                          <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm md:rounded-xl border border-white/30 md:shadow-lg max-[408px]:w-[180px] w-[204px] h-[304px]'>
                          <Button className='relative top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-blue-900' onClick={() => handleSeeMore('funda')}>
                            See More...
                          </Button>
                        </div>
                      </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <h3>No Results on Funda...</h3>
                      <hr className='w-3/4 h-1 mx-auto my-8 bg-gray-200 border-0 dark:bg-gray-700 mt-10'/>
                    </>
                  )}

                  {(responseData.paparius?.length > 0) ? (
                    <>
                      <hr className='w-3/4 h-1 mx-auto my-8 bg-gray-200 border-0 dark:bg-gray-700 mt-10'/>
                      <div className="papariusResults">
                        <div className="logo place-items-center">
                          <img src={assets.paparius} alt="Paparius Logo Image" width={120} />
                          <h3 className='pt-4'>Results on Paparius</h3>
                        </div>
                        <Tab className='papariusTab' responseData={responseData.paparius.slice(0, visibleItems.paparius)} />
                        {responseData.paparius.length > visibleItems.paparius && (
                        <div className='relative p-3 w-[204px] h-[304px] md:rounded-lg md:shadow-2xl max-md:border max-md:border-slate-400 max-[408px]:w-[180px]'>
                          <PlaceholderTab />
                          <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg w-[204px] h-[304px]'>
                            <Button className='relative top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-blue-900' onClick={() => handleSeeMore('paparius')}>
                              See More...
                            </Button>
                          </div>
                        </div>
                        )}
                      </div>
                    </>
                  ) : (
                    noResults.paparius && (
                      <>
                        <h3>No Results on Paparius...</h3>
                        <hr className='w-3/4 h-1 mx-auto my-8 bg-gray-200 border-0 dark:bg-gray-700 mt-10'/>
                      </>
                  ))}

                  {(responseData.rentola?.length > 0 ) ? (
                    <>
                      <hr className='w-3/4 h-1 mx-auto my-8 bg-gray-200 border-0 dark:bg-gray-700 mt-10'/>
                      <div className="rentolaResults">
                        <div className="logo place-items-center">
                          <img src={assets.rentola} alt="Rentola Logo Image" width={120} />
                          <h3 className='pt-4'>Results on Rentola</h3>
                        </div>
                        <Tab className='rentolaTab' responseData={responseData.rentola.slice(0, visibleItems.rentola)} />
                        {responseData.rentola.length > visibleItems.rentola && (
                        <div className='relative p-3 w-[204px] h-[304px] md:rounded-lg md:shadow-2xl max-md:border max-md:border-slate-400 max-[408px]:w-[180px]'>
                        <PlaceholderTab />
                        <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg w-[204px] h-[304px]'>
                          <Button className='relative top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-blue-900' onClick={() => handleSeeMore('rentola')}>
                            See More...
                          </Button>
                        </div>
                      </div>
                        )}
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
          </div>
        </div>
      </>
    )
}