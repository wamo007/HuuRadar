import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, buttonVariants } from "@/components/ui/button"
import { assets } from '../assets/assets'
import { useContext, useEffect, useState } from 'react'
import { userContent } from '@/context/UserContext'
import { toast } from 'react-toastify'
import axios from 'axios'

export default function Nav ({ className }) {

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
    const isDemo = pathname === '/search'
    const isAccount = pathname === '/account'
    const isReviews = pathname === '/provider-reviews'
    const isLogin = pathname === '/login'
    const isRegistration = pathname === '/registration'

    const { userData, backendUrl, setLoggedIn, setUserData } = useContext(userContent)

    const sendVerificationOtp = async () => {
        try {
            axios.defaults.withCredentials = true

            const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp')

            if (data.success) {
                navigate('/email-verify')
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch(error) {
            toast.error(error.message)
        }
    }

    const logout = async () => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/auth/logout')
            if(data.success){
                setLoggedIn(false)
                setUserData(false)
                toast.success('Successfully logged out!')
                navigate('/')
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

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

    // useEffect(() => {
    //   if (showMobileMenu) {
    //       document.body.style.overflow = 'hidden'
    //   } else {
    //       document.body.style.overflow = 'auto'
    //   }
    //   return () => {
    //       document.body.style.overflow = 'auto'
    //   }
    // },[showMobileMenu])

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
            if (showMobileMenu) setShowMobileMenu(false)
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
        <nav className={`${isDemo || isAccount || isReviews ? 'sticky' : 'fixed'} top-0 ${showNav ? '-translate-y-full' : ''} ${navColor ? 'bg-slate-100 bg-clip-padding backdrop-filter backdrop-blur bg-opacity-50 backdrop-saturate-50 backdrop-contrast-125' : ''} mx-auto w-full transition-all duration-700 ease-out z-50 h-[5.125rem] ${className}`}>
            <div className='mx-auto flex justify-between items-center w-11/12 max-w-7xl py-4 px-6 md:px-2 lg:px-10 xl:px-14 2xl:px-30'>
                <Link className='flex justify-between items-center gap-3' to='/'>
                    <img src={assets.logo} alt="Website Logo" width={50} />
                    <div className={`text-primary ${isHome ? 'dark:text-primary' : 'dark:text-primary-foreground'} text-center font-bold text-2xl max-[419px]:text-xl`}>HUURADAR</div>
                </Link>
                <ul className={`hidden ${isHome ? 'dark:text-primary' : 'dark:text-primary-foreground'} md:flex gap-7 md:gap-3 min-[802px]:gap-6 xl:gap-9 text-gray-900 text-xl font-semibold md:text-[16px] min-[802px]:text-[19px]`}>
                    <a href='/#Header' className={`cursor-pointer hover:text-gray-700 ${isHome ? '' : 'dark:*:from-primary-foreground dark:*:to-primary-foreground dark:hover:text-primary-foreground/80'} group transition duration-300`}>
                        <span className="bg-left-bottom bg-gradient-to-r from-gray-900 to-gray-900 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                        Home
                        </span>
                    </a>
                    <a href='/#About' className={`cursor-pointer hover:text-gray-700 ${isHome ? '' : 'dark:*:from-primary-foreground dark:*:to-primary-foreground dark:hover:text-primary-foreground/80'} group transition duration-300`}>
                        <span className="bg-left-bottom bg-gradient-to-r from-gray-900 to-gray-900 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                        About
                        </span>
                    </a>
                    <a href='/#Contacts' className={`cursor-pointer hover:text-gray-700 ${isHome ? '' : 'dark:*:from-primary-foreground dark:*:to-primary-foreground dark:hover:text-primary-foreground/80'} group transition duration-300`}>
                        <span className="bg-left-bottom bg-gradient-to-r from-gray-900 to-gray-900 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                        Contact Me
                        </span>
                    </a>
                </ul>
                { isLogin || isRegistration ? (
                    <ul className="hidden -ml-12 md:flex justify-between items-center gap-3 [&_*]:text-center [&_*]:font-bold [&_*]:text-xl">
                        { !isLogin && 
                            <li onClick={() => navigate('/login')} className={
                                `${buttonVariants({ variant: 'outline' })} cursor-pointer pointer-events-auto w-[120px]`}>
                                Login
                            </li> 
                        }
                        { !isRegistration && 
                            <li onClick={() => navigate('/registration')} className={
                                `${buttonVariants({ variant: 'outline' })} cursor-pointer pointer-events-auto w-[120px]`}>
                                Sign Up
                            </li> 
                        }
                        <li onClick={() => navigate(-1)} className={
                            `${buttonVariants({ variant: '' })} cursor-pointer pointer-events-auto w-[120px]`}>
                            Back
                        </li>
                    </ul>
                ) : (
                    <ul className="hidden md:flex justify-between items-center gap-3 [&_*]:text-center [&_*]:font-bold [&_*]:text-xl">
                        { userData ? (
                            <div className={`${isHome ? '*:ml-8' : ''} relative group flex justify-center items-center`}>
                                <div className={
                                    `${isHome ? buttonVariants({ variant: 'outline' }) : `${buttonVariants({ variant: '' })} dark:border dark:border-input dark:text-primary dark:bg-background dark:hover:bg-accent dark:hover:text-accent-foreground`} w-auto min-w-[200px] z-10 overflow-hidden
                                    `}>{userData.name}
                                </div>
                                <div className='absolute hidden group-hover:block top-0 z-8 pt-10 w-[140px] transition-all animate-listOpen'>
                                    <ul className={`list-none m-0 p-1 ${isHome ? 'bg-background hover:*:bg-gray-200': 'bg-gray-800 hover:*:bg-blue-900 text-primary-foreground dark:bg-background dark:hover:*:bg-gray-200 dark:text-primary'} *:cursor-pointer rounded-b-xl [&_*]:text-lg`}>
                                        { !userData.accountVerified && <li onClick={sendVerificationOtp}>Verify email</li> }
                                        { userData.accountVerified && <li onClick={() => navigate('/account')}>Account</li> }
                                        <li onClick={logout}>Logout</li>
                                    </ul>                              
                                </div>    
                            </div>
                        ) : (
                            <>
                                <li><Link to='/login' className={
                                    `${buttonVariants({ variant: 'outline' })} w-[120px] 
                                    `}>Log in</Link></li>
                                <li><Link to='/registration' className={
                                    `${buttonVariants({ variant: '' })} w-[120px]
                                    `}>Sign up</Link></li>
                            </>
                        )}
                    </ul>
                )}
                
                <svg
                    onClick={() => checkMobileMenu()}
                    className={`md:hidden w-7 text-primary ${isHome ? '' : 'dark:text-primary-foreground'}`}
                    width="36"
                    height="29"
                    viewBox="0 0 36 29"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <rect width="35.9988" height="4" rx="2" fill="currentColor" />
                    <rect x="13.0898" y="12.5" width="22.9083" height="4" rx="2" fill="currentColor" />
                    <rect x="4.91016" y="25" width="31.0899" height="4" rx="2" fill="currentColor" />
                </svg>

            </div>
            {/* ----------mobile----------- */}
            <div className={`md:hidden ${showMobileMenu ? 'fixed w-fit' : 'translate-x-10 h-0 w-0'} right-0 overflow-hidden rounded-bl-xl bg-white bg-clip-padding bg-opacity-95 transition-all`}>
                <ul className='flex flex-col items-end gap-5 m-5 px-5 text-lg font-medium'>
                    <a onClick={() => setShowMobileMenu(false)} href='/#Header' className='px-4 py-2 rounded-full inline-block'>Home</a>
                    <a onClick={() => setShowMobileMenu(false)} href='/#About' className='px-4 py-2 rounded-full inline-block'>About</a>
                    <a onClick={() => setShowMobileMenu(false)} href='/#Contacts' className='px-4 py-2 rounded-full inline-block'>Contact me</a>
                    { isLogin || isRegistration ? (
                        <>
                            { !isLogin && <Link to='/login' className='px-4 py-2 rounded-full inline-block'>Log in</Link> }
                            { !isRegistration && <Link to='/registration' className='px-4 py-2 rounded-full inline-block'>Sign up</Link> }
                            <li onClick={() => checkMobileBack(false)} className='px-4 py-2 rounded-full inline-block cursor-pointer pointer-events-auto'>
                                Back
                            </li>
                        </>
                      
                    ) : (
                        <>
                            { userData ? (
                                <>
                                    <Link to='/account' className='px-4 py-2 rounded-full inline-block'>{userData.name}</Link>
                                    { !userData.accountVerified && <li className='px-4 py-2 rounded-full inline-block' onClick={sendVerificationOtp}>Verify email</li> }
                                    <li onClick={logout} className='px-4 py-2 rounded-full inline-block'>Logout</li>
                                </>
                            ) : (
                                <>
                                    <Link to='/login' className='px-4 py-2 rounded-full inline-block'>Log in</Link>
                                    <Link to='/registration' className='px-4 py-2 rounded-full inline-block'>Sign up</Link>
                                </>
                            )}
                        </>
                    )}    
                </ul>
            </div>
        </nav>
    )
}

// // removed onClick={() => setShowMobileMenu(false)} 
// <Link onClick={() => setShowMobileMenu(false)} to={{pathname: '/', hash: '#Header'}} className='px-4 py-2 rounded-full inline-block'>Home</Link>
// <Link onClick={() => setShowMobileMenu(false)} to={{pathname: '/', hash: '#About'}} className='px-4 py-2 rounded-full inline-block'>About</Link>
// <Link onClick={() => setShowMobileMenu(false)} to={{pathname: '/', hash: '#Contacts'}} className='px-4 py-2 rounded-full inline-block'>Contact me</Link>