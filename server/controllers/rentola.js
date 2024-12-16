const puppeteer = require('puppeteer-extra')

const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

const RENTOLA_URL = `https://www.rentola.nl/en/`

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

    await page.goto(RENTOLA_URL, { waitUntil: 'networkidle2' })

    await page.waitForSelector('button[id="didomi-notice-disagree-button"]')
    await page.click('button[id="didomi-notice-disagree-button"]')
}

initialSetup()

const rentolaScraper = async (city, radius, sortGlobal, minPrice, maxPrice) => {

    let data
    let initialUrl
    let rentolaData = []

    function sortRentola(sortingChosen) {
        const options = {
            'new': 'desc',
            'old': 'asc',
            'cheap': 'rent_asc',
            'pricy': 'rent_desc',
        }
        return options[sortingChosen.toLowerCase()] ?? 'Sorting type unknown... How???'
    }

    if (!minPrice && !maxPrice) {
        initialUrl = `${RENTOLA_URL}for-rent?location=${city}&order=${sortRentola}`
    } else if (!minPrice) {
        minPrice = '0'
        initialUrl = `${RENTOLA_URL}for-rent?location=${city}&order=${sortRentola}&rent=${minPrice}-${maxPrice}`
    } else if (!maxPrice || maxPrice === 0) {
        maxPrice = '60000'
        initialUrl = `${RENTOLA_URL}for-rent?location=${city}&order=${sortRentola}&rent=${minPrice}-${maxPrice}`
    } else {
        initialUrl = `${RENTOLA_URL}for-rent?location=${city}&order=${sortRentola}&rent=${minPrice}-${maxPrice}`
    }

    // await page.setViewport({ width: 600, height: 1000})

    await page.goto(initialUrl, {
        waitUntil: 'domcontentloaded'
    })

    // autoscroll and select operation

    data = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(
          'div.search-results div[data-controller="thumbnail--main"]'
          )).map((div) => {
            const link = div.querySelector("a").getAttribute('href')
            const img = div.querySelector("img")?.getAttribute('src') || ''
            const heading = div.querySelector("div.location-label").textContent.trim()
            // const address = div.querySelector('div[data-test-id="postal-code-city"]')?.textContent.trim()
            const price = div.querySelector('div.fake-btn b').textContent.trim()
            const size = div.querySelector('div.row div.prop-value')?.textContent.trim() || ''
            const seller = div.querySelector('div.mt-4 a')?.textContent.trim() || ''
            const sellerLink = div.querySelector('div.mt-4 a')?.getAttribute('href') || ''
    
            return {
                link,
                img,
                heading,
                address: `${city}`,
                price: `${price} p/mo.`,
                size: `${size}²`,
                seller,
                sellerLink
            }
        })
    })
    rentolaData.push(...data)
    
    return rentolaData
}



module.exports = rentolaScraper