import Nav from "./Nav";

export default function Header() {
  return (
    <div className="min-h-screen mb-4 bg-cover bg-center flex items-center w-full overflow-hidden" style={{backgroundImage: "url('/header_img.png')"}} id='Header'>
        <Nav />
        <div className="container text-left mx-auto py-4 px-6 md:px-20 lg:px-31 text-gray-800">
            <h2 className="text-left text-4xl sm:text-5xl md:text-[70px] inline-block max-w-2xl font-medium pt-20">Find your rentable apartment <span className="font-semibold">faster</span></h2>
            <p className="text-4xl max-w-lg pt-3">Get notified about new rentable apartments faster than others!</p>
            <div className="space-x-6 mt-14">
                <a href="#About" className="border-2 border-gray-800 text-3xl px-8 py-3 rounded text-gray-800 hover:text-gray-700">Learn More</a>
                <a href="#Search" className="bg-gray-800 border-2 border-gray-800 px-8 py-3 rounded text-white text-3xl hover:text-slate-200">Search now</a>
            </div>
        </div>
    </div>
  )
}