import { useContext, useState } from 'react'
import axios from 'axios'
import { assets } from '@/assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { userContent } from '../context/UserContext'
import Nav from '@/components/Nav'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Login({ signType }) {
  const navigate = useNavigate()

  const { backendUrl, setLoggedIn, getUserData } = useContext(userContent)

  // const [signType, setSignType] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submitHandler = async (e) => {
    try {
      e.preventDefault()

      axios.defaults.withCredentials = true

      if (signType === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/auth/registration', 
          {name, email, password})

          if (data.success) {
            setLoggedIn(true)
            getUserData()
            toast.success(data.message)
            navigate('/')
          } else {
            toast.error(data.error)
          }
      } else { 
        const { data } = await axios.post(backendUrl + '/api/auth/login', 
          {email, password})

          if (data.success) {
            setLoggedIn(true)
            getUserData()
            toast.success(data.message)
            navigate('/')
          } else {
            toast.error(data.error)
          }
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className='bg-cover bg-center md:items-center flex items-center justify-center w-full overflow-hidden bg-slate-100 min-h-screen'>
      <Nav />
      <div className='flex items-center justify-center'>
        <div className='bg-slate-900 p-10 rounded-lg shadow-xl w-full sm:w-96 text-indigo-300 text-sm'>
          <h2 className='text-3xl font-semibold text-white text-center mb-3'>{signType === 'Sign Up' ? 'Create Account' : 'Sign In'}</h2>
          <p className='text-sm text-center mb-6'>{signType === 'Sign Up' ? 'Create your account' : 'Sign in to your existing account'}</p>
        
          <form onSubmit={submitHandler}>
            {signType === 'Sign Up' && (
              <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                <img src={assets.person} alt="" />
                <Input 
                  type="text" 
                  placeholder='Full Name' 
                  className='bg-transparent outline-none border-none rounded-lg md:text-md focus-visible:ring-0' 
                  value={name} 
                  onChange={e => setName(e.target.value)} />
              </div>
            )}
           
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
              <img src={assets.mail} alt="" />
              <Input 
                type="email" 
                placeholder='E-Mail' 
                className='bg-transparent outline-none border-none rounded-lg md:text-md focus-visible:ring-0' 
                value={email} 
                onChange={e => setEmail(e.target.value)} />
            </div>

            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
              <img src={assets.passKey} alt="" />
              <Input 
                type="password" 
                placeholder='Password' 
                className='bg-transparent outline-none border-none rounded-lg md:text-md focus-visible:ring-0' 
                value={password} 
                onChange={e => setPassword(e.target.value)} />
            </div>
            <Link to='/reset-password' className='text-indigo-500 cursor-pointer'>Forgot password?</Link>

            <Button className='mt-4 w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-800 text-white font-medium' type='submit'>{signType === 'Sign Up' ? 'Sign Up' : 'Login'}</Button>
          </form>

          {signType === 'Sign Up' ? (
            <p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{' '}
              <span onClick={() => navigate('/login')} className='text-blue-400 cursor-pointer underline'>Login</span>
            </p>
          ) : (
            <p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?{' '}
              <span onClick={() => navigate('/registration')} className='text-blue-400 cursor-pointer underline'>Sign Up</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}