import { LazyLoadImage } from 'react-lazy-load-image-component'

export default function Tab({ responseData }) {

  return (
    <>
      {responseData.map((tab, index) => (
        <div key={index} className='p-3 w-[12.75rem] h-[19rem] bg-white dark:bg-gray-500 dark:text-muted dark:border dark:border-white/30 md:rounded-lg sm:shadow-xl hover:shadow-2xl shadow-slate-900 hover:scale-105 hover:z-10 max-md:border max-md:border-slate-900 max-[408px]:w-[11.25rem]'>
          <a href={tab.link} target="_blank">
            <LazyLoadImage src={tab.img} srcSet={tab.img} width={180} height={120} 
            alt="Item Image" className='w-[11.25rem] h-[7.5rem] object-cover m-auto rounded-lg' />
          </a>
          <div className='pt-1 h-[160px] flex flex-col justify-between'>
            <a href={tab.link} target="_blank" >
              <h2 className='line-clamp-2 font-bold hover:text-slate-500 dark:hover:text-slate-300 max-md:underline underline-offset-2'>{tab.heading || 'Unknown Name'}</h2>
              <h3 className='line-clamp-1 font-medium hover:text-slate-500 dark:hover:text-slate-300'>{tab.address || 'Unknown Address'}</h3>
            </a>
            <div className="priceSection">
              <h3>{tab.price || 'Unknown Price'}</h3>
              <h4>Size: {tab.size || 'N/A'}</h4>
              <a href={tab.sellerLink} target="_blank" className='line-clamp-1 hover:text-slate-500 dark:hover:text-slate-300'>
                {tab.seller || 'Unknown Seller'}
              </a>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}