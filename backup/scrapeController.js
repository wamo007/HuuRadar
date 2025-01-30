const fundaScraper = require('./scrapers/funda')
const parariusScraper = require('./scrapers/pararius')
const rentolaScraper = require('./scrapers/rentola')

const scrapeController = async (req, res) => {
    const city = req.body.city
    const radius = req.body.radius
    const sortGlobal = req.body.sortGlobal
    const minPrice = req.body.minPrice
    const maxPrice = req.body.maxPrice

    if (!city) {
        return res.status(400)
        .send({ error: 'Please, provide information about the city.' })
    }

    console.log(`Processing the request for ${city}, ${radius}, ${sortGlobal}, ${minPrice} - ${maxPrice}. Time: ${new Date()}`)

    res.setHeader('Content-Type', 'application/json')

    try {
        const funda = await fundaScraper(city, radius, sortGlobal, minPrice, maxPrice)
        res.write(JSON.stringify({ funda }) + '\n')
        
        const pararius = await parariusScraper(city, radius, sortGlobal, minPrice, maxPrice)
        res.write(JSON.stringify({ pararius }) + '\n')
        
        const rentola = await rentolaScraper(city,sortGlobal, minPrice, maxPrice)
        res.write(JSON.stringify({ rentola }) + '\n')

        // await Promise.all([
        //     fundaScraper(city, radius, sortGlobal, minPrice, maxPrice),
        //     parariusScraper(city, radius, sortGlobal, minPrice, maxPrice),
        //     rentolaScraper(city, sortGlobal, minPrice, maxPrice),
        //     // hAnywhereScraper(city, sortGlobal, minPrice, maxPrice)
        // ]).then(([ funda, pararius, rentola, hAnywhere ]) => {
        //     res.status(200)
        //     .json({ funda, pararius, rentola, hAnywhere })
        res.end()
        

        console.log(`The request for ${city} has been completed on ${new Date()}`)
    } catch (error) {
        console.error('Error finding information on the websites: ', error)
        res.status(500)
        .json({ success: false, error: 'Failed to find info on the websites.' })
    }
}

module.exports = scrapeController