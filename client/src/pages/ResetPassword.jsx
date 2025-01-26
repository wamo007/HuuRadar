import Nav from '@/components/Nav'
import { assets } from '@/assets/assets'
import { Button } from '@/components/ui/button'
import { userContent } from '@/context/UserContext'
import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Input } from '@/components/ui/input'

export default function ResetPassword() {
  
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [otp, setOtp] = useState(0)
  const [emailSent, setEmailSent] = useState(false)
  const [otpFilled, setOtpFilled] = useState(false)
  const [otpSubmitted, setOtpSubmitted] = useState(false)
  
  axios.defaults.withCredentials = true
  const { backendUrl, loggedIn, userData, getUserData } = useContext(userContent)
  const navigate = useNavigate()
  const inputRefs = useRef([])

  const checkOtpFilled = () => {
    const filled = inputRefs.current.every(input => input?.value);
    setOtpFilled(filled);
  }

  const handleInput = (e, index) => {
    if (e.target.value && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
    }
    checkOtpFilled()
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
        inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').slice(0, 6)
    inputRefs.current.forEach((input, index) => {
      if (paste[index]) {
          input.value = paste[index];
      } else {
          input.value = '';
      }
    })
    checkOtpFilled()
  }
  
  useEffect(() => {
    if (emailSent && !otpSubmitted) {
        inputRefs.current[0]?.focus();
    }
  }, [emailSent, otpSubmitted])

  const submitEmail = async (e) => {
    e.preventDefault()

    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email })
      data.success ? toast.success(data.message) : toast.error(data.error)
      data.success && setEmailSent(true)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const submitOTP = async (e) => {
    e.preventDefault()
    const otpArray = inputRefs.current.map(e => e.value)
    const otpCheck = otpArray.join('')

    try {
      const { data } = await axios.post(backendUrl + '/api/auth/verify-reset-otp', {
        email, otp: otpCheck
      })
      if (data.success) {
        toast.success(data.message)
        setOtp(otpCheck)
        setOtpSubmitted(true)
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const submitNewPassword = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', {
        email, otp, newPassword
      })
      data.success ? toast.success(data.message) : toast.error(data.error)
      data.success && navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='bg-cover bg-center md:items-center flex items-center justify-center w-full overflow-hidden bg-slate-100 dark:bg-gray-700 min-h-screen'>
      <Nav />
      <div className='flex items-center justify-center'>
        <div className='bg-slate-900 p-10 rounded-lg shadow-xl w-full sm:w-96 text-indigo-300 text-sm'>

          {!emailSent && (
            <form onSubmit={submitEmail}>
              <h2 className='text-3xl font-semibold text-white text-center mb-3'>Password Reset</h2>
              <p className='text-lg text-center mb-6'>Enter the email that you have registered with</p>
              <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                <img src={assets.mail} alt="" />
                <Input 
                  type="email" 
                  placeholder='Registered E-Mail' 
                  className='bg-transparent outline-none border-none rounded-lg md:text-md focus-visible:ring-0' 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  required />
              </div>
              <Link to='/login' className='text-indigo-500 cursor-pointer'>Login instead</Link>
              <Button className='mt-4 w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-800 text-white font-medium' type='submit'>Submit</Button>
            </form>
          )}
          
          {emailSent && !otpSubmitted && (
            <form onSubmit={submitOTP}>
              <h2 className='text-3xl font-semibold text-white text-center mb-3'>Email Verification</h2>
              <p className='text-lg text-center mb-6'>Enter the 6-digit one-time code sent to your email</p>
              <div className='flex justify-between mb-8' onPaste={handlePaste}>
                  {Array(6).fill(0).map((_, index) => (
                      <input type="text" maxLength='1' key={index} required
                      className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
                      ref={(e) => inputRefs.current[index] = e}
                      onInput={(e) => handleInput(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      />
                  ))}
              </div>
              <div className="flex mb-4 justify-between">
                <p onClick={() => setEmailSent(false)} className='text-indigo-500 cursor-pointer'>Re-type Email</p>
                <p onClick={submitEmail} className='text-indigo-500 cursor-pointer'>Reset OTP</p>
              </div>
              <Button 
                className='w-full py-2.5 rounded-lg bg-gradient-to-r 
                from-indigo-500 to-indigo-800 text-white font-medium' 
                type='submit'
                disabled={!otpFilled}>
                Submit
              </Button>
            </form>
          )}
          
          {emailSent && otpSubmitted && (
            <form onSubmit={submitNewPassword}>
              <h2 className='text-3xl font-semibold text-white text-center mb-3'>New Password</h2>
              <p className='text-lg text-center mb-6'>Create a new password</p>
              <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                <img src={assets.passKey} alt="" />
                <Input 
                  type="password" 
                  placeholder='Password' 
                  className='bg-transparent outline-none border-none rounded-lg md:text-md focus-visible:ring-0' 
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)}
                  required />
              </div>
              <Link to='/login' className='text-indigo-500 cursor-pointer'>Login instead</Link>
              <Button className='mt-4 w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-800 text-white font-medium' type='submit'>Submit</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}