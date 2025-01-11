const Query = require('../models/query')
const cron = require('node-cron')
const _ = require('lodash')
const fundaScraper = require('./scrapers/funda')
const papariusScraper = require('./scrapers/paparius')
const rentolaScraper = require('./scrapers/rentola')

const saveQuery = async (req, res) => {
    try {
        const { email, city, radius, sortGlobal, minPrice, maxPrice, responseData } = req.body
        
        if (!city || !responseData) {
            return res.json({
                error: 'Start the search first...'
            })
        }
        
        if (!email) {
            return res.json({
                error: 'Register or Login first!'
            })
        }

        const parsedData = JSON.parse(responseData)
        const queryData = []

        for (const provider in parsedData) {
            parsedData[provider].forEach((item) => {
                queryData.push({
                    provider,
                    link: item.link,
                    img: item.img,
                    heading: item.heading,
                    address: item.address,
                    price: item.price,
                    size: item.size,
                    seller: item.seller,
                    sellerLink: item.sellerLink,
                })
            })
        }

        const query = new Query({
            email,
            city,
            radius,
            sortGlobal,
            minPrice,
            maxPrice,
            queryData,
        })

        await query.save()

        return res.json({ success: true, message: 'Successfully saved!' })
    } catch (error) {
        if (error.code === 11000) {
            return res.json({
                error: 'You have already added the task with these search parameters.'
            })
        }
        console.log('Something went wrong...', error.message)
    }
}

const compareQuery = async () => {
    try{
        const queries = await Query.find({})

        for (const query of queries) {
            const { city, radius, sortGlobal, minPrice, maxPrice } = query

            const funda = await fundaScraper(city, radius, sortGlobal, minPrice, maxPrice)
            const paparius = await papariusScraper(city, radius, sortGlobal, minPrice, maxPrice)
            const rentola = await rentolaScraper(city,sortGlobal, minPrice, maxPrice)
            const updatedData = [...funda, ...paparius, ...rentola]
            // console.log(responseData)

            const newEntries = updatedData.filter(
                (newEntry) => !query.queryData.some((oldEntry) => oldEntry.link === newEntry.link)
            )

            const removedEntries = query.queryData.filter(
                (oldEntry) => !updatedData.some((newEntry) => newEntry.link === oldEntry.link)
            )

            // const updatedEntries = updatedData.filter((newEntry) => {
            //     const oldEntry = query.queryData.find((oldEntry) => oldEntry.link === newEntry.link)
            //     return oldEntry && !_.isEqual(oldEntry, newEntry)
            // })

            // console.log('New entries: ', newEntries)
            // console.log('Removed entries: ', removedEntries)
            // console.log('Updated entries: ', updatedEntries)

            if (newEntries.length || removedEntries.length) {
                console.log('New entries: ', newEntries)
                await Query.findOneAndUpdate(
                    { _id: query._id },
                    {
                      $set: { queryData: updatedData },
                    },
                    { new: true }
                )
                console.log(`Query updated for email: ${query.email}`)
            } else {
                console.log(`No changes for query: ${query._id}`);
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}

// compareQuery()

cron.schedule('*/5 * * * *', compareQuery)

module.exports = saveQuery