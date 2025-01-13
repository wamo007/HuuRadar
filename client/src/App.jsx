import Home from './pages/Home'
import Login from './pages/SignForm'
import Contacts from './components/Contacts'
import Demo from './pages/Demo'
import ScrollToHashElement from "@cascadia-code/scroll-to-hash-element"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Routes, Route } from 'react-router-dom'
import ResetPassword from './pages/ResetPassword'
import EmailVerify from './pages/EmailVerify'

function App() {

  return (
    <>
      <ToastContainer position='bottom-right' autoClose={3000} />
      <ScrollToHashElement behavior="smooth" />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contacts' element={<Contacts />} />
        <Route path='/demo' element={<Demo />} />
        <Route path='/registration' element={<Login signType='Sign Up' />} />
        <Route path='/login' element={<Login signType='Login' />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    </>
  )
}

export default App
