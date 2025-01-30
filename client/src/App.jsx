import Home from './pages/Home'
import Login from './pages/SignForm'
import Demo from './pages/Demo'
import ScrollToHashElement from "@cascadia-code/scroll-to-hash-element"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Routes, Route } from 'react-router-dom'
import ResetPassword from './pages/ResetPassword'
import EmailVerify from './pages/EmailVerify'
import Account from './pages/Account'
import ProviderReviews from './pages/ProviderReviews'

function App() {

  return (
    <>
      <ToastContainer pauseOnFocusLoss={false} position='bottom-right' autoClose={3000} />
      <ScrollToHashElement behavior="smooth" />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/provider-reviews' element={<ProviderReviews />} />
        <Route path='/account' element={<Account />} />
        <Route path='/search' element={<Demo />} />
        <Route path='/registration' element={<Login signType='Sign Up' />} />
        <Route path='/login' element={<Login signType='Login' />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    </>
  )
}

export default App
