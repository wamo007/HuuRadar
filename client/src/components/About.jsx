import { useRef } from 'react'
import { assets } from '../assets/assets'
import { useIsVisible } from './ui/scrollingAnim'

export default function About() {

  const about1 = useRef()
  const isVisibleAbout1 = useIsVisible(about1)

  const about2 = useRef()
  const isVisibleAbout2 = useIsVisible(about2)

  return (
    <div className='relative min-h-screen w-full place-items-center overflow-hidden bg-[url("/second_bg1.png")] bg-cover' id='About'>
        <div className='py-4 w-11/12 mb-4 max-w-7xl flex flex-col items-center  justify-center gap-3 md:gap-16'>
            <div ref={about1} className={`*:max-w-80 px-7 py-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/30 md:shadow-lg transition-all ease-in duration-700 ${isVisibleAbout1 ? 'opacity-100' : 'opacity-0 translate-y-20'}`}>
                <h1 className='text-slate-900 text-4xl max-sm:text-3xl font-bold mb-2 text-center'>About <span className='underline underline-offset-4 decoration-1 under font-light'>The App</span></h1>
                <p className='text-gray-700 text-center max-sm:text-sm'>Finding rentals was never easier!</p>
                <p className='text-gray-700 text-center max-sm:text-sm'>Start in just <span className='font-semibold'>three</span> steps!</p>
            </div>
            <div ref={about2} className='flex flex-wrap justify-center xl:justify-between items-center gap-8 md:gap-12 lg:gap-16 xl:gap-20 *:bg-white *:text-slate-900 *:max-w-80  *:flex *:flex-col *:gap-3 *:h-[25.625rem] max-sm:*:h-auto *:transition-all *:ease-in'>
                <div className={`p-3 rounded-lg shadow-lg hover:shadow-2xl shadow-gray-400 hover:scale-105 md:hover:scale-110 ${isVisibleAbout2 ? 'opacity-100' : 'opacity-0 -translate-x-20'}`}>
                    <img src={assets.moreplace} alt="" className='rounded-lg' />
                    <h2 className='text-4xl max-sm:text-2xl font-semibold text-center'>1. Sign Up</h2>
                    <p className='text-2xl max-sm:text-xl text-center'>Register with your email and verify your account.</p>
                </div>
                <div className={`p-3 rounded-lg shadow-lg hover:shadow-2xl shadow-gray-400 hover:scale-105 md:hover:scale-110 ${isVisibleAbout2 ? 'opacity-100' : 'opacity-0 translate-y-20'}`}>
                    <img src={assets.moreplace} alt="" className='rounded-lg' />
                    <h2 className='text-4xl max-sm:text-2xl font-semibold text-center'>2. Search</h2>
                    <p className='text-2xl max-sm:text-xl text-center'>Select the city and some optional parameters and initiate the search.</p>
                </div>
                <div className={`p-3 rounded-lg shadow-lg hover:shadow-2xl shadow-gray-400 hover:scale-105 md:hover:scale-110  ${isVisibleAbout2 ? 'opacity-100' : 'opacity-0 translate-x-20'}`}>
                    <img src={assets.moreplace} alt="" className='rounded-lg' />
                    <h2 className='text-4xl max-sm:text-2xl font-semibold text-center'>3. Get Notified!</h2>
                    <div className='text-2xl max-sm:text-xl text-center'>
                        <p>Click on "Notify me!" to get regular updates on your search terms!</p>
                        <a href="#More" className='text-xl underline underline-offset-4 decoration-1 under font-light text-gray-700'>See more...</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
