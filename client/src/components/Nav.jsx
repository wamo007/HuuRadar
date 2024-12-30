import { Link, useLocation } from 'react-router-dom'
import { buttonVariants } from "@/components/ui/button"
import { assets } from '../assets/assets'
import { useEffect, useState } from 'react'

export default function Nav () {

    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [scrollData, setScrollData] = useState({
        y: 0,
        lastY: 0
    })
    const [showNav, setShowNav] = useState(true)
    const [navColor, setNavColor] = useState(false)

    const location = useLocation()
    const { pathname } = location
    const isHome = pathname.split('/')

    const checkMobileMenu = () => {
        if (showMobileMenu === true) {
            setShowMobileMenu(false)
        } else {
            setShowMobileMenu(true)
        }
    }

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

    useEffect(() => {
        const handleScroll = () => {
            setScrollData(prev => {
                return {
                    y: window.scrollY,
                    lastY: prev.y
                }
            })
        }

        window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (scrollData.y > 150) {
            setShowNav(true)
            setNavColor(true)
        } else {
            setShowNav(false)
            setNavColor(false)
        }
        if (scrollData.lastY < scrollData.y) {
            setShowNav(true)
        } else {
            setShowNav(false)
        }
    }, [scrollData])

    return (
        <nav className={`${(isHome[1] === '') ? 'fixed' : 'sticky'} top-0 left-0 w-full ${showNav ? '-translate-y-full' : ''} ${navColor ? 'bg-slate-100 bg-clip-padding backdrop-filter backdrop-blur bg-opacity-50 backdrop-saturate-50 backdrop-contrast-125' : ''} transition duration-700 ease-out z-50`}>
            <div className='container mx-auto flex justify-between items-center py-4 px-6 md:px-2 lg:px-10 xl:px-14 2xl:px-30'>
                <Link className='flex justify-between items-center gap-3' to='/'>
                    <img src={assets.logo} alt="Website Logo" width={50} />
                    <div className="brand text-gray-900 text-center font-bold text-2xl">HUURADAR</div>
                </Link>
                <ul className='hidden md:flex gap-7 md:gap-6 xl:gap-9 text-gray-900 text-xl font-semibold md:text-[19px]'>
                    <Link to={{pathname: '/', hash: '#Header'}} className='cursor-pointer hover:text-gray-700'>Home</Link>
                    <Link to={{pathname: '/', hash: '#About'}} className='cursor-pointer hover:text-gray-700'>About</Link>
                    <Link to={{pathname: '/', hash: '#Contacts'}} className='cursor-pointer hover:text-gray-700'>Contact Me</Link>
                </ul>
                <ul className="hidden md:flex justify-between items-center gap-3 [&_*]:text-center [&_*]:font-bold [&_*]:text-xl">
                    <li className={isHome[1] === '' ? '*:text-white hover:*:text-slate-200' : '*:text-gray-900 hover:*:text-blue-950'}><Link to='/Login' className={
                        `${isHome[1] === '' ? buttonVariants({ variant: '' }) : buttonVariants({ variant: 'outline' })} w-[120px]
                        `}>Log in</Link></li>
                    <li className={isHome[1] === '' ? '*:text-gray-900 hover:*:text-blue-950' : '*:text-white hover:*:text-slate-200'}><Link to='/Registration' className={
                        `${isHome[1] === '' ? buttonVariants({ variant: 'outline' }) : buttonVariants({ variant: '' })} w-[120px]
                        `}>Sign up</Link></li>
                </ul>
                <img onClick={() => checkMobileMenu()} src={assets.menu_icon} className='md:hidden w-7 ' alt="" />
            </div>
            {/* ----------mobile----------- */}
            <div className={`md:hidden ${showMobileMenu ? 'fixed w-full' : 'h-0 w-0'} right-0  overflow-hidden bg-slate-100 bg-clip-padding backdrop-filter backdrop-blur bg-opacity-90 backdrop-saturate-50 backdrop-contrast-125 transition-all`}>
                {/* <div className='flex justify-end p-6 cursor-pointer'>
                    <img onClick={() => setShowMobileMenu(false)} src={assets.cross_icon} className='w-6' alt="" />
                </div> */}
                <ul className='flex flex-col items-center gap-5 m-5 px-5 text-lg font-medium'>
                    <Link onClick={() => setShowMobileMenu(false)} to={{pathname: '/', hash: '#Header'}} className='px-4 py-2 rounded-full inline-block'>Home</Link>
                    <Link onClick={() => setShowMobileMenu(false)} to={{pathname: '/', hash: '#About'}} className='px-4 py-2 rounded-full inline-block'>About</Link>
                    <Link onClick={() => setShowMobileMenu(false)} to={{pathname: '/', hash: '#Contacts'}} className='px-4 py-2 rounded-full inline-block'>Contact me</Link>
                    <Link onClick={() => setShowMobileMenu(false)} to='/Login' className='px-4 py-2 rounded-full inline-block'>Log in</Link>
                    <Link onClick={() => setShowMobileMenu(false)} to='/Registration' className='px-4 py-2 rounded-full inline-block'>Sign up</Link>
                </ul>
            </div>
        </nav>
    )
}