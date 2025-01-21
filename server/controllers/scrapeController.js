const axios = require('axios')
// const https = require('https')

// const sortProviders = ['funda', 'hAnywhere', 'kamernet', 'paparius', 'huurwoningen', 'rentola']

const workerServers = [
    { url: 'http://localhost:3001/extractor', scrapers: ['funda', 'hAnywhere'] },
    { url: 'http://localhost:3002/extractor', scrapers: ['kamernet', 'paparius'] },
    { url: 'http://localhost:3003/extractor', scrapers: ['huurwoningen', 'rentola'] },
]

// const httpsAgent = new https.Agent({
//     rejectUnauthorized: true,
// });

const scrapeController = async (req, res) => {
    const { city, radius, selectedProviders, sortGlobal, minPrice, maxPrice } = req.body

    if (!city) {
        return res.status(400)
        .send({ error: 'Please, provide information about the city.' })
    }

    console.log(`Processing the request for ${city}, ${radius} km, ${selectedProviders}, ${sortGlobal}, ${minPrice} - ${maxPrice}. Time: ${new Date()}`)

    res.setHeader('Content-Type', 'application/json')

    try {
        const promises = workerServers.map((worker) => {
            const scrapersToRun = worker.scrapers.filter((scraper) => selectedProviders.includes(scraper));
            if (scrapersToRun.length > 0) {
              return axios.post(worker.url, {
                scrapers: scrapersToRun,
                city,
                radius,
                sortGlobal,
                minPrice,
                maxPrice,
              });
            }
            return null;
        }).filter(Boolean)

        const results = await Promise.all(promises)

        results.forEach((workerResponse) => {
            res.write(JSON.stringify(workerResponse.data) + '\n');
        })

        res.end()

        console.log(`The request for ${city} has been completed on ${new Date()}`)
    } catch (error) {
        console.error('Error finding information on the websites:', error)
        res.status(500)
        .json({ success: false, error: 'Failed to find info on the websites.' })
    }
}

module.exports = scrapeController