const puppeteer = require('puppeteer-extra')

const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

const HOUSING_ANYWHERE_URL = `https://housinganywhere.com`

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

    await page.goto(HOUSING_ANYWHERE_URL, { waitUntil: 'networkidle2' })

    try {
        await page.waitForSelector('button[id="onetrust-pc-btn-handler"]', {timeout: 400})
        await page.click('button[id="onetrust-pc-btn-handler"]')
        await page.waitForSelector('button.save-preference-btn-handler', {timeout: 400})
        await page.click('button.save-preference-btn-handler')
    } catch (error) {
        console.log('Privacy popup did not appear, skipping this step...')
    }

}

initialSetup()

const hAnywhereScraper = async (city, sortGlobal, minPrice, maxPrice) => {

    let data
    let initialUrl
    let hAnywhereData = []
    let currentPage = 1

    function sortHA(sortingChosen) {
        const options = {
            'new': 'mostRecent',
            'old': 'mostRecent',
            'cheap': 'lowToHigh',
            'pricy': 'highToLow',
        }
        return options[sortingChosen.toLowerCase()] ?? 'Sorting type unknown... How???'
    }

    if (!minPrice && !maxPrice) {
        initialUrl = `${HOUSING_ANYWHERE_URL}/s/${city}--Netherlands?sorting=${sortHA(sortGlobal)}&categories=shared-rooms%2Cprivate-rooms%2Cstudent-housing`
    } else {
        initialUrl = `${HOUSING_ANYWHERE_URL}/s/${city}--Netherlands?sorting=${sortHA(sortGlobal)}&categories=shared-rooms%2Cprivate-rooms%2Cstudent-housing&priceMin=${minPrice}00&priceMax=${maxPrice}00`
    }
    // await page.setViewport({ width: 600, height: 1000})

    console.log(initialUrl)
    await page.goto(initialUrl, {
        waitUntil: 'domcontentloaded'
    })

    let maxPage = await page.evaluate(() => {
        const totalPages = Array.from(document.querySelectorAll('ul.MuiPagination-ul li button'))
            .map((btn) => {
                // const otherPages = a.querySelector('a')
                return btn ? parseInt(btn.textContent.trim(), 10) : NaN
            })
            .filter((num) => !isNaN(num))
        return (totalPages.length > 0) ? Math.max(...totalPages) : 1
    })
    
    while (currentPage <= maxPage) {
        const changingUrl = `${initialUrl}&page=${currentPage}`
        await page.goto(changingUrl, {
            waitUntil: 'domcontentloaded'
        })

        await autoScroll(page)

        data = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(
              'div.css-wp5dsn-container div.css-jdbo8x-HousingAnywhereColorProvider-root a'
              )).map((a) => {
                // const link = section.querySelector("a").getAttribute('href')
                const img = a.querySelector("img")?.getAttribute('src') || ''
                const heading = a.querySelector('div[data-test-locator="ListingCardPropertyInfo"] span').textContent.trim()
                const housemates = a.querySelector('span[data-test-locator="ListingCardInfo/RoomLabel"]')?.textContent.trim() || ''
                const dateAvailable = a.querySelector('div[data-test-locator="ListingCardPropertyInfo"]>span:last-child')?.textContent.trim() || ''
                const address = document.querySelector('div.css-de8hus-infoSection h1')?.textContent.trim().split(' ').slice(-2, -1).join(' ') || ''
                const price = a.querySelector('span[data-test-locator="ListingCard.PriceLabel"]').textContent.trim()
                const bills = a.querySelector('div[data-test-locator="ListingCardInfoPrice"] span:nth-child(5)')?.textContent.trim() || ''
                const size = a.querySelector('div[data-test-locator="ListingCardPropertyInfo"] span:nth-child(2)')?.textContent.trim() || ''
                const seller = a.querySelector('span.css-1b1583x-advertiserTypeTitle')?.textContent.trim() || ''
                
                return {
                    link: `https://housinganywhere.com${a.href}`,
                    img: img.substring(0, img.length - 20),
                    heading: `${heading.substring(0, heading.length - 1)} with ${housemates.substring(0, housemates.length - 1)} ${dateAvailable.toLowerCase()}`,
                    address: address.substring(0, address.length - 1),
                    price: `${price} p/mo ${bills}`,
                    size: size.substring(0, size.length - 1),
                    seller,
                    sellerLink: `https://housinganywhere.com${a.href}`
                }
            })
        })

        hAnywhereData.push(...data)

        currentPage++
    }

    return hAnywhereData
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0
            const distance = 380
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight
                window.scrollBy(0, distance)
                totalHeight += distance

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer)
                    resolve()
                }
            }, 130)
        })
    })
}

module.exports = hAnywhereScraper