import { assets } from "@/assets/assets"

export default function PlaceholderTab() {
  return (
    <>
      <a>
        <img src={assets.moreplace} width={180} height={120} 
        alt="Item Image" className='w-[180px] h-[120px] object-cover m-auto rounded-lg' />
      </a>
      <div className='pt-1 h-[160px] flex flex-col justify-between'>
        <a>
          <h2 className='line-clamp-2 font-bold'>Moulin Rouge</h2>
          <h3 className='line-clamp-1 font-medium'>Red-light district</h3>
        </a>
        <div className="priceSection">
          <h3>€ 3.100 p/mo.</h3>
          <h4>Size: 69m²</h4>
          <a>
            Seller: Idk LOL
          </a>
        </div>
      </div>
    </>
  )
}
