const puppeteer = require('puppeteer-extra')

const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

const IAMEXPAT_URL = `https://www.iamexpat.nl`

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

    await page.goto(IAMEXPAT_URL, { waitUntil: 'networkidle2' })

    try {
        await page.waitForSelector('button[id="onetrust-pc-btn-handler"]', {timeout: 400})
        await page.click('button[id="onetrust-pc-btn-handler"]')
        await page.waitForSelector('button.ot-pc-refuse-all-handler', {timeout: 400})
        await page.click('button.ot-pc-refuse-all-handler')
    } catch (error) {
        console.log('Privacy popup did not appear, skipping this step...')
    }

}

initialSetup()

const iAmExpatScraper = async (city, radius, sortGlobal, minPrice, maxPrice) => {

    let data
    let radiusIAmExpat
    let initialUrl
    let iamexpatData = []
    let currentPage = 1

    function sortIAmExpat(sortingChosen) {
        const options = {
            'new': 'li[data-val="sort_desc"]',
            'old': 'li[data-val="sort_asc"]',
            'cheap': 'li[data-val="sort_price_asc"]',
            'pricy': 'li[data-val="sort_price_desc"]',
        }
        return options[sortingChosen.toLowerCase()] ?? 'Sorting type unknown... How???'
    }

    if (radius === '0') {
        radiusIAmExpat = ''
    } else {
        radiusIAmExpat = `/radius-${radius}`
    }

    if (!minPrice && !maxPrice) {
        initialUrl = `${IAMEXPAT_URL}/housing/rentals/${city}/room`
    } else if (!minPrice) {
        minPrice = '0'
        initialUrl = `${IAMEXPAT_URL}/housing/rentals/${city}/room/${minPrice}-${maxPrice}`
    } else if (!maxPrice || maxPrice === 0) {
        maxPrice = '60000'
        initialUrl = `${IAMEXPAT_URL}/housing/rentals/${city}/room/${minPrice}-${maxPrice}`
    } else {
        initialUrl = `${IAMEXPAT_URL}/housing/rentals/${city}/room/${minPrice}-${maxPrice}`
    }

    await page.goto(initialUrl, {
        waitUntil: 'domcontentloaded'
    })

    await page.evaluate(() => {
        const changeSorting = document.querySelector(sortIAmExpat(sortGlobal))
        if (changeSorting) changeSorting.click()
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
        await page.evaluate(() => {
            const nextPage = document.querySelector(sortIAmExpat(sortGlobal))
            if (changeSorting) changeSorting.click()
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
                const seller = section.querySelector('div.listing-search-item__info a')?.textContent.trim() || ''
                const sellerLink = section.querySelector('div.listing-search-item__info a')?.getAttribute('href') || ''
                
                return {
                    link: `https://www.iamexpat.nl${link}`,
                    img: img.substring(0, img.length - 20),
                    heading,
                    address,
                    price,
                    size,
                    seller,
                    sellerLink: `https://www.iamexpat.nl${sellerLink}`
                }
            })
        })

        iamexpatData.push(...data)

        currentPage++
    }

    return iamexpatData
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

module.exports = iAmExpatScraper