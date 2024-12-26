const puppeteer = require('puppeteer-extra')

const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

const FUNDA_URL = `https://www.funda.nl/en/zoeken/huur?selected_area=%5B%22${city},${radius}km%22%5D&sort="${sortFunda}"&price="${minPrice}-${maxPrice}`
const PAPARIUS_URL = `https://www.pararius.com/apartments/${city}/${minPrice}-${maxPrice}/radius-${radius}${sortPaparius}`
const RENTOLA_URL = `https://rentola.nl/en/for-rent?location=${city}&order=${sortRentola}&rent=${minPrice}-${maxPrice}`
const HOUSING_ANYWHERE_URL = `https://housinganywhere.com/s/${city}--Netherlands?sorting=${sortHA}&categories=shared-rooms%2Cprivate-rooms%2Cstudio-for-rent%2Cstudent-housing&priceMin=${minPrice}00&priceMax=${maxPrice}00`
const IAMEXPAT_URL = `https://www.iamexpat.nl/housing/rentals/${city}/room/${minPrice}-${maxPrice}` //Order will be done by puppeteer in headless
const DIRECT_WONEN_URL = `https://directwonen.nl/en/rentals-for-rent/${city}` //minPrice, maxPrice, radius, sorting, type of property should be done in puppeteer3
const PROPERSTAR_URL = `https://www.properstar.nl/nederland/${city}-loc/huur/appartement-huis/${sortPStar}?price.min=${minPrice}&price.max=${maxPrice}`
const KAMERNET_URL = `https://kamernet.nl/en/for-rent/properties-${city}?searchview=1&maxRent=${maxPriceKamernet}&radius=${radius}&pageNo=1&sort=${sortKamernet}` //maxPrice is 1,2,3...,33 | sort is 1,2,4,5,6 | radius is 1,2,3,4,5,7

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

    await page.goto(FACEBOOK_MARKETPLACE_URL, { waitUntil: 'networkidle2' })

    await page.waitForSelector('div[aria-label="Decline optional cookies"]')
    await page.click('div[aria-label="Decline optional cookies"]')

    await page.waitForSelector('input[name="email"]')
    await page.type('input[name="email"]','wamo.watch.dogs@gmail.com' , { delay: 100 })
    
    await page.keyboard.press('Tab')

    await page.waitForSelector('input[name="pass"]') 
    await page.type('input[name="pass"]','PraBilDno22' , { delay: 100 })

    await page.waitForSelector('div[aria-label="Accessible login button"]')
    await page.click('div[aria-label="Accessible login button"]')
}

initialSetup()

