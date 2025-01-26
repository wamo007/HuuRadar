import { assets } from '../assets/assets'
import { useState, useCallback, useEffect, memo, useMemo } from 'react'
import Tab from '../components/Tab.jsx'
import SearchPanel from '../components/Search.jsx'
import Nav from '@/components/Nav'
import { Button } from '@/components/ui/button'
import PlaceholderTab from '@/components/PlaceholderTab'
import AverageBarChart from '@/components/ui/custom/BarChart'
import { AveragePieChart } from '@/components/ui/custom/PieChart'
import Checkmark from '@/components/ui/checkmark'
 
const providers = [
  { id: 'funda', label: 'Funda', logo: assets.funda },
  { id: 'hAnywhere', label: 'Housing Anywhere', logo: assets.hAnywhere  },
  { id: 'kamernet', label: 'Kamernet', logo: assets.kamernet },
  { id: 'paparius', label: 'Paparius', logo: assets.paparius },
  { id: 'huurwoningen', label: 'Huurwoningen', logo: assets.huurwoningen },
  { id: 'rentola', label: 'Rentola', logo: assets.rentola },
]

const ProviderData = memo(({ provider, responseData, noResults }) => {
  const { id, label, logo } = provider
  const [visibleItems, setVisibleItems] = useState(5)

  const handleSeeMore = () => {
    setVisibleItems((prev) => prev + 5)
  }

  return (
    <>
      {responseData.length > 0 ? (
        <>
          <div className='*:grid *:grid-cols-[repeat(auto-fill,_204px)] max-[408px]:*:grid-cols-[repeat(auto-fill,_180px)] *:justify-center *:justify-items-center *:items-center lg:*:gap-20 md:*:gap-16'>
            <div className="transition-all *:transition-all *:ease-in">
              <div className="place-items-center dark:place-content-center dark:w-[12.75rem] dark:h-[19rem] dark:bg-gray-500 dark:text-white dark:border dark:border-white/30 dark:md:rounded-lg dark:sm:shadow-xl">
                <img src={logo} alt={`${label} logo`} width={120} />
                <h3 className='pt-4 text-center'>Results on {label}</h3>
              </div>
              <Tab responseData={responseData.slice(0, visibleItems)} />
              {responseData.length > visibleItems && (
                <div className='relative p-3 w-[12.75rem] h-[19rem] bg-white dark:bg-gray-500 md:rounded-lg md:shadow-2xl max-md:border max-md:border-slate-400 max-[408px]:w-[11.25rem]'>
                  <PlaceholderTab />
                  <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white/10 dark:bg-white/5 backdrop-blur-sm md:rounded-lg border border-white/30 md:shadow-lg max-[408px]:w-[11.25rem] w-[12.75rem] h-[19rem]'>
                    <Button className='relative top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-gray-900' onClick={handleSeeMore}>
                      See More...
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <hr className='w-3/4 h-1 mx-auto my-8 bg-gray-200 border-0 rounded-3xl mt-10' />
        </>
      ) : (
        noResults && (
          <>
            <h3 className='text-center dark:text-muted italic pt-4'>No Results on {label} for the last 3 days...</h3>
            <hr className='w-3/4 h-1 mx-auto my-8 bg-gray-200 border-0 rounded-3xl mt-10' />
          </>
        )
      )}
    </>
  )
})

export default function Demo() {
  const [responseData, setResponseData] = useState({})
  const [firstSearch, setFirstSearch] = useState(false)
  const [noResults, setNoResults] = useState(
    providers.reduce((prevProvider, currentProvider) => ({ ...prevProvider, [currentProvider.id]: false }), {})
  )
  const [selectedProviders, setSelectedProviders] = useState([])
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [error, setError] = useState(null)

  // Give No Results for the provider once the loading is complete
  useEffect(() => {
    if (!loadingStatus) {
      const newNoResults = { ...noResults };
      providers.forEach(({ id }) => {
        if (selectedProviders.includes(id) && !responseData[id]?.length) {
          newNoResults[id] = true;
        }
      });
      setNoResults(newNoResults);
    }
  }, [loadingStatus, responseData, selectedProviders])

  const handleResponseDataChange = useCallback((data, err) => {
    setResponseData(data)
    setFirstSearch(true)
    setError(err)
  }, [])

  // First in First out the providers that have data
  const fifoProviders = useMemo(() => {
    return providers
      .filter((provider) => selectedProviders.includes(provider.id))
      .sort((a, b) => {
        const hasDataA = responseData[a.id]?.length > 0
        const hasDataB = responseData[b.id]?.length > 0
        if (hasDataA && !hasDataB) return -1
        if (!hasDataA && hasDataB) return 1
        return 0
      })
  }, [selectedProviders, responseData])

  return (
    <>
      <div className='relative bg-slate-100 dark:bg-gray-700 min-h-screen w-full'>
        <Nav />
        <div className='bg-white dark:bg-primary dark:*:text-white shadow-2xl-b-0 bg-clip-padding backdrop-filter backdrop-blur bg-opacity-50 dark:bg-opacity-100 backdrop-saturate-50 backdrop-contrast-125 rounded-t-lg flex md:flex-nowrap flex-wrap justify-between items-center mx-auto py-4 w-11/12 max-w-7xl px-6 md:px-2 lg:px-10 xl:px-14 2xl:px-30 text-center'>
          {firstSearch ? (
            <>
              <AverageBarChart responseData={responseData} />
              <div className="flex flex-col items-center justify-between px-1 mx-auto min-h-[250px] max-h-52 py-5">
                {loadingStatus ? (
                  <>
                    <img src={assets.loadingBuilding} width={180} alt="loading gif" className='w-180' />
                    <div className="w-full text-xl sm:text-2xl md:text-base xl:text-2xl tracking-wider font-semibold text-center 
                      whitespace-nowrap overflow-hidden border-r-2 border-r-[rgba(255,255,255,.75)] animate-typewriterBlinkCursor">
                      Loading the results...
                    </div>
                  </>
                ) : (
                  <>
                    <Checkmark />
                    <div className="w-full text-xl sm:text-2xl md:text-base xl:text-2xl tracking-wider font-semibold text-center 
                      whitespace-nowrap overflow-hidden border-r-2 border-r-[rgba(255,255,255,.75)] animate-typewriterBlinkCursor">
                      Done! Check them out.
                    </div>
                  </>
                )}
              </div>
              <AveragePieChart responseData={responseData} />
            </>
          ) : (
            <div className="flex mx-auto">
              <div className="w-full text-sm sm:text-lg md:text-2xl  tracking-wider font-semibold text-center 
                whitespace-nowrap overflow-hidden border-r-2 border-r-[rgba(255,255,255,.75)] animate-typewriterBlinkCursor">
                Please initialize the search...
              </div>
            </div>
          )}
        </div>
        <div className='bg-white dark:bg-primary shadow-xl bg-clip-padding backdrop-filter backdrop-blur bg-opacity-50 dark:bg-opacity-100 backdrop-saturate-50 backdrop-contrast-125 rounded-b-lg mx-auto justify-between items-center pb-6 md:pb-4 px-6 md:px-2 lg:px-10 xl:px-14 2xl:px-30 w-11/12 max-w-7xl  mb-3'>
          <hr className='w-3/4 h-1 mx-auto bg-gray-200 border-0 dark:bg-gray-700 rounded-xl mb-3.5' />
          <div className='relative flex justify-center min-[833px]:justify-start w-full transition-all ease-in-out duration-500'>
            <SearchPanel responseDataChange={handleResponseDataChange} loadingStatus={setLoadingStatus} providerSet={setSelectedProviders} />
          </div>
        </div>
        <div className="flex md:items-center w-full overflow-hidden" id='Demo'>
          <div className='w-full text-left mx-auto pt-7'>
            {Object.values(responseData).some((results) => results?.length) ? (
              <>
                {fifoProviders.map((provider) => (
                  <ProviderData
                    key={provider.id}
                    provider={provider}
                    responseData={responseData[provider.id] || []}
                    noResults={noResults[provider.id]}
                  />
                ))}
              </>
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