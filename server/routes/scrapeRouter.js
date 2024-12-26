const { Router } = require('express')
const scrapeRouter = Router()
const scrapeController = require('../controllers/scrapeController')

scrapeRouter.get('/', (req, res) => {
    res.send('API works!')
})

scrapeRouter.post('/', scrapeController)

module.exports = scrapeRouter