// const { getBrowser } = require('./masterScraper')
const puppeteer = require('puppeteer-extra')

const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

const NIYA_URL = `https://www.niya.nl//`

puppeteer.use(
  AdblockerPlugin({
    interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY,
    blockTrackers: true
  })
)

// const requestHeaders = {
//     'user-agent':
//         'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
//     Referer: 'https://www.google.com/',
// }

const initialSetup = async () => {
    const browser = await puppeteer.launch({ 
        headless: false,
        args: [
            "--disable-notifications",
        ],
    })

    const page = await browser.newPage()

    await page.goto(NIYA_URL, { waitUntil: 'networkidle2',
        timeout: 30000,
        }).catch((err) => {
            console.error(`Navigation to ${NIYA_URL} failed:`, err.message);
            return []
            })

    try {
        const disagreeBtn = await page.waitForSelector('button[id="didomi-notice-disagree-button"]', {timeout: 1000})
        if (disagreeBtn) await page.click('button[id="didomi-notice-disagree-button"]')
    } catch (error) {
        console.log('Funda popup did not appear, skipping this step...')
    }
    await page.close()
}

// initialSetup()

const niyaScraper = async (city, radius, sortGlobal, minPrice, maxPrice) => {

    const browser = await puppeteer.launch({ 
        headless: false,
        args: [
            "--disable-notifications",
        ],
    })
    // const browser = await getBrowser()
    const page = await browser.newPage()
    // await page.setExtraHTTPHeaders({ ...requestHeaders })
    
    let data
    let initialUrl
    let fundaData = []
    let currentPage = 1

    function sortNiya(sortingChosen) {
        const options = {
            'new': 'date-desc',
            'old': 'date-asc',
            'cheap': 'price-asc',
            'pricy': 'price-desc',
        }
        return options[sortingChosen.toLowerCase()] ?? 'Sorting type unknown... How???'
    }

    if (!minPrice && !maxPrice) {
        initialUrl = `${NIYA_URL}properties-search/?type=any&keyword=&location=${city.toLowerCase()}&status=any&min-price=any&max-price=any&sortby=${sortFunda(sortGlobal)}`
    } else {
        initialUrl = `${NIYA_URL}properties-search/?type=any&keyword=&location=${city.toLowerCase()}&status=any&min-price=${minPrice}&max-price=${maxPrice}&sortby=${sortFunda(sortGlobal)}`
    } 

    await page.goto(initialUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000,
        }).catch((err) => {
            console.error(`Navigation to ${initialUrl} failed:`, err.message);
            return []
        })

    let maxPage = await page.evaluate(() => {
        const totalPages = Array.from(document.querySelectorAll('a[href*="?page="]'))
            .map((a) => {
                return a ? parseInt(a.textContent.trim(), 10) : NaN
            })
            .filter((num) => !isNaN(num))
        console.log(totalPages)
        return (totalPages.length > 0) ? Math.max(...totalPages) : 1
    })
        
    while (currentPage <= maxPage) {
        const changingUrl = `${initialUrl}&search_result=${currentPage}`
        await page.goto(changingUrl, {
            waitUntil: 'domcontentloaded'
        })

        try {
            const content = await page.$('div.pt-4 div[data-test-id="search-result-item"]')
            if (content) {
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
                    
                        let filterPrice = ''
                    
                        if (price.length < 10) {
                            filterPrice = 'Price On Request'
                        } else {
                            filterPrice = price
                        }
                    
                        return {
                            provider: 'funda',
                            link,
                            img,
                            heading,
                            address,
                            price: filterPrice,
                            size,
                            seller,
                            sellerLink
                        }
                    })
                })
            } else {
                data = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll(
                      'div.border-b.pb-3>div.flex-col'
                      )).map((div) => {
                        const link = div.querySelector("a").getAttribute('href')
                        const img = div.querySelector("img")?.getAttribute('srcset') || ''
                        const heading = div.querySelector("a span").textContent.trim()
                        const address = div.querySelector('a>div.truncate').textContent.trim()
                        const price = div.querySelector('div.font-semibold>div.truncate:last-child').textContent.trim()
                        const size = div.querySelector('li.flex')?.textContent.trim() || ''
                        const seller = div.querySelector('div.mr-2 a')?.textContent.trim() || ''
                        const sellerLink = div.querySelector('div.mr-2 a')?.getAttribute('href') || ''
                    
                        let filterPrice = ''

                        if (price.length < 10) {
                            filterPrice = 'Price On Request'
                        } else {
                            filterPrice = price
                        }

                        return {
                            provider: 'funda',
                            link: `https://www.funda.nl/en${link}`,
                            img,
                            heading,
                            address,
                            price: `${filterPrice.substring(0, filterPrice.length - 6)} p/mo`,
                            size,
                            seller,
                            sellerLink
                        }
                    })
                })
            }
            fundaData.push(...data)
        } catch (error) {
            console.log('Funda did not give anything, skipping it...')
        }
        currentPage++
    }

    await page.close()
    // await browser.close()
    return fundaData
}

module.exports = fundaScraper