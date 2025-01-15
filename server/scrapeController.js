const fundaScraper = require('./scrapers/funda')
const papariusScraper = require('./scrapers/paparius')
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
        
        const paparius = await papariusScraper(city, radius, sortGlobal, minPrice, maxPrice)
        res.write(JSON.stringify({ paparius }) + '\n')
        
        const rentola = await rentolaScraper(city,sortGlobal, minPrice, maxPrice)
        res.write(JSON.stringify({ rentola }) + '\n')

        res.end()
        

        console.log(`The request for ${city} has been completed on ${new Date()}`)
    } catch (error) {
        console.error('Error finding information on the websites: ', error)
        res.status(500)
        .json({ success: false, error: 'Failed to find info on the websites.' })
    }
}

module.exports = scrapeController