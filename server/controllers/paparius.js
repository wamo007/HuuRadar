const puppeteer = require('puppeteer-extra')

const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

const PAPARIUS_URL = `https://www.pararius.com`

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

    await page.goto(PAPARIUS_URL, { waitUntil: 'networkidle2' })

    await page.waitForSelector('button[id="onetrust-reject-all-handler"]')
    await page.click('button[id="onetrust-reject-all-handler"]')
}

initialSetup()

const papariusScraper = async (city, radius, sortGlobal, minPrice, maxPrice) => {

    let data
    let radiusPaparius
    let initialUrl
    let papariusData = []
    let currentPage = 1

    function sortPaparius(sortingChosen) {
        const options = {
            'new': '',
            'old': '',
            'cheap': '/sort-price-low',
            'pricy': '/sort-price-high',
        }
        return options[sortingChosen.toLowerCase()] ?? 'Sorting type unknown... How???'
    }

    if (radius === '0') {
        radiusPaparius = ''
    } else {
        radiusPaparius = `/radius-${radius}`
    }

    if (!minPrice && !maxPrice) {
        initialUrl = `${PAPARIUS_URL}/apartments/${city.toLowerCase()}${radiusPaparius}${sortPaparius(sortGlobal)}`
    } else if (!minPrice) {
        minPrice = '0'
        initialUrl = `${PAPARIUS_URL}/apartments/${city.toLowerCase()}/${minPrice}-${maxPrice}/${radiusPaparius}${sortPaparius(sortGlobal)}`
    } else if (!maxPrice || maxPrice === 0) {
        maxPrice = '60000'
        initialUrl = `${PAPARIUS_URL}/apartments/${city.toLowerCase()}/${minPrice}-${maxPrice}/${radiusPaparius}${sortPaparius(sortGlobal)}`
    } else {
        initialUrl = `${PAPARIUS_URL}/apartments/${city.toLowerCase()}/${minPrice}-${maxPrice}/${radiusPaparius}${sortPaparius(sortGlobal)}`
    }
    // await page.setViewport({ width: 600, height: 1000})

    await page.goto(initialUrl, {
        waitUntil: 'domcontentloaded'
    })

    let maxPage = await page.evaluate(() => {
        const totalPages = Array.from(document.querySelectorAll('ul.pagination__list li a'))
            .map((a) => {
                // const otherPages = a.querySelector('a')
                return a ? parseInt(a.textContent.trim(), 10) : NaN
            })
            .filter((num) => !isNaN(num))
        return (totalPages.length > 0) ? Math.max(...totalPages) : 1
    })
    
    while (currentPage <= maxPage) {
        const changingUrl = `${initialUrl}/page-${currentPage}`
        await page.goto(changingUrl, {
            waitUntil: 'domcontentloaded'
        })

        // await page.evaluate(() => {
        //     window.scrollTo(0, document.body.scrollHeight);
        //   });

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
                const seller = section.querySelector('div.listing-search-item__info a')?.textContent.trim() || ''
                const sellerLink = section.querySelector('div.listing-search-item__info a')?.getAttribute('href') || ''
                
                return {
                    link,
                    img: img.substring(0, img.length - 20),
                    heading,
                    address,
                    price,
                    size,
                    seller,
                    sellerLink
                }
            })
        })

        papariusData.push(...data)

        currentPage++
    }

    return papariusData
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0
            const distance = 500
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight
                window.scrollBy(0, distance)
                totalHeight += distance

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer)
                    resolve()
                }
            }, 100)
        })
    })
}

module.exports = papariusScraper