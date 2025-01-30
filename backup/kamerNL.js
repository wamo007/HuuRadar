const puppeteer = require('puppeteer-extra')

const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

const KAMERNL_URL = 'https://www.kamer.nl'

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

    await page.goto(KAMERNL_URL, { waitUntil: 'networkidle2' })

}

initialSetup()

const kamerNLScraper  = async (city, radius, sortGlobal, minPrice, maxPrice) => {

    let data
    let queries
    let initialUrl
    let kamerNLData = []
    let currentPage = 1

    function radiusKamerNL(radiusChosen) {
        const options = {
            '0': '1',
            '1': '1',
            '5': '5',
            '10': '10',
        }
        return options[radiusChosen.toLowerCase()] ?? 'Radius type unknown... How???'
    }

    function sortKamerNL(sortingChosen) {
        const options = {
            'new': '-created',
            'old': 'created',
            'cheap': 'rental_price',
            'pricy': '-rental_price',
        }
        return options[sortingChosen.toLowerCase()] ?? 'Sorting type unknown... How???'
    }

    function minPriceKamerNL(minPriceChosen) {
        let minPrice = parseInt(minPriceChosen)
        if (minPrice <= 1500) {
            return Math.round(minPrice/100)
        } else {
            let leftover = Math.round((minPrice - 1500)/250)
            return 15 + leftover
        }
    }

    function maxPriceKamerNL(maxPriceChosen) {
        let maxPrice = parseInt(maxPriceChosen)
        if (maxPrice <= 1500) {
            return Math.round(maxPrice/100)
        } else {
            let leftover = Math.round((maxPrice - 1500)/250)
            return 15 + leftover
        }
    }

    if (!minPrice && !maxPrice) {
        queries = `/en/rent/?q=${city}&type=&created=3&distance=${radiusKamerNL(radius)}&sort=${sortKamerNL(sortGlobal)}&min_price=${minPriceKamerNL(minPrice)}&max_price=${maxPriceKamerNL(maxPrice)}`
    } else if (!minPrice && maxPrice) {
        queries = `/en/rent/?q=${city}&type=&created=3&distance=${radiusKamerNL(radius)}&sort=${sortKamerNL(sortGlobal)}&max_price=${maxPriceKamerNL(maxPrice)}`
    } else if (minPrice && !maxPrice) {
        queries = `/en/rent/?q=${city}&type=&created=3&distance=${radiusKamerNL(radius)}&sort=${sortKamerNL(sortGlobal)}&min_price=${minPriceKamerNL(minPrice)}`
    } else if (minPrice > maxPrice) {
        queries = `/en/rent/?q=${city}&type=&created=3&distance=${radiusKamerNL(radius)}&sort=${sortKamerNL(sortGlobal)}&max_price=${maxPriceKamerNL(maxPrice)}`
    }

    initialUrl = `${KAMERNL_URL}${queries}`

    try {
        await page.goto(initialUrl, {
            waitUntil: 'domcontentloaded',
            timeout: 30000,
        })
    } catch (error) {
        try {
            await page.goto(initialUrl, {
                waitUntil: 'domcontentloaded',
                timeout: 30000,
            })
        } catch (error) {
            console.error(`Navigation to ${initialUrl} failed:`, err.message);
            await page.close()
            return hAnywhereData
        }
    }

    let maxPage = await page.evaluate(() => {
        const totalPages = Array.from(document.querySelectorAll('div.justify-end.space-x-2>div>*'))
            .map((page) => {
                return (page && (page.textContent !== '')) ? parseInt(page.textContent, 10) : NaN
            })
            .filter((num) => !isNaN(num))
        console.log(totalPages)
        return (totalPages.length > 0) ? Math.max(...totalPages) : 1
    })
    
    while (currentPage <= maxPage) {

        data = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(
              'div.search-results-list div.relative.group'
              )).map((div) => {
                const link = div.querySelector("a").getAttribute('href')
                const img = div.querySelector("img")?.getAttribute('src') || ''
                const heading = div.querySelector("div.flex>div>div>p.overflow-hidden").textContent.trim()
                const address = div.querySelector("div.flex>div>p.text-blue-800")?.textContent.trim() || ''
                const price = div.querySelector('div.flex>div>div>p.flex-none').textContent.trim()
                const size = div.querySelector('div.flex>div:nth-child(2)>div>p')?.textContent.trim() || ''
                const seller = div.querySelector('div.flex-col>p')?.textContent.trim() || ''
                const sellerLink = div.querySelector('a')?.getAttribute('href') || ''

                return {
                    link,
                    img,
                    heading,
                    address,
                    price,
                    size,
                    seller,
                    sellerLink
                }
            })
        })
        kamerNLData.push(...data)
        currentPage++
    }
    // await page.close()
    return kamerNLData
}

module.exports = kamerNLScraper