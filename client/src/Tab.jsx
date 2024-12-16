import './Tab.css'

function Tab({ responseData }) {
  return (
    <>
      {responseData.map((tab, index) => (
        <div key={index}>
          <a href={tab.link}>
            <img src={tab.img} srcSet={tab.img} alt="Item Image" />
          </a>
          <div>
            <a href={tab.link}>
              <h2>{tab.heading || 'Unknown Name'}</h2>
              <h3>{tab.address || 'Unknown Address'}</h3>
            </a>  
            <h3>{tab.price || 'Unknown Price'}</h3>
            <h4>Size: {tab.size || 'N/A'}</h4>
            <a href={tab.sellerLink}>Seller: {tab.seller || 'Unknown Seller'}</a>
          </div>
        </div>
      ))}
    </>
  )
}

export default Tab