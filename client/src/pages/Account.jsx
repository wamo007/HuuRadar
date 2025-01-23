import Nav from "@/components/Nav";
import { Button } from "@/components/ui/button";

export default function Account() {
  return (
    <div className='relative bg-slate-100 min-h-screen w-full'>
      <Nav />
      <div className='m-auto w-11/12 max-w-7xl h-[91vh]'>
        <div className="flex max-sm:flex-col items-center justify-stretch w-full py-4 px-6 md:px-2 lg:px-10">
        <div className="sm:min-h-[90vh] w-full sm:w-2/5 md:w-[29%] sm:max-w-80 py-2 *:py-2 px-1">
          <div className="flex max-lg:flex-wrap justify-between sm:text-md text-lg">
            <div>Email:</div>
            <div className="font-semibold underline underline-offset-2">
              youremail@gmail.com
            </div>
          </div>
          <div className="flex max-lg:flex-wrap justify-between sm:text-md text-lg">
            <div>Name:</div>
            <div className="font-semibold underline underline-offset-2">
              Your Name
            </div>
          </div>
          <Button className=''>Change details</Button>
        </div>
        <div className="max-sm:hidden min-h-[88vh] w-1 flex-shrink-0 mx-[1%] bg-gray-200 rounded-3xl dark:bg-gray-700"></div>
        <hr className='sm:hidden w-5/6 h-1 mx-auto my-4 bg-gray-200 border-0 dark:bg-gray-700' />
        <div className="sm:min-h-[90vh] w-full sm:w-3/5 md:w-[70%] py-4 px-1 text-center">
          main
        </div>
        </div>
      </div>
    </div>
  )
}