const puppeteer = require('puppeteer-extra')

const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

const FUNDA_URL = `https://www.funda.nl/en/`

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

    await page.goto(FUNDA_URL, { waitUntil: 'networkidle2' })

    await page.waitForSelector('button[id="didomi-notice-disagree-button"]')
    await page.click('button[id="didomi-notice-disagree-button"]')
}

initialSetup()

const fundaScraper = async (city, radius, sortGlobal, minPrice, maxPrice) => {

    let data
    let initialUrl
    let fundaData = []
    let currentPage = 1

    function sortFunda(sortingChosen) {
        const options = {
            'new': 'date_down',
            'old': 'date_up',
            'cheap': 'price_up',
            'pricy': 'price_down',
        }
        return options[sortingChosen.toLowerCase()] ?? 'Sorting type unknown... How???'
    }

    if (!minPrice && !maxPrice) {
        initialUrl = `${FUNDA_URL}zoeken/huur?selected_area=%5B"${city.toLowerCase()},${radius}km"%5D&sort="${sortFunda(sortGlobal)}`
    } else {
        initialUrl = `${FUNDA_URL}zoeken/huur?selected_area=%5B"${city.toLowerCase()},${radius}km"%5D&sort="${sortFunda(sortGlobal)}"&price="${minPrice}-${maxPrice}"`
    } 

    // await page.setViewport({ width: 600, height: 1000})

    await page.goto(initialUrl, {
        waitUntil: 'domcontentloaded'
    })

    let maxPage = await page.evaluate(() => {
        const totalPages = Array.from(document.querySelectorAll('ul.pagination li'))
            .map((li) => {
                const count = li.querySelector('a')
                return count ? parseInt(count.textContent.trim(), 10) : NaN
            })
            .filter((num) => !isNaN(num))
        return (totalPages.length > 0) ? Math.max(...totalPages) : 1
    })
    
    while (currentPage <= maxPage) {
        const changingUrl = `${initialUrl}&search_result=${currentPage}`
        await page.goto(changingUrl, {
            waitUntil: 'domcontentloaded'
        })

        data = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(
              'div.pt-4 div[data-test-id="search-result-item"]'
              )).map((div) => {
                const link = div.querySelector("a").getAttribute('href')
                const img = div.querySelector("img")?.getAttribute('srcset') || ''
                const heading = div.querySelector("h2").textContent.trim()
                const address = div.querySelector('div[data-test-id="postal-code-city"]').textContent.trim()
                const price = div.querySelector('p[data-test-id="price-rent"]').textContent.trim()
                const size = div.querySelector('li.flex')?.textContent.trim() || ''
                const seller = div.querySelector('div.mt-4 a')?.textContent.trim() || ''
                const sellerLink = div.querySelector('div.mt-4 a')?.getAttribute('href') || ''
      
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

        fundaData.push(...data)

        currentPage++
    }
    
    return fundaData
}



module.exports = fundaScraper