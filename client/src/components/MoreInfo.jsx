import { useRef } from 'react'
import { assets } from '../assets/assets'
import { useIsVisible } from './ui/scrollingAnim'

export default function MoreInfo() {

  const more1 = useRef()
  const isVisibleMore1 = useIsVisible(more1)
  const more2 = useRef()
  const isVisibleMore2 = useIsVisible(more2)
  const more3 = useRef()
  const isVisibleMore3 = useIsVisible(more3)
  
  return (
    <div className='relative min-h-screen flex flex-col items-center justify-center w-full overflow-hidden bg-[url("/buildings.png")] bg-cover bg-gray-800' id='More'>
        <div ref={more1} className={`absolute top-5 transition-all ease-in duration-700 ${isVisibleMore1 ? 'opacity-100' : 'opacity-0 translate-y-20'}`}>
            <h1 className='text-4xl font-semibold mb-2 text-center text-blue-300'>What do you get <span className='underline underline-offset-4 decoration-1 under font-light'>exactly</span>?</h1>
        </div>
        <div className='container py-4 px-6 md:px-2 lg:px-10 xl:px-14 2xl:px-30 mx-auto w-full lg:gap-20 md:gap-16 flex max-md:flex-wrap max-md:mt-32 justify-center items-center gap-3'>
            <img ref={more2} src={assets.houses} alt="" className={`w-1/2 h-1/2 transition-all ease-in-out duration-1000 ${isVisibleMore2 ? 'opacity-100 animate-slideInSpin10' : 'opacity-0'}`} />
            <div ref={more3} className={`p-3 w-1/2 transition-all ease-in-out duration-1000 max-md:w-full max-md:text-center ${isVisibleMore3 ? 'opacity-100' : 'opacity-0 translate-x-40'} text-3xl text-white *:py-5`}>
                <p>The app checks for the new rentals</p>
                <p>Where? On all of the rental websites</p>
                <p>How frequent? Every <span className='font-semibold'>15</span> minutes!</p>
                <p>Why register? To receive notification emails</p>
                <p>Any other question? <a href="#Contacts" className='underline underline-offset-4 decoration-1 under font-light text-blue-300'>Contact me!</a></p>
            </div>
        </div>
    </div>
  )
}
