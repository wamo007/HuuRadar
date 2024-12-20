import { LazyLoadImage } from 'react-lazy-load-image-component'

function Tab({ responseData }) {
  return (
    <>
      {responseData.map((tab, index) => (
        <div key={index} className='p-3 w-[204px] h-[304px] rounded-lg shadow-2xl'>
          <a href={tab.link} target="_blank">
            <LazyLoadImage src={tab.img} srcSet={tab.img} width={180} height={120} 
            alt="Item Image" className='w-[180px] h-[120px] object-cover m-auto rounded-lg' />
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