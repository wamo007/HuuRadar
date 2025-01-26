import Nav from '@/components/Nav'
import { Button } from '@/components/ui/button'
import { userContent } from '@/context/UserContext'
import { useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function EmailVerify() {
  
  axios.defaults.withCredentials = true
  const { backendUrl, loggedIn, userData, getUserData } = useContext(userContent)
  const navigate = useNavigate()
  const inputRefs = useRef([])
  
  const handleInput = (e, index) => {
    if (e.target.value > 0 && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
        inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('')
    pasteArray.forEach((char, index) => {
        if (inputRefs.current[index]) {
            inputRefs.current[index].value = char
        }
    })
  }

  const submitHandler = async (e) => {
    try {
        e.preventDefault()
        const otpArray = inputRefs.current.map(e => e.value)
        const otp = otpArray.join('')

        const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp })

        if (data.success) {
            toast.success(data.message)
            getUserData()
            navigate('/')
        } else {
            toast.error(data.error)
        }
    } catch (error) {
        toast.error(error.message)
    }
  }

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true

      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp')
      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch(error) {
        toast.error(error.message)
    }
  }

  useEffect(() => {
    loggedIn && userData && userData.accountVerified && navigate('/')
  }, [loggedIn, userData])

  return (
    <div className='bg-cover bg-center md:items-center flex items-center justify-center w-full overflow-hidden bg-slate-100 dark:bg-gray-700 min-h-screen'>
      <Nav />
      <div className='flex items-center justify-center'>
        <div className='bg-slate-900 p-10 rounded-lg shadow-xl w-full sm:w-96 text-indigo-300 text-sm'>
          <h2 className='text-3xl font-semibold text-white text-center mb-3'>Email Verification</h2>
          <p className='text-lg text-center mb-6'>Enter the 6-digit one-time code sent to your email</p>
        
          <form onSubmit={submitHandler}>
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

            <p onClick={sendVerificationOtp} className='mb-4 text-indigo-500 cursor-pointer'>Reset OTP</p>

            <Button className='w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-800 text-white font-medium' type='submit'>Confirm Account</Button>
          </form>
        </div>
      </div>
    </div>
  )
}