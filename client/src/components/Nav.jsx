import { Link } from 'react-router-dom'
import { buttonVariants } from "@/components/ui/button"
import Logo from '../assets/logo.png'

export default function Nav () {

    return (
        <nav>
            <Link to='/'>
                <img src={Logo} alt="Website Logo" width={60} />
                <div className="brand text-gray-500 text-center font-bold text-3xl">RENT NL</div>
            </Link>
            <ul className="navLinks [&_*]:text-center [&_*]:font-bold [&_*]:text-lg">
                <li className='*:text-gray-500 hover:*:text-gray-900'><Link to='/contacts'>Contact Me</Link></li>
                <li className='*:text-black'><Link className={
                    buttonVariants({ variant: 'outline' })
                    }>Log in</Link></li>
                <li className='hover:*:text-slate-100'><Link className={
                    buttonVariants({ variant: '' })
                    }>Sign up</Link></li>
            </ul>
        </nav>
    )
}