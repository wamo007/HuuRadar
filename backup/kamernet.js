const puppeteer = require('puppeteer-extra')

const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

const KAMERNET_URL = 'https://kamernet.nl'

puppeteer.use(
  AdblockerPlugin({
    interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY,
    blockTrackers: true
  })
)

let browser
let page

const initialSetup = async () => {
    browser = await puppeteer.launch({ 
        headless: false,
        args: ["--disable-notifications"],
    })

    page = await browser.newPage()

    await page.goto(KAMERNET_URL, { waitUntil: 'networkidle2' })

}

initialSetup()

const kamernetScraper  = async (city, radius, sortGlobal, maxPrice) => {

    let data
    let initialUrl
    let kamernetData = []

    function radiusKamernet(radiusChosen) {
        const options = {
            '0': '1',
            '1': '2',
            '5': '4',
            '10': '5',
        }
        return options[radiusChosen.toLowerCase()] ?? 'Radius type unknown... How???'
    }

    function sortKamernet(sortingChosen) {
        const options = {
            'new': '1',
            'old': '1',
            'cheap': '2',
            'pricy': '4',
        }
        return options[sortingChosen.toLowerCase()] ?? 'Sorting type unknown... How???'
    }

    function maxPriceKamernet(maxPriceChosen) {
        let maxPrice = parseInt(maxPriceChosen)
        if (maxPrice <= 1500) {
            return Math.round(maxPrice/100)
        } else {
            let leftover = Math.round((maxPrice - 1500)/250)
            return 15 + leftover
        }
    }

    initialUrl = `${KAMERNET_URL}/en/for-rent/properties-${city}?searchview=1&maxRent=${maxPriceKamernet(maxPrice)}&radius=${radiusKamernet(radius)}&pageNo=1&sort=${sortKamernet(sortGlobal)}`

    await page.goto(initialUrl, {
        waitUntil: 'domcontentloaded'
    })
    
    while (true) {

        let nextBtn = await page.evaluate(() => {
            return document.querySelector('button[aria-label="Go to next page"]')?.disabled || ''
        })
        let newIcon = await page.evaluate(() => {
            return document.querySelector('div[class^="GridGenerator_root"] a span.MuiChip-label')?.textContent.trim() || ''
        })
        // await autoScroll(page)

        data = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(
              'div[class^="GridGenerator_root"] a'
              )).map((a) => {
                const img = a.querySelector("img")?.getAttribute('src') || ''
                const furnished = a.querySelector('div.MuiCardContent-root>div:nth-child(2)>p:nth-child(2)')?.textContent.trim() || ''
                const propertyType = a.querySelector('div.MuiCardContent-root>div:nth-child(2)>p:nth-child(3)')?.textContent.trim() || ''
                const address = a.querySelector('div.MuiCardContent-root>div>span')?.textContent.trim() || ''
                const cityAddress = a.querySelector('div.MuiCardContent-root>div>span:last-child')?.textContent.trim() || ''
                const dateAvailable = a.querySelector('div.MuiCardContent-root>p')?.textContent.trim() || ''
                const price = a.querySelector('div.MuiCardContent-root>div:last-child>span')?.textContent.trim() || ''
                const bills = a.querySelector('div.MuiCardContent-root>div:last-child>p')?.textContent.trim() || ''
                const size = a.querySelector('div.MuiCardContent-root>div:nth-child(2)>p:nth-child(1)')?.textContent.trim() || ''
                
                let filterPrice = `${price.substring(0, 1)} ${price.substring(1, price.length)}`

                return {
                    link: a.href,
                    img: img.substring(0, img.length - 20),
                    heading: `${propertyType}, ${furnished}`,
                    address: `${address} ${cityAddress}`,
                    price: `${filterPrice} p/mo ${bills.split(' ').slice(1, 3).join(' ')}`,
                    size,
                    seller: dateAvailable,
                    sellerLink: a.href
                }
            })
        })

        kamernetData.push(...data)
        
        if (nextBtn === true) {
            break
        } else {
            await page.waitForSelector('button[aria-label="Go to next page"]')
            await page.click('button[aria-label="Go to next page"]')
        }

        if (newIcon === '') {
            break
        }
    }
    await page.close()
    return kamernetData
}

// async function autoScroll(page) {
//     await page.evaluate(async () => {
//         await new Promise((resolve) => {
//             let totalHeight = 0
//             const distance = 380
//             const timer = setInterval(() => {
//                 const scrollHeight = document.body.scrollHeight
//                 window.scrollBy(0, distance)
//                 totalHeight += distance

//                 if (totalHeight >= scrollHeight - window.innerHeight) {
//                     clearInterval(timer)
//                     resolve()
//                 }
//             }, 130)
//         })
//     })
// }

module.exports = kamernetScraper