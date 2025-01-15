import { useRef, useState } from "react"
import { useIsVisible } from "./ui/scrollingAnim"
import { assets } from "@/assets/assets"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"

export default function Contacts() {
  
  const contact1 = useRef()
  const isVisibleContact1 = useIsVisible(contact1)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [text, setText] = useState('')
  
  return (
    <div className='relative min-h-screen flex flex-col items-center justify-center w-full overflow-hidden bg-[url("/second_bg1.png")] bg-cover' id='Contacts'>
      <div ref={contact1} className={`absolute top-3 px-7 py-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/30 md:shadow-lg transition-all ease-in duration-700 ${isVisibleContact1 ? 'opacity-100' : 'opacity-0 translate-y-20'}`}>
          <h1 className='text-slate-900 text-4xl font-bold mb-2 text-center'>Contact Me!</h1>
      </div>
      <div className='py-4 px-6 md:px-2 lg:px-10 xl:px-14 2xl:px-30 w-full flex justify-center items-center gap-3'>
        <div className='container bg-slate-900 p-10 rounded-lg shadow-2xl w-full max-lg:flex-wrap flex max-lg:mt-32 lg:gap-20 gap-10 justify-evenly items-end text-indigo-300 text-md'>
          <form className="w-full lg:w-2/3">
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
              <img src={assets.person} alt="" />
              <Input 
                type="text" 
                placeholder='Full Name' 
                className='bg-transparent outline-none border-none rounded-lg md:text-lg focus-visible:ring-0' 
                value={name} 
                onChange={e => setName(e.target.value)} />
            </div>
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
              <img src={assets.mail} alt="" />
              <Input 
                type="email" 
                placeholder='E-Mail' 
                className='bg-transparent outline-none border-none rounded-lg md:text-lg focus-visible:ring-0' 
                value={email} 
                onChange={e => setEmail(e.target.value)} />
            </div>
            <div className='mb-4 flex items-start gap-3 w-full h-80 px-5 py-2.5 rounded-lg bg-[#333A5C]'>
              <img src={assets.notes} className="mt-2.5" alt="" />
              <Textarea 
                type="text" 
                placeholder='Your request/question/feedback...' 
                className='bg-transparent outline-none border-none rounded-lg resize-none h-full md:text-lg focus-visible:ring-0' 
                value={text} 
                onChange={e => setText(e.target.value)} />
            </div>
            <Button className='mt-4 w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-800 text-white md:text-lg font-medium' type='submit'>Submit</Button>
          </form>
          <div className="w-full lg:w-1/3 h-auto">
            <div className="relative text-2xl w-full">
              <img src={assets.myPhoto} width={496.3} height={500} alt="" className="relative rounded-lg w-full" />
              <h3 className="absolute -bottom-1 flex flex-col items-center w-full bg-[#333A5C] md:text-lg rounded-lg">
                Shamil
              </h3>
            </div>
            <div className='mt-9 w-full flex gap-2 items-center justify-between'>
              <Button className='w-10/12 text-center rounded-lg bg-gradient-to-r from-indigo-800 to-indigo-700 text-white font-medium md:text-lg pointer-events-none'>
                shamo.iskandarov@gmail.com
              </Button>
              <a href="https://github.com/wamo007" target="_blank" className='w-1/12 place-items-center'>
                <img src={assets.github} width={30} alt="My Github Page" />
              </a>
              <a href="https://az.linkedin.com/in/shamil-iskandarov-326225293" target="_blank" className='w-1/12 place-items-center'>
                <img src={assets.linkedin} width={30} alt="My LinkedIn Page. LinkedIn icon by Icons8.com" />
              </a>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
