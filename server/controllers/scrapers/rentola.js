const { getBrowser } = require('./masterScraper')
const RENTOLA_URL = `https://www.rentola.nl/en/`

const rentolaScraper = async (city, sortGlobal, minPrice, maxPrice) => {

    const browser = await getBrowser()

    const page = await browser.newPage()

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

    await page.goto(initialUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
    }).catch((err) => {
        console.error(`Navigation to ${initialUrl} failed:`, err.message)
        return rentolaData
    })

    await autoScroll(page)
    
    data = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(
          'ul div[data-testid="propertyTile"]'
          )).map((div) => {
            const link = div.querySelector("a").getAttribute('href')
            const img = div.querySelector("img")?.getAttribute('src') || ''
            const heading = div.querySelector("p").textContent.trim()
            const address = div.querySelector("div.mb-4 p.line-clamp-3").textContent.trim()
            const price = div.querySelector('div.p-4 div.mb-2 p.text-xl').textContent.trim()
            const size = div.querySelector('span.mr-1')?.textContent.trim() || ''
    
            return {
                provider: 'rentola',
                link: `https://www.rentola.nl${link}`,
                img,
                heading,
                address,
                price: `${price.split(' ').slice(1, 2).join(' ')} ${price.split(' ').slice(0, 1).join(' ')} p/mo.`,
                size: `${size} m²`,
                seller: 'Rentola',
                sellerLink: `https://www.rentola.nl${link}`
            }
        })
    })

    rentolaData.push(...data)

    await page.close()
    return rentolaData
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0
            const distance = 300
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