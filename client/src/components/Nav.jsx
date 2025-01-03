import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, buttonVariants } from "@/components/ui/button"
import { assets } from '../assets/assets'
import { useContext, useEffect, useState } from 'react'
import { userContent } from '@/context/UserContext'

export default function Nav () {

    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [scrollData, setScrollData] = useState({
        y: 0,
        lastY: 0
    })
    const [showNav, setShowNav] = useState(true)
    const [navColor, setNavColor] = useState(false)

    const navigate = useNavigate()
    
    const location = useLocation()
    const { pathname } = location
    const isHome = pathname === '/'
    const isDemo = pathname === '/demo'
    const isLogin = pathname === '/login'
    const isRegistration = pathname === '/registration'

    const { userData } = useContext(userContent)

    const checkMobileMenu = () => {
        if (showMobileMenu === true) {
            setShowMobileMenu(false)
        } else {
            setShowMobileMenu(true)
        }
    }

    const checkMobileBack = () => {
        if (showMobileMenu === true) {
            setShowMobileMenu(false)
        } else {
            setShowMobileMenu(true)
        }
        navigate(-1)
    }

    useEffect(() => {
        // Function to handle back and forward navigation
        const handlePopState = (event) => {
        };
    
        // Listen for the popstate event
        window.addEventListener("popstate", handlePopState);
    
        // Cleanup listener when the component unmounts
        return () => {
          window.removeEventListener("popstate", handlePopState);
        };
      }, [location, navigate])

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
        if (scrollData.y > 50) {
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
        <nav className={`${isDemo ? 'sticky' : 'fixed'} top-0 left-0 w-full ${showNav ? '-translate-y-full' : ''} ${navColor ? 'bg-slate-100 bg-clip-padding backdrop-filter backdrop-blur bg-opacity-50 backdrop-saturate-50 backdrop-contrast-125' : ''} transition duration-700 ease-out z-50`}>
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
                { isLogin || isRegistration ? (
                    <li onClick={() => navigate(-1)} className={
                        `${buttonVariants({ variant: '' })} cursor-pointer pointer-events-auto w-[120px] text-white hover:text-slate-200 hidden md:flex items-center gap-3 text-center font-extrabold text-xl tracking-wider`
                        }>Back</li>
                ) : (
                    <ul className="hidden md:flex justify-between items-center gap-3 [&_*]:text-center [&_*]:font-bold [&_*]:text-xl">
                        { userData ? (
                            <li className={isHome ? '*:text-gray-900 hover:*:text-blue-950 ml-[132px]' : '*:text-white hover:*:text-slate-200 ml-[132px]'}><Link to='/account' className={
                                `${isHome ? buttonVariants({ variant: 'outline' }) : buttonVariants({ variant: '' })} w-[120px]
                                `}>{userData.name}</Link></li>
                        ) : (
                            <>
                                <li className={isHome ? '*:text-white hover:*:text-slate-200' : '*:text-gray-900 hover:*:text-blue-950'}><Link to='/login' className={
                                    `${isHome ? buttonVariants({ variant: '' }) : buttonVariants({ variant: 'outline' })} w-[120px]
                                    `}>Log in</Link></li>
                                <li className={isHome ? '*:text-gray-900 hover:*:text-blue-950' : '*:text-white hover:*:text-slate-200'}><Link to='/registration' className={
                                    `${isHome ? buttonVariants({ variant: 'outline' }) : buttonVariants({ variant: '' })} w-[120px]
                                    `}>Sign up</Link></li>
                            </>
                        )}
                    </ul>
                )}
                
                <img onClick={() => checkMobileMenu()} src={assets.menu_icon} className='md:hidden w-7 ' alt="" />
            </div>
            {/* ----------mobile----------- */}
            <div className={`md:hidden ${showMobileMenu ? 'fixed w-full' : 'h-0 w-0'} right-0  overflow-hidden bg-slate-100 bg-clip-padding backdrop-filter backdrop-blur bg-opacity-90 backdrop-saturate-50 backdrop-contrast-125 transition-all`}>
                <ul className='flex flex-col items-center gap-5 m-5 px-5 text-lg font-medium'>
                    <Link onClick={() => setShowMobileMenu(false)} to={{pathname: '/', hash: '#Header'}} className='px-4 py-2 rounded-full inline-block'>Home</Link>
                    <Link onClick={() => setShowMobileMenu(false)} to={{pathname: '/', hash: '#About'}} className='px-4 py-2 rounded-full inline-block'>About</Link>
                    <Link onClick={() => setShowMobileMenu(false)} to={{pathname: '/', hash: '#Contacts'}} className='px-4 py-2 rounded-full inline-block'>Contact me</Link>
                    { isLogin || isRegistration ? (
                        <li onClick={() => checkMobileBack(false)} className='px-4 py-2 rounded-full inline-block cursor-pointer pointer-events-auto'>Back</li>
                    ) : (
                        <>
                            { userData ? (
                                <Link onClick={() => setShowMobileMenu(false)} to='/Account' className='px-4 py-2 rounded-full inline-block'>{userData.name}</Link>
                            ) : (
                                <>
                                    <Link onClick={() => setShowMobileMenu(false)} to='/login' className='px-4 py-2 rounded-full inline-block'>Log in</Link>
                                    <Link onClick={() => setShowMobileMenu(false)} to='/registration' className='px-4 py-2 rounded-full inline-block'>Sign up</Link>
                                </>
                            )}
                        </>
                    )}    
                </ul>
            </div>
        </nav>
    )
}