import { assets } from "@/assets/assets";
import Nav from "@/components/Nav";
import { Button } from "@/components/ui/button";
import { userContent } from "@/context/UserContext";
import { Input } from "@/components/ui/input";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export default function Account() {

  const { backendUrl, userData } = useContext(userContent)
  
  const [openChangeUser, setOpenChangeUser] = useState(false)
  const [openChangeName, setOpenChangeName] = useState(false)
  const [openChangePassword, setOpenChangePassword] = useState(false)
  const [name, setName] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const email = userData.email

  const cancelChange = async (e) => {
    e.preventDefault()

    setName('')
    setOldPassword('')
    setNewPassword('')
    setOpenChangeName(false)
    setOpenChangePassword(false)
    setOpenChangeUser(false)
  }

  const submitChange = async (e) => {
    e.preventDefault()
    
    if (!name && !newPassword) {
      return toast.error('Please fill in the new information')
    }

    if (newPassword && !oldPassword) {
      return toast.error('Please fill in the old password')
    }

    if (name) {
      const { data } = await axios.post(backendUrl + '/api/auth/changeName',
        { email, name }
      )

      if (data.success) {
        setOpenChangeName(false)
        setOpenChangeUser(false)
        setName('')
        toast.success(data.message)
      } else {
        toast.error(data.error)
      }
    }

    if (newPassword && oldPassword) {
      const { data } = await axios.post(backendUrl + '/api/auth/changePass',
        { email, oldPassword, newPassword }
      )

      if (data.success) {
        setOpenChangePassword(false)
        setOpenChangeUser(false)
        setOldPassword('')
        setNewPassword('')
        toast.success(data.message)
      } else {
        toast.error(data.error)
      }
    }
  }

  return (
    <div className='relative bg-slate-100 min-h-screen w-full'>
      <Nav />
      <hr className='w-5/6 h-1 mx-auto bg-gray-200 rounded-xl border-0 dark:bg-gray-700' />
      <div className='m-auto h-[85vh] overflow-hidden px-6 lg:px-10 xl:px-14 2xl:px-30'>
        <div className="flex max-sm:flex-col items-center w-full py-4 sm:gap-2 lg:gap-6">
          <div className="sm:min-h-[85vh] w-full sm:w-2/5 2xl:w-1/3 py-2 *:py-2 px-1">
            <div className="*:py-2">
              <div className="flex max-lg:flex-wrap justify-between sm:text-md text-lg">
                <div>Email:</div>
                <div className="font-semibold underline underline-offset-2">
                  {userData.email}
                </div>
              </div>
              <div className="flex max-lg:flex-wrap justify-between sm:text-md text-lg">
                <div>Name:</div>
                <div className="font-semibold underline underline-offset-2">
                {userData.name}
                </div>
              </div>
            </div>
            <div>
              <Button onClick={() => setOpenChangeUser(true)} className={`${openChangeUser ? 'scale-y-0 opacity-0 h-0' : 'scale-y-100'} w-full py-2.5 rounded-lg text-white font-medium transition-all ease-in-out duration-500`}>
                Change details
              </Button>
              <hr className={`${!openChangeUser ? 'scale-y-300 opacity-0' : 'opacity-100'} w-full h-1 -mt-4 mx-auto rounded-xl bg-gray-200 border-0 dark:bg-gray-700 transition-all ease-in-out duration-500`} />
            </div>
            <div>
              <div className={`${openChangeUser ? 'opacity-100' : 'opacity-0'} sm:text-md text-lg transition-all ease-in-out duration-500`}>
                <div className="py-2">What do you want to change?</div>
                <div className={`${openChangeName || openChangePassword ? 'opacity-0 h-0 py-0 m-0 text-[0px] *:hidden' : 'py-2'} flex justify-between items-center transition-all ease-in-out duration-500`}>
                  <Button onClick={() => setOpenChangeName(true)} className='w-24'>Name</Button> OR <Button onClick={() => setOpenChangePassword(true)} className='w-24'>Password</Button>
                </div>
                <div className={`${openChangeName ? 'py-2' : 'scale-x-0 origin-left opacity-0 h-0 py-0'} relative flex items-center transition-all ease-in-out duration-500`}>
                  <div className='flex items-center gap-3 w-full px-5 py-1 rounded-lg bg-white border-2 border-slate-900'>
                    <img src={assets.person_b} alt="Name" />
                    <Input 
                      type="text"
                      placeholder={userData.name} 
                      className='bg-transparent outline-none border-none rounded-lg md:text-md focus-visible:ring-0' 
                      value={name} 
                      onChange={e => setName(e.target.value)} />
                  </div>
                  {/* <img src={assets.check} className="bg-slate-900 hover:bg-slate-800 p-[9px] rounded-lg absolute right-0 border-2 border-slate-900" alt="" /> */}
                </div>
                <div className={`${openChangePassword ? 'py-2' : 'scale-x-0 origin-right opacity-0 h-0 py-0'} relative flex items-center transition-all ease-in-out duration-500`}>
                  <div className='flex items-center gap-3 w-full px-5 py-1 rounded-lg bg-white border-2 border-slate-900'>
                    <img src={assets.personKey_b} alt="Password" />
                    <Input 
                      type="password" 
                      placeholder='Old password'
                      className='bg-transparent outline-none border-none rounded-lg md:text-md focus-visible:ring-0' 
                      value={oldPassword} 
                      onChange={e => setOldPassword(e.target.value)} />
                  </div>
                </div>
                <div className={`${openChangePassword ? 'py-2' : 'scale-x-0 origin-right opacity-0 h-0 py-0'} relative flex items-center transition-all ease-in-out duration-500`}>
                  <div className='flex items-center gap-3 w-full px-5 py-1 rounded-lg bg-white border-2 border-slate-900'>
                    <img src={assets.passKey_b} alt="Password" />
                    <Input 
                      type="password" 
                      placeholder='New password' 
                      className='bg-transparent outline-none border-none rounded-lg md:text-md focus-visible:ring-0' 
                      value={newPassword} 
                      onChange={e => setNewPassword(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="flex justify-between gap-1">
                <Button onClick={(e) => submitChange(e)} onKeyDown={e => e.key === 'Enter' ? (e) => submitChange(e) : ''} className={`${openChangeUser && (openChangeName || openChangePassword) ? '' : 'scale-y-0 hidden'} mt-4 w-[48%] min-w-[130px] py-2.5 rounded-lg text-white font-medium transition-all ease-in-out duration-500`}>
                  Change {openChangeName ? 'Name' : 'Password'}
                </Button>
                <Button onClick={(e) => cancelChange(e)} className={`${openChangeUser && (openChangeName || openChangePassword) ? '' : 'scale-y-0 hidden'} mt-4 w-[48%] py-2.5 rounded-lg text-white font-medium transition-all ease-in-out duration-500`}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
          <div className="max-sm:hidden min-h-[82vh] w-1 flex-shrink-0 mx-[1%] bg-gray-200 rounded-3xl dark:bg-gray-700"></div>
          <hr className='sm:hidden w-full h-1 mx-auto my-4 bg-gray-200 border-0 dark:bg-gray-700' />
          <div className="sm:min-h-[85vh] w-full sm:w-3/5 lg:w-full py-4 px-1 text-center z-10">
            main
          </div>
        </div>
      </div>
    </div>
  )
}