import { useRef } from 'react'
import { assets } from '../assets/assets'
import { useIsVisible } from './ui/scrollingAnim'

export default function MoreInfo() {

  const more1 = useRef()
  const isVisibleMore1 = useIsVisible(more1)
  const more2 = useRef()
  const isVisibleMore2 = useIsVisible(more2)
  
  return (
    <div className='relative min-h-screen w-full place-items-center overflow-hidden bg-[url("/buildings.png")] bg-cover bg-gray-800' id='More'>
        <div className='py-4 w-11/12 max-w-7xl min-h-screen flex flex-col items-center justify-center gap-3'>
          <div ref={more1} className={`px-7 py-5  bg-black/5 backdrop-blur-sm rounded-xl border border-black/5 md:shadow-lg transition-all ease-in duration-700 ${isVisibleMore1 ? 'opacity-100' : 'opacity-0 translate-y-20'}`}>
              <h1 className='text-4xl max-sm:text-3xl font-semibold mb-2 text-center text-blue-300'>What do you get <span className='underline underline-offset-4 decoration-1 under font-light'>exactly</span>?</h1>
          </div>
          <div ref={more2} className='py-4 mx-auto w-full flex max-md:flex-wrap justify-center items-center gap-5 md:gap-10'>
              <img src={assets.houses} alt="Buildings" className={`w-2/3 md:w-2/5 md:h-2/5 transition-all ease-in-out duration-1000 ${isVisibleMore2 ? 'opacity-100 animate-slideInSpin10' : 'opacity-0'}`} />
              <div className={`sm:p-1 md:p-2 lg:p-3 md:w-2/3 lg:w-1/2 transition-all ease-in-out duration-1000 max-md:w-full max-md:text-center ${isVisibleMore2 ? 'opacity-100' : 'opacity-0 translate-x-40'} text-xl sm:text-2xl lg:text-3xl text-white *:py-1 sm:*:py-5`}>
                  <p>The app checks for the new rentals</p>
                  <p>Where? On all of the rental websites</p>
                  <p>How frequent? Every <span className='font-semibold'>15</span> minutes!</p>
                  <p>Why register? To receive notification emails</p>
                  <p>Any other question? &nbsp;
                    <a href="#Contacts" className='max-md:underline underline-offset-4 font-light text-blue-300 group transition duration-300'>
                      <span className="bg-left-bottom bg-gradient-to-r from-blue-300 to-blue-300 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                      Contact me!
                      </span>
                    </a>
                  </p>
              </div>
          </div>
        </div>
    </div>
  )
}
