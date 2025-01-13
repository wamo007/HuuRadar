import { assets } from '../assets/assets'

export default function MoreInfo() {
  return (
    <div className='relative min-h-screen  flex flex-col items-center justify-center mx-auto py-4 px-6 md:px-2 lg:px-10 xl:px-14 2xl:px-30 w-full overflow-hidden bg-gradient-to-r from-gray-800 to-gray-400' id='More'>
        <div className='absolute top-5'>
            <h1 className='text-4xl font-semibold mb-2 text-center'>What do you get <span className='underline underline-offset-4 decoration-1 under font-light'>exactly</span>?</h1>
        </div>
        <div className='flex flex-wrap mt-32 justify-center md:justify-between items-center lg:gap-20 md:gap-16 *:max-w-80 *:flex *:flex-col *:gap-3 *:h-[410px]'>
            <div className='p-3 md:rounded-lg md:shadow-2xl max-md:border max-md:border-slate-400'>
                <img src={assets.moreplace} alt="" className='rounded-lg' />
                <h2 className='text-4xl font-semibold text-center'>Sign Up</h2>
                <p className='text-2xl text-center'>Register with your email to receive the updates on your query.</p>
            </div>
            <div className='p-3 md:rounded-lg md:shadow-2xl max-md:border max-md:border-slate-400'>
                <img src={assets.moreplace} alt="" className='rounded-lg' />
                <h2 className='text-4xl font-semibold text-center'>Search</h2>
                <p className='text-2xl text-center'>Select the city and some optional parameters and initiate the search.</p>
            </div>
            <div className='p-3 md:rounded-lg md:shadow-2xl max-md:border max-md:border-slate-400'>
                <img src={assets.moreplace} alt="" className='rounded-lg' />
                <h2 className='text-4xl font-semibold text-center'>Get Notified!</h2>
                <div className='text-2xl text-center'>
                    <p>Click on "Notify me!" to get regular updates on your search terms!</p>
                    <a href="#more" className='text-xl underline underline-offset-4 decoration-1 under font-light'>See more...</a>
                </div>
            </div>
        </div>
    </div>
  )
}
