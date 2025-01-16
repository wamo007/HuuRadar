import { assets } from '../assets/assets'
import { LazyLoadImage } from 'react-lazy-load-image-component'

function Tab({ responseData }) {

  const imageCheck = (image) => {
    if (!image.includes('.jpg')) {
      return assets.placeholder
    } else {
      return image
    }
  }

  return (
    <>
      {responseData.map((tab, index) => (
        <div key={index} className='p-3 w-[12.75rem] h-[19rem] bg-white md:rounded-lg sm:shadow-xl hover:shadow-2xl shadow-slate-900 hover:scale-105 hover:z-10 max-md:border max-md:border-slate-900 max-[25.5rem]:w-[11.25rem]'>
          <a href={tab.link} target="_blank">
            <LazyLoadImage src={imageCheck(tab.img)} srcSet={imageCheck(tab.img)} width={180} height={120} 
            alt="Item Image" className='w-[11.25rem] h-[7.5rem] object-cover m-auto rounded-lg' />
          </a>
          <div className='pt-1 h-[160px] flex flex-col justify-between'>
            <a href={tab.link}>
              <h2 className='line-clamp-2 font-bold'>{tab.heading || 'Unknown Name'}</h2>
              <h3 className='line-clamp-1 font-medium'>{tab.address || 'Unknown Address'}</h3>
            </a>
            <div className="priceSection">
              <h3>{tab.price || 'Unknown Price'}</h3>
              <h4>Size: {tab.size || 'N/A'}</h4>
              <a href={tab.sellerLink} target="_blank" className='line-clamp-1'>
                Seller: {tab.seller || 'Unknown Seller'}
              </a>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default Tab