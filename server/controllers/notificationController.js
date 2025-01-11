const fs = require('fs')
const path = require('path')
const Query = require('../models/query')
const cron = require('node-cron')
const transporter = require('../config/nodeMailer')
const fundaScraper = require('./scrapers/funda')
const papariusScraper = require('./scrapers/paparius')
const rentolaScraper = require('./scrapers/rentola')

const saveQuery = async (req, res) => {
    try {
        const { name, email, city, radius, sortGlobal, minPrice, maxPrice, responseData } = req.body
        
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
            name,
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

            if (newEntries.length) {
                console.log('New entries: ', newEntries)
                try {
                    const emailNewEntriesTemplatePath = path.join(__dirname, '../config', 'NewEntries.html')
                    let emailNewEntriesTemplate = fs.readFileSync(emailNewEntriesTemplatePath, 'utf-8')
            
                    const mailEntries = newEntries.map((entry) => {
                        return `
                            <div style="padding: 10px; margin-bottom: 10px; border-radius: 10px; background-color: whitesmoke;">
                              <a href="${entry.link}">
                                <img src="${entry.img.split(' ')[0]}" alt="${entry.heading}" style="width: 180px; height: 120px; border-radius: 10px; object-fit: cover;">
                              </a>
                              <div>
                                <a href="${entry.link}" style="text-decoration: none; color: black;">
                                  <h2 style="margin-bottom: 7px;">${entry.heading} on ${entry.provider.charAt(0).toUpperCase()}</h2>
                                  <h3 style="margin: 0;">${entry.address}</h3>
                                </a>
                                <div>
                                  <h3 style="text-decoration: none; color: black;">${entry.price}</h3>
                                  <h4 style="text-decoration: none; color: black;">Size: ${entry.size}</h4>
                                  <a href="${entry.sellerLink}" style="text-decoration: none; color: black;">
                                      Seller: ${entry.seller}
                                  </a>
                                </div>
                              </div>
                            </div>
                        `
                    }).join(''); // to convert it all to a string for the template entry
                    
                    emailNewEntriesTemplate = emailNewEntriesTemplate
                        .replace('{{name}}', query.name)
                        .replace(/{{#newEntries}}[\s\S]*?{{\/newEntries}}/, mailEntries)
                    console.log('Processed HTML:', emailNewEntriesTemplate)
    
                    const mailOptions = {
                        from: process.env.SENDER_EMAIL,
                        to: query.email,
                        subject: 'New listings avaiable!',
                        html: emailNewEntriesTemplate,
                        attachments: [
                            {
                                filename: 'logo.png',
                                path: path.join(__dirname, '../public/assets/logo.png'),
                                cid: 'logo',
                            },
                            {
                                filename: 'bg_email.png',
                                path: path.join(__dirname, '../public/assets/bg_email.png'),
                                cid: 'bg_email',
                            },
                            {
                                filename: 'github-original.png',
                                path: path.join(__dirname, '../public/assets/github-original.png'),
                                cid: 'github',
                            },
                            {
                                filename: 'linkedin-plain.png',
                                path: path.join(__dirname, '../public/assets/linkedin-plain.png'),
                                cid: 'linkedin',
                            }
                        ]
                    }
                
                    await transporter.sendMail(mailOptions)
                } catch (error) {
                    console.error('Email error: ', error.message)
                }

                await Query.findOneAndUpdate(
                    { _id: query._id },
                    {
                      $set: { queryData: updatedData },
                    },
                    { new: true }
                )
                console.log(`Query updated for email: ${query.email}. ID: ${query._id}`)
            } else {
                console.log(`No changes for query: ${query._id}`);
            }
        }
    } catch (error) {
        console.log('Error occured: ', error.message)
    }
}

// compareQuery()

cron.schedule('*/5 * * * *', compareQuery)

module.exports = saveQuery