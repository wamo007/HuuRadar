import { useRef } from 'react'
import { assets } from '../assets/assets'
import { useIsVisible } from './ui/scrollingAnim'

export default function About() {

  const about1 = useRef()
  const isVisibleAbout1 = useIsVisible(about1)

  const about2 = useRef()
  const isVisibleAbout2 = useIsVisible(about2)

  return (
    <div className='relative min-h-screen  flex flex-col items-center justify-center mx-auto py-4 px-6 md:px-2 lg:px-10 xl:px-14 2xl:px-30 w-full overflow-hidden bg-[url("/second_bg1.png")] bg-cover' id='About'>
        <div ref={about1} className={`absolute top-3 px-7 py-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/30 md:shadow-lg transition-all ease-in duration-700 ${isVisibleAbout1 ? 'opacity-100' : 'opacity-0 translate-y-20'}`}>
            <h1 className='text-slate-900 text-4xl font-bold mb-2 text-center'>About <span className='underline underline-offset-4 decoration-1 under font-light'>The App</span></h1>
            <p className='text-gray-700 max-w-80 text-center'>Finding rentals was never easier!</p>
            <p className='text-gray-700 max-w-80 text-center'>Start in just <span className='font-semibold'>three</span> steps!</p>
        </div>
        <div  className='flex flex-wrap max-lg:mb-36 max-xl:mb-16 mt-40 xl:mt-36 justify-center xl:justify-between items-center gap-8 md:gap-12 lg:gap-16 xl:gap-20 *:bg-white *:text-slate-900 *:max-w-80 *:flex *:flex-col *:gap-3 *:h-[410px] transform-style-3d [&_*]:transform-style-3d perspective-1000 transition-all *:transition-all *:ease-in'>
            <div ref={about2} className={`p-3 rounded-lg shadow-xl hover:shadow-2xl shadow-slate-900 sm:hover:translate-z-16 md:hover:translate-z-44 xl:hover:translate-x-20 ${isVisibleAbout2 ? 'opacity-100' : 'opacity-0 -translate-x-28'}`}>
                <img src={assets.moreplace} alt="" className='rounded-lg' />
                <h2 className='text-4xl font-semibold text-center'>1. Sign Up</h2>
                <p className='text-2xl text-center'>Register with your email and verify your account.</p>
            </div>
            <div ref={about2} className={`p-3 rounded-lg shadow-xl hover:shadow-2xl shadow-slate-900 sm:hover:translate-z-16 md:hover:translate-z-44 ${isVisibleAbout2 ? 'opacity-100' : 'opacity-0 translate-y-28'}`}>
                <img src={assets.moreplace} alt="" className='rounded-lg' />
                <h2 className='text-4xl font-semibold text-center'>2. Search</h2>
                <p className='text-2xl text-center'>Select the city and some optional parameters and initiate the search.</p>
            </div>
            <div ref={about2} className={`p-3 rounded-lg shadow-xl hover:shadow-2xl shadow-slate-900 sm:hover:translate-z-16 md:hover:translate-z-44 xl:hover:-translate-x-20  ${isVisibleAbout2 ? 'opacity-100' : 'opacity-0 translate-x-28'}`}>
                <img src={assets.moreplace} alt="" className='rounded-lg' />
                <h2 className='text-4xl font-semibold text-center'>3. Get Notified!</h2>
                <div className='text-2xl text-center'>
                    <p>Click on "Notify me!" to get regular updates on your search terms!</p>
                    <a href="#More" className='text-xl underline underline-offset-4 decoration-1 under font-light text-gray-700'>See more...</a>
                </div>
            </div>
        </div>
    </div>
  )
}
