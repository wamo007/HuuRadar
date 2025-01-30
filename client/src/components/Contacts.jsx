import { useContext, useRef, useState } from "react"
import { useIsVisible } from "./ui/scrollingAnim"
import { assets } from "@/assets/assets"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import axios from "axios"
import { userContent } from "@/context/UserContext"
import { toast } from "react-toastify"

export default function Contacts() {
  
  const { backendUrl } = useContext(userContent)

  const contact1 = useRef()
  const isVisibleContact1 = useIsVisible(contact1)

  const contact2 = useRef()
  const isVisibleContact2 = useIsVisible(contact2)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [text, setText] = useState('')

  const submitHandler = async (e) => {
    try {
      e.preventDefault()
      
      const { data } = await axios.post(backendUrl + '/api/feedback',
        { name, email, text }
      )
      
      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  
  return (
    <div className='relative min-h-screen w-full place-items-center overflow-hidden bg-[url("/second_bg.png")] dark:bg-gray-800 dark:bg-[url("/second_bg_dark.png")] bg-cover' id='Contacts'>
      <div className='py-4 w-11/12 max-w-7xl flex flex-col items-center justify-center gap-3'>
        <div ref={contact1} className={`px-7 py-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/30 dark:bg-black/10 dark:border-black/5 md:shadow-lg transition-all ease-in duration-700 ${isVisibleContact1 ? 'opacity-100' : 'opacity-0 -translate-x-20'}`}>
            <h1 className='text-slate-900 dark:text-white text-4xl max-sm:text-3xl font-bold text-center'>Contact Me!</h1>
        </div>
        <div className='py-0.5 w-full flex justify-center items-center gap-3'>
          <div ref={contact2} className={`container bg-slate-900 border border-white/30 p-10 rounded-lg shadow-2xl w-full text-indigo-300 text-md transition-all ease-in duration-700 ${isVisibleContact2 ? 'opacity-100' : 'opacity-0 translate-x-20'}`}>
            <form onSubmit={submitHandler} className="w-full">
              <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                <img src={assets.person} alt="" />
                <Input 
                  type="text" 
                  placeholder='Full Name' 
                  className='bg-transparent outline-none border-none rounded-lg text-sm md:text-lg focus-visible:ring-0' 
                  value={name} 
                  onChange={e => setName(e.target.value)} />
              </div>
              <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                <img src={assets.mail} alt="" />
                <Input 
                  type="email" 
                  placeholder='Valid E-Mail' 
                  className='bg-transparent outline-none border-none rounded-lg text-sm md:text-lg focus-visible:ring-0' 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} />
              </div>
              <div className='mb-4 flex items-start gap-3 w-full min-h-40 max-h-64 px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                <img src={assets.notes} className="mt-2.5" alt="" />
                <Textarea 
                  type="text" 
                  placeholder='Your request/question/feedback...' 
                  className='bg-transparent outline-none border-none rounded-lg resize-none max-h-64 min-h-36 text-sm md:text-lg focus-visible:ring-0' 
                  value={text} 
                  onChange={e => setText(e.target.value)} />
              </div>
              <Button className='hover:animate-pulse mt-4 w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-800 text-white lg:text-base font-medium' type='submit'>
                Submit
              </Button>
            </form>
            <hr className='w-3/4 h-1 mx-auto my-8 bg-[#333A5C] rounded-xl border-0 dark:bg-gray-700 mt-8' />
            <div className="w-full flex max-md:flex-wrap justify-between max-md:gap-4">
              <h3 className='flex items-center justify-center gap-3 md:w-[49%] w-full px-2 rounded-lg text-white font-medium text-base lg:text-sm xl:text-base bg-[#333A5C] h-10'>
                Thanks for the feedback!<img src={assets.smile} width={24} alt="" />
              </h3>
              <div className='md:w-[49%] w-full flex flex-nowrap gap-2 items-center justify-between'>
                <Button className='w-9/12 sm:w-10/12 text-center rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-medium text-base [@media_(max-width:440px)]:text-[13px] lg:text-sm xl:text-base pointer-events-none'>
                  support@huuradar.org
                </Button>
                <div className="w-3/12 sm:w-2/12 flex gap-2 items-center justify-center sm:justify-evenly [&_*]:w-7">
                  <a href="https://github.com/wamo007" target="_blank">
                    <img src={assets.github} width={30} alt="My Github Page" />
                  </a>
                  <a href="https://www.linkedin.com/in/shamil-iskandarov-326225293" target="_blank">
                    <img src={assets.linkedin} width={30} alt="My LinkedIn Page. LinkedIn icon by Icons8.com" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
