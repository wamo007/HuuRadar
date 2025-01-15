import { Link } from "react-router-dom";
import Nav from "./Nav";
import { useRef } from "react";
import { useIsVisible } from "./ui/scrollingAnim";

export default function Header() {

  const header = useRef()
  const isVisibleHeader = useIsVisible(header)

  return (
    <div className="min-h-screen bg-cover bg-center md:items-center flex w-full overflow-hidden bg-[url('/hero_mobile.jpg')] md:bg-[url('/header_img.png')]" id='Header'>
        <Nav />
        <div ref={header} className={`container text-left mx-auto py-4 px-6 md:px-2 lg:px-10 xl:px-14 2xl:px-30 text-gray-800 animate-slideIn6 transition-all ease-in duration-700 ${isVisibleHeader ? 'opacity-100' : 'opacity-0 -translate-x-20'}`}>
            <h2 className="text-left text-5xl max-[340px]:text-3xl max-[440px]:text-4xl md:text-[66px] inline-block max-w-md sm:max-w-2xl font-medium pt-20">Find your rentable apartment <span className="font-semibold">faster</span></h2>
            <p className="text-2xl max-[340px]:text-lg max-[440px]:text-xl md:text-[35px] max-w-md max-[440px]:max-w-sm md:max-w-lg pt-3 leading-tight">Get notified about new rentable apartments faster than others!</p>
            <div className="md:space-x-6 mt-11 max-[340px]:mt-8 max-[440px]:mt-9 md:mt-13 lg:mt-14">
                <a href="#About" className="hidden md:inline-block border-2 border-slate-900 text-3xl px-8 py-3 rounded text-slate-900 hover:text-slate-800 hover:animate-pulse">Learn More</a>
                <Link to="demo" className="bg-slate-900 border-2 border-slate-900 px-8 py-3 rounded text-white text-3xl max-[340px]:text-2xl hover:text-slate-200 hover:animate-pulse7">Search now</Link>
            </div>
        </div>
    </div>
  )
}