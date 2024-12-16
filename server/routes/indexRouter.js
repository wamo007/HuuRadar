const { Router } = require('express')
const indexRouter = Router()
const fundaScraper = require('../controllers/funda')
const papariusScraper = require('../controllers/paparius')
const rentolaScraper = require('../controllers/rentola')

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
        // const funda = await fundaScraper(city, radius, sortGlobal, minPrice, maxPrice)
        // const paparius = await papariusScraper(city, radius, sortGlobal, minPrice, maxPrice)
        await Promise.all([
            fundaScraper(city, radius, sortGlobal, minPrice, maxPrice),
            papariusScraper(city, radius, sortGlobal, minPrice, maxPrice),
            rentolaScraper(city, sortGlobal, minPrice, maxPrice),
        ]).then(([ funda, paparius, rentola ]) => {
            res.status(200)
            .json({ funda, paparius, rentola })
        })
    } catch (error) {
        console.error('Error finding information on the websites: ', error)
        res.status(500)
        .json({ success: false, error: 'Failed to find info on the websites.' })
    }
})

module.exports = indexRouter