import { assets } from "@/assets/assets";
import Nav from "@/components/Nav";
import { Button } from "@/components/ui/button";
import { userContent } from "@/context/UserContext";
import { Input } from "@/components/ui/input";
import { useContext, useState } from "react";

export default function Account() {

  const { backendUrl, userData } = useContext(userContent)
  
  const [name, setName] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className='relative bg-slate-100 min-h-screen w-full'>
      <Nav />
      <hr className='w-2/3 h-1 mx-auto bg-gray-200 border-0 dark:bg-gray-700' />
      <div className='m-auto h-[85vh] overflow-hidden px-6 lg:px-10 xl:px-14 2xl:px-30'>
        <div className="flex max-sm:flex-col items-center w-full py-4 sm:gap-2 lg:gap-6">
          <div className="sm:min-h-[85vh] w-full sm:w-2/5 2xl:w-1/3 py-2 *:py-2 px-1">
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
            <Button className='mt-4 w-full py-2.5 rounded-lg text-white font-medium'>
              Change details
            </Button>
            <div className="*:py-2 sm:text-md text-lg">
              <div>What do you want to change?</div>
              <div className="flex justify-between items-center">
                <Button className='w-24'>Name</Button> OR <Button className='w-24'>Password</Button>
              </div>
              <div className='relative flex items-center'>
                <div className='flex items-center gap-3 w-full px-5 py-1 pr-16 rounded-lg bg-white border-2 border-slate-900'>
                  <img src={assets.person_b} alt="Name" />
                  <Input 
                    type="name" 
                    placeholder={userData.name} 
                    className='bg-transparent outline-none border-none rounded-lg md:text-md focus-visible:ring-0' 
                    value={name} 
                    onChange={e => setName(e.target.value)} />
                </div>
                <img src={assets.check} className="bg-slate-900 hover:bg-slate-800 p-[9px] rounded-lg absolute right-0 border-2 border-slate-900" alt="" />
              </div>
              <div className='relative flex items-center'>
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
              <div className='relative flex items-center'>
                <div className='flex items-center gap-3 w-full px-5 py-1 pr-16 rounded-lg bg-white border-2 border-slate-900'>
                  <img src={assets.passKey_b} alt="Password" />
                  <Input 
                    type="password" 
                    placeholder='New password' 
                    className='bg-transparent outline-none border-none rounded-lg md:text-md focus-visible:ring-0' 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} />
                </div>
                <img src={assets.check} className="bg-slate-900 hover:bg-slate-800 p-[9px] rounded-lg absolute right-0 border-2 border-slate-900" alt="" />
              </div>
            </div>
          </div>
          <div className="max-sm:hidden min-h-[82vh] w-1 flex-shrink-0 mx-[1%] bg-gray-200 rounded-3xl dark:bg-gray-700"></div>
          <hr className='sm:hidden w-5/6 h-1 mx-auto my-4 bg-gray-200 border-0 dark:bg-gray-700' />
          <div className="sm:min-h-[85vh] w-full sm:w-3/5 lg:w-full py-4 px-1 text-center">
            main
          </div>
        </div>
      </div>
    </div>
  )
}