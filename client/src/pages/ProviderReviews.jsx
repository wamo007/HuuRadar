
import { FundaFeedback, KamernetFeedback, ParariusFeedback, HuurwoningenFeedback, HousingAnywhereFeedback, RentolaFeedback, TotalFeedback, KamerNLFeedback } from "@/components/Feedbacks"
import Nav from "@/components/Nav"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function ProviderReviews() {
  
  const [open, setOpen] = useState('overall')

  const chosenFeedback = () => {
    switch (open) {
      case 'funda':
        return <FundaFeedback />
      case 'hAnywhere':
        return <HousingAnywhereFeedback />
      case 'kamernet':
        return <KamernetFeedback />
      case 'kamerNL':
        return <KamerNLFeedback />
      case 'pararius':
        return <ParariusFeedback />
      case 'huurwoningen':
        return <HuurwoningenFeedback />
      case 'rentola':
        return <RentolaFeedback />
      case 'overall':
        return <TotalFeedback />
      default:
        return <TotalFeedback />
    }
  }

  return (
    <div className='relative bg-slate-100 dark:bg-gray-700 min-h-screen flex flex-col w-full'>
      <Nav />
      <div className="flex-1 overflow-auto">
        <div className='m-auto px-6 lg:px-10 xl:px-14 2xl:px-30' style={{ height: 'calc(100vh - 6rem)' }}>
          <hr className='w-full h-1 mx-auto bg-gray-200 rounded-3xl border-0' />
          <div className="grid grid-cols-1 min-[858px]:grid-cols-[1fr_auto_2fr] xl:grid-cols-[0.9fr_auto_2.1fr] min-[858px]:gap-6 w-full h-full">
            <div className="relative w-full py-2 *:my-1 px-1">
              <Button onClick={() => setOpen('funda')} variant={ open === 'funda' ? 'outline' : '' } className={`w-full py-2.5 rounded-lg font-medium transition-allease-in-out duration-500 animate-slideIn6`}>
                Funda
              </Button>
              <Button onClick={() => setOpen('hAnywhere')} variant={ open === 'hAnywhere' ? 'outline' : '' } className={` w-full py-2.5 rounded-lg font-medium transition-allease-in-out duration-500 animate-slideIn6`}>
                HousingAnywhere
              </Button>
              <Button onClick={() => setOpen('kamernet')} variant={ open === 'kamernet' ? 'outline' : '' } className={` w-full py-2.5 rounded-lg font-medium transition-allease-in-out duration-500 animate-slideIn6`}>
                Kamernet
              </Button>
              <Button onClick={() => setOpen('kamerNL')} variant={ open === 'kamerNL' ? 'outline' : '' } className={` w-full py-2.5 rounded-lg font-medium transition-allease-in-out duration-500 animate-slideIn6`}>
                KamerNL
              </Button>
              <Button onClick={() => setOpen('pararius')} variant={ open === 'pararius' ? 'outline' : '' } className={` w-full py-2.5 rounded-lg font-medium transition-allease-in-out duration-500 animate-slideIn6`}>
                Pararius
              </Button>
              <Button onClick={() => setOpen('huurwoningen')} variant={ open === 'huurwoningen' ? 'outline' : '' } className={` w-full py-2.5 rounded-lg font-medium transition-allease-in-out duration-500 animate-slideIn6`}>
                Huurwoningen
              </Button>
              <Button onClick={() => setOpen('rentola')} variant={ open === 'rentola' ? 'outline' : '' } className={` w-full py-2.5 rounded-lg font-medium transition-allease-in-out duration-500 animate-slideIn6`}>
                Rentola
              </Button>
              <Button onClick={() => setOpen('overall')} variant={ open === 'overall' ? 'outline' : '' } className={` w-full py-2.5 rounded-lg font-medium transition-allease-in-out duration-500 animate-slideIn6`}>
                Overall
              </Button>
              <div className="min-[858px]:absolute min-[858px]:bottom-2 max-[858px]:hidden w-full text-center">
                <hr className='w-full h-1 mx-auto my-4 rounded-3xl bg-gray-200 border-0' />
                <div className="dark:text-white animate-slideUp6">
                  You can <a href="https://donate.stripe.com/6oE2bs0Fg99sfrqaEE" target="_blank" className="cursor-pointer text-chart-2 hover:text-chart-1 group transition duration-300">
                    <span className="bg-left-bottom bg-gradient-to-r from-chart-1 to-chart-1 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">donate</span>
                  </a> to support the project!
                </div>
              </div>
            </div>
            <div className="max-[858px]:hidden w-1 bg-gray-200 rounded-3xl mt-[1.5vh]"></div>
            <hr className='min-[858px]:hidden rounded-3xl w-full h-1 mx-auto my-4 bg-gray-200 border-0' />
            <div className="relative w-full py-2 pt-2.5 px-1">
              { chosenFeedback() }
              <div className="max-[858px]:mb-20"></div>
              <div className="max-[858px]:absolute max-[858px]:bottom-4 min-[858px]:hidden w-full text-center">
                <hr className='w-full h-1 mx-auto my-4 rounded-3xl bg-gray-200 border-0' />
                <div className="dark:text-white animate-slideUp6">
                  You can <a href="https://donate.stripe.com/6oE2bs0Fg99sfrqaEE" target="_blank" className="cursor-pointer text-chart-2 hover:text-chart-1 group transition duration-300">
                  <span className="bg-left-bottom bg-gradient-to-r from-chart-1 to-chart-1 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">donate</span>
                  </a> to support the project!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}