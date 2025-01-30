const express = require('express')
// const bodyParser = require('body-parser')
const fundaScraper = require('./scrapers/funda')
const hAnywhereScraper = require('./scrapers/hAnywhere')
const parariusScraper = require('./scrapers/pararius')
const rentolaScraper = require('./scrapers/rentola')
const kamernetScraper = require('./scrapers/kamernet')
const huurwoningenScraper = require('./scrapers/huurwoningen')

const app = express()

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ parameterLimit: 100000, limit: '50mb', extended: true }))

const scrapers = {
  funda: fundaScraper,
  hAnywhere: hAnywhereScraper,
  kamernet: kamernetScraper,
  pararius: parariusScraper,
  huurwoningen: huurwoningenScraper,
  rentola: rentolaScraper,
}

app.post('/extractor', async (req, res) => {
  const { scrapers: scrapersToRun, city, radius, sortGlobal, minPrice, maxPrice } = req.body

  try {
    const results = {}
    for (const providerId of scrapersToRun) {
      const scraper = scrapers[providerId]
      const data = await scraper(city, radius, sortGlobal, minPrice, maxPrice)
      results[providerId] = data
      console.log('Scraping Complete!')
    }
    res.json(results)
  } catch (error) {
    console.error('Error scraping:', error)
    res.status(500).json({ success: false, error: 'Failed to scrape.' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Minion server running on port ${PORT}`)
})