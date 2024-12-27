import { Link } from 'react-router-dom'
import { buttonVariants } from "@/components/ui/button"
import Logo from '../assets/logo.png'

export default function Nav () {

    return (
        <nav className="absolute top-0 left-0 w-full z-10">
            <div className='container mx-auto flex justify-between items-center py-4 px-6 md:px-20 lg:px-31'>
                <Link className='flex justify-between items-center gap-3' to='/'>
                    <img src={Logo} alt="Website Logo" width={60} />
                    <div className="brand text-gray-900 text-center font-bold text-3xl">HUURADAR</div>
                </Link>
                <ul className='hidden md:flex gap-7 text-gray-900 text-xl font-semibold'>
                    <a href="#Header" className='cursor-pointer hover:text-gray-700'>Home</a>
                    <a href="#About" className='cursor-pointer hover:text-gray-700'>About</a>
                    <a href="#Contacts" className='cursor-pointer hover:text-gray-700'>Contact Me</a>
                </ul>
                <ul className="flex justify-between items-center gap-3 [&_*]:text-center [&_*]:font-bold [&_*]:text-xl">
                    <li className='*:text-white hover:*:text-slate-200'><Link className={
                        `${buttonVariants({ variant: '' })} w-[120px]
                        `}>Log in</Link></li>
                    <li className='*:text-gray-900 hover:*:text-blue-950'><Link className={
                        `${buttonVariants({ variant: 'outline' })} w-[120px]
                        `}>Sign up</Link></li>
                </ul>
            </div>
        </nav>
    )
}