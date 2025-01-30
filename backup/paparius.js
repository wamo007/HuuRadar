const { getBrowser } = require('./masterScraper')
// const puppeteer = require('puppeteer-extra')

// const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer')
// const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

const PARARIUS_URL = `https://www.pararius.com`

// puppeteer.use(
//   AdblockerPlugin({
//     interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY,
//     blockTrackers: true
//   })
// )

const initialSetup = async () => {
    browser = await puppeteer.launch({ 
        headless: true,
        args: ["--disable-notifications"],
    })

    page = await browser.newPage()

    await page.goto(PARARIUS_URL, { 
        waitUntil: 'networkidle2',
        timeout: 30000,
        }).catch((err) => {
            console.error(`Navigation to ${PARARIUS_URL} failed:`, err.message);
            return []
        })

    try {
        await page.waitForSelector('button[id="onetrust-reject-all-handler"]', {timeout: 400})
        await page.click('button[id="onetrust-reject-all-handler"]')
    } catch (error) {
        console.log('Pararius popup did not appear, skipping this step...')
    }

}

// initialSetup()

const parariusScraper = async (city, radius, sortGlobal, minPrice, maxPrice) => {

    // const browser = await puppeteer.launch({ 
    //     headless: true,
    //     args: ["--disable-notifications"],
    // })
    const browser = await getBrowser()

    const page = await browser.newPage()

    let data
    let radiusPararius
    let initialUrl
    let parariusData = []
    let currentPage = 1

    function sortPararius(sortingChosen) {
        const options = {
            'new': '',
            'old': '',
            'cheap': '/sort-price-low',
            'pricy': '/sort-price-high',
        }
        return options[sortingChosen.toLowerCase()] ?? 'Sorting type unknown... How???'
    }

    if (radius === '0') {
        radiusPararius = ''
    } else {
        radiusPararius = `/radius-${radius}`
    }

    if (!minPrice && !maxPrice) {
        initialUrl = `${PARARIUS_URL}/apartments/${city.toLowerCase()}${radiusPararius}${sortPararius(sortGlobal)}/since-3`
    } else if (!minPrice) {
        minPrice = '0'
        initialUrl = `${PARARIUS_URL}/apartments/${city.toLowerCase()}/${minPrice}-${maxPrice}/${radiusPararius}${sortPararius(sortGlobal)}/since-3`
    } else if (!maxPrice || maxPrice === 0) {
        maxPrice = '60000'
        initialUrl = `${PARARIUS_URL}/apartments/${city.toLowerCase()}/${minPrice}-${maxPrice}/${radiusPararius}${sortPararius(sortGlobal)}/since-3`
    } else {
        initialUrl = `${PARARIUS_URL}/apartments/${city.toLowerCase()}/${minPrice}-${maxPrice}/${radiusPararius}${sortPararius(sortGlobal)}/since-3`
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
        const changingUrl = `${initialUrl}/page-${currentPage}`
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
                const seller = section.querySelector('div.listing-search-item__info a')?.textContent.trim() || ''
                const sellerLink = section.querySelector('div.listing-search-item__info a')?.getAttribute('href') || ''

                let filterPrice = ''

                if (isNaN(parseFloat(price.substring(1, price.length - 10)))) {
                    filterPrice = 'Price On Request'
                } else {
                    filterPrice = `${price.substring(0, 1)} ${price.substring(1, price.length - 10)} p/mo.`
                }

                return {
                    provider: 'pararius',
                    link: `https://www.pararius.com${link}`,
                    img: img.substring(0, img.length - 20),
                    heading,
                    address,
                    price: filterPrice,
                    size,
                    seller,
                    sellerLink: `https://www.pararius.com${sellerLink}`
                }
            })
        })

        parariusData.push(...data)
        currentPage++
    }
    await page.close()
    // await browser.close()
    return parariusData
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

module.exports = parariusScraper