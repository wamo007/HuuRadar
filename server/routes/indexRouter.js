const { Router } = require('express')
const indexRouter = Router()
const fundaScraper = require('../controllers/funda')
const papariusScraper = require('../controllers/paparius')
const rentolaScraper = require('../controllers/rentola')
// const hAnywhereScraper = require('../controllers/hAnywhere')

indexRouter.get('/', (req, res) => {
    res.send('works')
})

indexRouter.post('/', async (req, res) => {
    const city = req.body.city
    const radius = req.body.radius
    const sortGlobal = req.body.sortGlobal
    const minPrice = req.body.minPrice
    const maxPrice = req.body.maxPrice

    if (!city) {
        return res.status(400)
        .send({ error: 'Please, provide information about the city.' })
    }

    try {
        console.log(`Processing the request for ${city}, ${radius}, ${sortGlobal}, ${minPrice} - ${maxPrice}. Time: ${new Date()}`)
        // const funda = await fundaScraper(city, radius, sortGlobal, minPrice, maxPrice)
        // const paparius = await papariusScraper(city, radius, sortGlobal, minPrice, maxPrice)
        await Promise.all([
            fundaScraper(city, radius, sortGlobal, minPrice, maxPrice),
            papariusScraper(city, radius, sortGlobal, minPrice, maxPrice),
            rentolaScraper(city, sortGlobal, minPrice, maxPrice),
            // hAnywhereScraper(city, sortGlobal, minPrice, maxPrice)
        ]).then(([ funda, paparius, rentola, hAnywhere ]) => {
            res.status(200)
            .json({ funda, paparius, rentola, hAnywhere })
            console.log(`The request for ${city} has been completed on ${new Date()}`)
        })
    } catch (error) {
        console.error('Error finding information on the websites: ', error)
        res.status(500)
        .json({ success: false, error: 'Failed to find info on the websites.' })
    }
})

module.exports = indexRouter