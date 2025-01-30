import { useRef } from 'react'
import { assets } from '../assets/assets'
import { useIsVisible } from './ui/scrollingAnim'

export default function About() {

  const about1 = useRef()
  const isVisibleAbout1 = useIsVisible(about1)

  const about2 = useRef()
  const isVisibleAbout2 = useIsVisible(about2)

  const videoRef1 = useRef(null)
  const videoRef2 = useRef(null)
  const videoRef3 = useRef(null)

  // Function to handle hover and play video
  const handleVideoHover = (videoRef) => {
    if (videoRef.current) {
      videoRef.current.play()
    }
  };

  // Function to handle hover out and pause video
  const handleVideoHoverOut = (videoRef) => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <div className='relative min-h-screen w-full place-items-center overflow-hidden bg-[url("/second_bg.png")] bg-cover dark:bg-gray-800 dark:bg-[url("/second_bg_dark.png")]' id='About'>
        <div className='py-4 w-11/12 mb-4 max-w-7xl flex flex-col items-center justify-center gap-3 md:gap-16'>
            <div ref={about1} className={`*:max-w-80 px-7 py-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/30 md:shadow-xl transition-all ease-in duration-700 ${isVisibleAbout1 ? 'opacity-100' : 'opacity-0 -translate-x-20'} dark:bg-black/10 dark:border-black/5`}>
                <h1 className='text-slate-900 text-4xl max-sm:text-3xl font-bold mb-2 text-center dark:text-white'>About <span className='underline underline-offset-4 decoration-1 under font-light dark:text-white'>The App</span></h1>
                <p className='text-gray-700 text-center max-sm:text-sm dark:text-gray-300'>Finding rentals was never easier!</p>
                <p className='text-gray-700 text-center max-sm:text-sm dark:text-gray-300'>Start in just <span className='font-semibold'>three</span> steps!</p>
            </div>
            <div ref={about2} className='flex flex-wrap justify-center xl:justify-between items-center gap-8 md:gap-12 lg:gap-16 xl:gap-20 *:bg-white *:text-slate-900 *:max-w-80 *:flex *:flex-col *:gap-3 *:h-[23rem] max-sm:*:h-auto *:transition-all *:ease-in dark:*:bg-slate-900 dark:*:border dark:*:border-white/30 dark:*:text-white'>
                <div 
                    className={`p-3 rounded-lg shadow-lg hover:shadow-2xl shadow-gray-400 hover:scale-105 md:hover:scale-110 lg:hover:scale-125 first:*:blur-sm first:*:hover:blur-none ${isVisibleAbout2 ? 'opacity-100' : 'opacity-0 -translate-x-20'} dark:shadow-slate-800`}
                    onMouseEnter={() => handleVideoHover(videoRef1)}
                    onMouseLeave={() => handleVideoHoverOut(videoRef1)}>
                    <video ref={videoRef1} className='rounded-lg' muted loop>
                        <source src={assets.signupvideo} type="video/webm" alt="Sign up tutorial" />
                    </video>
                    <h2 className='text-4xl max-sm:text-2xl font-semibold text-center dark:text-white'>1. Sign Up</h2>
                    <p className='text-2xl max-sm:text-xl text-center dark:text-gray-300'>Register with your email and verify your account</p>
                </div>
                <div 
                    className={`p-3 rounded-lg shadow-lg hover:shadow-2xl shadow-gray-400 hover:scale-105 md:hover:scale-110 lg:hover:scale-125 first:*:blur-sm first:*:hover:blur-none ${isVisibleAbout2 ? 'opacity-100' : 'opacity-0 translate-y-20'} dark:shadow-slate-800`}
                    onMouseEnter={() => handleVideoHover(videoRef2)}
                    onMouseLeave={() => handleVideoHoverOut(videoRef2)}>
                    <video ref={videoRef2} className='rounded-lg' muted loop>
                        <source src={assets.searchvideo} type="video/webm" alt="Search and Notify tutorial" />
                    </video>
                    <h2 className='text-4xl max-sm:text-2xl font-semibold text-center dark:text-white'>2. Search</h2>
                    <p className='text-2xl max-sm:text-xl text-center dark:text-gray-300'>Initiate the search and click on "Notify me!"</p>
                </div>
                <div 
                    className={`p-3 rounded-lg shadow-lg hover:shadow-2xl shadow-gray-400 hover:scale-105 md:hover:scale-110 lg:hover:scale-125 first:*:blur-sm first:*:hover:blur-none ${isVisibleAbout2 ? 'opacity-100' : 'opacity-0 translate-x-20'} dark:shadow-slate-800`}
                    onMouseEnter={() => handleVideoHover(videoRef3)}
                    onMouseLeave={() => handleVideoHoverOut(videoRef3)}>
                    <video ref={videoRef3} className='rounded-lg' muted loop>
                        <source src={assets.emailvideo} type="video/webm" alt="Sign up tutorial" />
                    </video>
                    <h2 className='text-4xl max-sm:text-2xl font-semibold text-center dark:text-white'>3. Get Notified!</h2>
                    <div className='text-2xl max-sm:text-xl text-center dark:text-gray-300'>
                        <p>Get updates by email!</p>
                        <a href="#More" className='text-xl max-md:underline underline-offset-4 hover:text-gray-700 group transition duration-300 dark:hover:text-gray-400'>
                            <span className="bg-left-bottom bg-gradient-to-r from-gray-900 to-gray-900 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out dark:from-gray-300 dark:to-gray-300">
                            More details below!
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}