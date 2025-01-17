const puppeteer = require('puppeteer-extra')

const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

const HUURWONINGEN_URL = 'https://www.huurwoningen.nl'

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

    await page.goto(HUURWONINGEN_URL, { waitUntil: 'networkidle2' })

}

initialSetup()

const huurwoningenScraper  = async (city, sortGlobal, minPrice, maxPrice) => {

    let data
    let initialUrl
    let huurwoningenData = []

    function sortHuurwoningen(sortingChosen) {
        const options = {
            'new': 'published_at&direction=desc',
            'old': 'published_at&direction=desc',
            'cheap': 'price&direction=asc',
            'pricy': 'price&direction=desc',
        }
        return options[sortingChosen.toLowerCase()] ?? 'Sorting type unknown... How???'
    }

    if (!minPrice && !maxPrice) {
        minPrice = '0'
        maxPrice = '60000'
        initialUrl = `${HUURWONINGEN_URL}/in/${city}/?price=${minPrice}-${maxPrice}&since=3&sort=${sortHuurwoningen(sortGlobal)}`
    } else if (!minPrice) {
        minPrice = '0'
        initialUrl = `${HUURWONINGEN_URL}/in/${city}/?price=${minPrice}-${maxPrice}&since=3&sort=${sortHuurwoningen(sortGlobal)}`
    } else if (!maxPrice || maxPrice === 0) {
        maxPrice = '60000'
        initialUrl = `${HUURWONINGEN_URL}/in/${city}/?price=${minPrice}-${maxPrice}&since=3&sort=${sortHuurwoningen(sortGlobal)}`
    } else {
        initialUrl = `${HUURWONINGEN_URL}/in/${city}/?price=${minPrice}-${maxPrice}&since=3&sort=${sortHuurwoningen(sortGlobal)}`
    }
    
    await page.goto(initialUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
        }).catch((err) => {
            console.error(`Navigation to ${initialUrl} failed:`, err.message);
            return []
        })

    let maxPage = await page.evaluate(() => {
        const totalPages = Array.from(document.querySelectorAll('ul.pagination__list li a'))
            .map((a) => {
                return a ? parseInt(a.textContent.trim(), 10) : NaN
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
              'ul.search-list li.search-list__item--listing section'
              )).map((section) => {
                const link = section.querySelector("a.listing-search-item__link").getAttribute('href')
                const img = section.querySelector("picture img")?.getAttribute('src') || ''
                const heading = section.querySelector("h2.listing-search-item__title a").textContent.trim()
                const address = section.querySelector('div[class^="listing-search-item__sub-title"]').textContent.trim()
                const price = section.querySelector('div.listing-search-item__price').textContent.trim()
                const size = section.querySelector('li.illustrated-features__item.illustrated-features__item--surface-area')?.textContent.trim() || ''

                let filterPrice = ''

                if (isNaN(parseFloat(price.substring(1, price.length - 10)))) {
                    filterPrice = 'Price On Request'
                } else {
                    filterPrice = `${price.substring(0, 1)} ${price.substring(1, price.length - 10)} p/mo.`
                }

                return {
                    provider: 'huurwoningen',
                    link: `${HUURWONINGEN_URL}${link}`,
                    img: img.substring(0, img.length - 20),
                    heading,
                    address,
                    price: filterPrice,
                    size,
                    seller: 'No info',
                    sellerLink: `${HUURWONINGEN_URL}${link}`
                }
            })
        })

        huurwoningenData.push(...data)
        currentPage++
    }
    await page.close()
    return huurwoningenData
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
            }, 120)
        })
    })
}

module.exports = huurwoningenScraper