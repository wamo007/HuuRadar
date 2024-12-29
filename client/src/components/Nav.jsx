import { Link, useLocation } from 'react-router-dom'
import { buttonVariants } from "@/components/ui/button"
import { assets } from '../assets/assets'
import { useEffect, useState } from 'react'

export default function Nav () {

    const [showMobileMenu, setShowMobileMenu] = useState(false)

    const location = useLocation()
    const { pathname } = location
    const isHome = pathname.split('/')

    useEffect(() => {
      if (showMobileMenu) {
          document.body.style.overflow = 'hidden'
      } else {
          document.body.style.overflow = 'auto'
      }
      return () => {
          document.body.style.overflow = 'auto'
      }
    },[showMobileMenu])

    return (
        <nav className={`${isHome[1] === '' ? 'absolute' : 'relative'} top-0 left-0 w-full z-10`}>
            <div className='container mx-auto flex justify-between items-center py-4 px-6 md:px-2 lg:px-10 xl:px-14 2xl:px-30'>
                <Link className='flex justify-between items-center gap-3' to='/'>
                    <img src={assets.logo} alt="Website Logo" width={50} />
                    <div className="brand text-gray-900 text-center font-bold text-2xl">HUURADAR</div>
                </Link>
                <ul className='hidden md:flex gap-7 md:gap-6 xl:gap-9 text-gray-900 text-xl font-semibold md:text-[19px]'>
                    <a href="#Header" className='cursor-pointer hover:text-gray-700'>Home</a>
                    <a href="#About" className='cursor-pointer hover:text-gray-700'>About</a>
                    <a href="#Contacts" className='cursor-pointer hover:text-gray-700'>Contact Me</a>
                </ul>
                <ul className="hidden md:flex justify-between items-center gap-3 [&_*]:text-center [&_*]:font-bold [&_*]:text-xl">
                    <li className={isHome[1] === '' ? '*:text-white hover:*:text-slate-200' : '*:text-gray-900 hover:*:text-blue-950'}><Link className={
                        `${isHome[1] === '' ? buttonVariants({ variant: '' }) : buttonVariants({ variant: 'outline' })} w-[120px]
                        `}>Log in</Link></li>
                    <li className={isHome[1] === '' ? '*:text-gray-900 hover:*:text-blue-950' : '*:text-white hover:*:text-slate-200'}><Link className={
                        `${isHome[1] === '' ? buttonVariants({ variant: 'outline' }) : buttonVariants({ variant: '' })} w-[120px]
                        `}>Sign up</Link></li>
                </ul>
                <img onClick={() => setShowMobileMenu(true)} src={assets.menu_icon} className='md:hidden w-7 ' alt="" />
            </div>
            {/* ----------mobile----------- */}
            <div className={`md:hidden ${showMobileMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 overflow-hidden bg-white transition-all`}>
                <div className='flex justify-end p-6 cursor-pointer'>
                    <img onClick={() => setShowMobileMenu(false)} src={assets.cross_icon} className='w-6' alt="" />
                </div>
                <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                    <a onClick={() => setShowMobileMenu(false)} href="#Header" className='px-4 py-2 rounded-full inline-block'>Home</a>
                    <a onClick={() => setShowMobileMenu(false)} href="#About" className='px-4 py-2 rounded-full inline-block'>About</a>
                    <a onClick={() => setShowMobileMenu(false)} href="#Contacts" className='px-4 py-2 rounded-full inline-block'>Contact me</a>
                    <a onClick={() => setShowMobileMenu(false)} href="#Log in" className='px-4 py-2 rounded-full inline-block'>Log in</a>
                    <a onClick={() => setShowMobileMenu(false)} href="#Sign up" className='px-4 py-2 rounded-full inline-block'>Sign up</a>
                </ul>
            </div>
        </nav>
    )
}