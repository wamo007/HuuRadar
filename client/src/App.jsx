import './App.css'
import Home from './pages/Home'
import Registration from './pages/Registration'
import Login from './pages/Login'
import Contacts from './components/Contacts'
import Demo from './pages/Demo'
import { Toaster } from 'react-hot-toast'
import { Routes, Route } from 'react-router-dom'


function App() {

  return (
    <>
      <Toaster position='bottom-right' toastOptions={{duration: 2000}} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contacts' element={<Contacts />} />
        <Route path='/demo' element={<Demo />} />
        <Route path='/registration' element={<Registration />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App
