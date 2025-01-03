import './App.css'
import Home from './pages/Home'
import Login from './pages/SignForm'
import Contacts from './components/Contacts'
import Demo from './pages/Demo'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Routes, Route } from 'react-router-dom'


function App() {

  return (
    <>
      <ToastContainer position='bottom-right' toastOptions={{duration: 2000}} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contacts' element={<Contacts />} />
        <Route path='/demo' element={<Demo />} />
        <Route path='/registration' element={<Login signType="Sign Up" />} />
        <Route path='/login' element={<Login signType="Login" />} />
      </Routes>
    </>
  )
}

export default App
