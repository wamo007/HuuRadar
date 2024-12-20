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
        headless: true,
        args: ["--disable-notifications"],
    })

    page = await browser.newPage()

    await page.goto(RENTOLA_URL, { waitUntil: 'networkidle2' })
}

initialSetup()

const rentolaScraper = async (city, sortGlobal, minPrice, maxPrice) => {

    let data
    let initialUrl
    let clicked = 0
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
        initialUrl = `${RENTOLA_URL}for-rent?location=${city}&order=${sortRentola(sortGlobal)}`
    } else if (!minPrice) {
        minPrice = '0'
        initialUrl = `${RENTOLA_URL}for-rent?location=${city}&order=${sortRentola(sortGlobal)}&rent=${minPrice}-${maxPrice}`
    } else if (!maxPrice || maxPrice === 0) {
        maxPrice = '60000'
        initialUrl = `${RENTOLA_URL}for-rent?location=${city}&order=${sortRentola(sortGlobal)}&rent=${minPrice}-${maxPrice}`
    } else {
        initialUrl = `${RENTOLA_URL}for-rent?location=${city}&order=${sortRentola(sortGlobal)}&rent=${minPrice}-${maxPrice}`
    }

    // await page.setViewport({ width: 600, height: 1000})

    await page.goto(initialUrl, {
        waitUntil: 'domcontentloaded'
    })

    while (clicked < 5) {
        const loadMoreHidden = await page.evaluate(() => {
            return document.querySelector('div#pagination-load-more')
                .getAttribute('style') === 'display: none;'
        })

        if (loadMoreHidden) {
            break
        }

        await page.evaluate(() => {
            const loadMoreButton = document.querySelector('button[id="load-more"]')
            if (loadMoreButton) loadMoreButton.click()
        })

        clicked++
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)))
    }

    await autoScroll(page)
    
    data = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(
          'div.search-results div[data-controller="thumbnail--main"]'
          )).map((div) => {
            const link = div.querySelector("a").getAttribute('href')
            const img = div.querySelector("img")?.getAttribute('src') || ''
            const heading = div.querySelector("div.location-label").textContent.trim()
            const price = div.querySelector('div.fake-btn b').textContent.trim()
            const size = div.querySelector('div.row div.prop-value')?.textContent.trim() || ''
    
            return {
                link: `https://www.rentola.nl${link}`,
                img,
                heading: heading.split(' ').slice(0, -2).join(' '),
                address: heading.split(' ').slice(-1).join(' '),
                price: `${price} p/mo.`,
                size: `${size.replace('\nm2','m')}²`,
                seller: 'Rentola',
                sellerLink: `https://www.rentola.nl${link}`
            }
        })
    })

    rentolaData.push(...data)

    return rentolaData
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0
            const distance = 320
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight
                window.scrollBy(0, distance)
                totalHeight += distance

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer)
                    resolve()
                }
            }, 150)
        })
    })
}

module.exports = rentolaScraper