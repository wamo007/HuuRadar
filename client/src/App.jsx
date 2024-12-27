import './App.css'
import Home from './pages/Home'
import Registration from './pages/Registration'
import Login from './pages/Login'
import Contacts from './pages/Contacts'
import { Toaster } from 'react-hot-toast'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'

function App() {

  return (
    <>
      <Header />
      <Toaster position='bottom-right' toastOptions={{duration: 2000}} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/registration' element={<Registration />} />
        <Route path='/login' element={<Login />} />
        <Route path='/contacts' element={<Contacts />} />
      </Routes>
    </>
  )
}

export default App
