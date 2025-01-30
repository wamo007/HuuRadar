const axios = require('axios')
// const https = require('https')

// const sortProviders = ['funda', 'hAnywhere', 'kamernet', 'pararius', 'huurwoningen', 'rentola']

const workerServers = [
    { url: 'http://141.148.242.13:8089/extractor', scrapers: ['funda', 'rentola'] },
    { url: 'http://localhost:4000/extractor', scrapers: ['kamernet', 'pararius'] },
    { url: 'http://localhost:3001/extractor', scrapers: ['huurwoningen', 'hAnywhere'] },
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
        let completedProviders = 0
        const totalProviders = workerServers.reduce((acc, worker) => {
            const scrapersToRun = worker.scrapers.filter(scraper => selectedProviders.includes(scraper))
            return acc + (scrapersToRun.length > 0 ? 1 : 0)
        }, 0)

        workerServers.forEach(worker => {
            const scrapersToRun = worker.scrapers.filter(scraper => selectedProviders.includes(scraper))
            if (scrapersToRun.length > 0) {
                axios.post(worker.url, {
                    scrapers: scrapersToRun,
                    city,
                    radius,
                    sortGlobal,
                    minPrice,
                    maxPrice,
                }).then(workerResponse => {
                    res.write(JSON.stringify(workerResponse.data) + '\n')
                    completedProviders++
                    if (completedProviders === totalProviders) {
                        res.end()
                        console.log(`Time of completion for ${city} - ${new Date()}`)
                    }
                })
            }
        })
        // const promises = workerServers.map((worker) => {
        //     const scrapersToRun = worker.scrapers.filter((scraper) => selectedProviders.includes(scraper));
        //     if (scrapersToRun.length > 0) {
        //       return axios.post(worker.url, {
        //         scrapers: scrapersToRun,
        //         city,
        //         radius,
        //         sortGlobal,
        //         minPrice,
        //         maxPrice,
        //       });
        //     }
        //     return null;
        // }).filter(Boolean)

        // const results = await Promise.all(promises)

        // results.forEach((workerResponse) => {
        //     res.write(JSON.stringify(workerResponse.data) + '\n');
        // })

        // res.end()

        // console.log(`The request for ${city} has been completed on ${new Date()}`)
    } catch (error) {
        console.error('Error finding information on the websites:', error)
        res.status(500)
        .json({ success: false, error: 'Failed to find info on the websites.' })
    }
}

module.exports = scrapeController