const fbScraper = async (url, country, state, city, category) => {
    // const browser = await puppeteer.launch({ 
    //     headless: false,
    // })
    // const page = await browser.newPage()

    let finalUrl

    if (!url) {
        // await page.setViewport({ width: 600, height: 1000})
        
        await page.goto(FACEBOOK_MARKETPLACE_URL , {
            waitUntil: 'domcontentloaded'
        })

        // Decline the cookies
        // await page.waitForSelector('div[aria-label="Decline optional cookies"]')
        // await page.click('div[aria-label="Decline optional cookies"]')

        // Close the login popup
        // try {
        //     await page.waitForSelector('div[aria-label="Close"]', { timeout: 150 })
        //     await page.click('div[aria-label="Close"]')
        // } catch (error) {
        //     console.log('Login form did not pop up, skipping the step...')
        // }

        // Click the location change button
        await page.waitForSelector(`i[style="background-image:url('https://static.xx.fbcdn.net/rsrc.php/v4/ys/r/nZ9ll5aLdi7.png')background-position:0 -496pxbackground-size:autowidth:16pxheight:16pxbackground-repeat:no-repeatdisplay:inline-block"]`)
        await page.click(`i[style="background-image:url('https://static.xx.fbcdn.net/rsrc.php/v4/ys/r/nZ9ll5aLdi7.png')background-position:0 -496pxbackground-size:autowidth:16pxheight:16pxbackground-repeat:no-repeatdisplay:inline-block"]`)

        // Enter city name
        await page.waitForSelector('input[aria-label="Location"]', { visible: true })
        await page.type('input[aria-label="Location"]', city.split(',')[0], { delay: 100 })

        let locationFound = false

        try {
            await page.waitForSelector('[role="option"]', { timeout: 1000 })
            // await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 500)))
            await page.click('[role="option"]')
            locationFound = true
        } catch (error) {
            try {
                await page.type('input[aria-label="Location"]', `, ${state.split(',')[1]}`, { delay: 100 })
                await page.waitForSelector('[role="option"]', { timeout: 500 })
                await page.click('[role="option"]')
                locationFound = true
            } catch (error) {
                try {
                    await page.keyboard.down('Control')
                    await page.keyboard.press('A')
                    await page.keyboard.up('Control')
                    await page.keyboard.press('Delete')
                    await page.type('input[aria-label="Location"]', country.split(',')[1], { delay: 100 })
                    await page.waitForSelector('[role="option"]', { timeout: 500 })
                    await page.click('[role="option"]')
                    locationFound = true
                } catch (error) {
                    console.log('Location not found!')
                }
            }
        }

        if (!locationFound) {
            console.log('No valid location found. Breaking operation.')
            return []
        }

        // Apply the location
        await page.waitForSelector('div[aria-label="Apply"]', { visible: true })
        await page.click('div[aria-label="Apply"]')

        // Wait for navigation to complete
        await page.waitForNavigation({ waitUntil: 'networkidle2' })
        finalUrl = `${page.url()}/${category}?sortBy=creation_time_descend&exact=true`

        await page.goto(finalUrl, { waitUntil: 'domcontentloaded' })

    } else {
        await page.goto(url, {
            waitUntil: 'domcontentloaded'
        })
    }
    
    await page.waitForSelector("div[id^='mount_0_0_']")

    await autoScroll(page, "Results from outside your search")
    
    let data = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(
        "div[aria-label^='Collection of Marketplace items'] div[style='max-width:1872px'] a"
        )).map((a) => {
            const itemNames = Array.from(a.querySelectorAll("span[dir='auto']")).map((span) =>
                span.textContent.trim()
            )
            const img = Array.from(a.querySelectorAll("img")).map((img) =>
                img.src
            )
            
            return {
                itemNames,
                img,
                link: a.href,
            }
        })
    })
    
    data = data.filter((item) => item.itemNames.length >= 2)

    data.forEach((item) => {
        const { itemNames } = item

        const currencyRegex = /^(?:€|\$|£|ALL|AZN|USD|GBP|CAD|AUD|JPY|CHF|CNY|INR|RUB|BRL|ZAR)\d{1,3}(?:,\d{3})*(?:\.\d{2})?$/

        if (currencyRegex.test(itemNames[1])) {
            itemNames[1] = itemNames[2]
            itemNames[2] = itemNames[3]
            if (itemNames[4]) {itemNames[3] = itemNames[4]}
        }

        if (itemNames.length === 3 && /^[^,]+, [^,]+$/.test(itemNames[1])) {
            itemNames.push(itemNames[2])
            itemNames[2] = itemNames[1]
            itemNames[1] = ""
        }
    })

    // await browser.close()
    return data
}

async function autoScroll(page, stopText) {
    await page.evaluate(async (stopText) => {
        await new Promise((resolve) => {
            let totalHeight = 0
            const distance = 100
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight
                window.scrollBy(0, distance)
                totalHeight += distance

                const elementWithText = Array.from(document.querySelectorAll('body *')).find(
                    (el) => el.textContent.trim() === stopText
                )

                if (elementWithText || totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer)
                    resolve()
                }
            }, 200)
        })
    }, stopText)
}


module.exports = fbScraper