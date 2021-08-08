require('dotenv').config()
const express = require('express')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// API calls

app.get('/api/rovers', async (req, res) => {
    try {
        const data = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
            .then(roversFilter)
        res.send({ data })
    } catch (err) {
        console.log('error:', err);
    }
})

app.get('/api/rovers/:rover', async (req, res) => {
    const {rover} = req.params
    try {
        const data = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
            .then(photoFilter)
        res.send({ data })
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const roversFilter = (data) => {
    const rovers = data.rovers.map(rover => {
        const {name, landing_date, launch_date, status,cameras, max_date, max_sol, total_photos} = rover
        const total_cam = cameras.length
        return {name,landing_date,launch_date,status, max_date, max_sol, total_photos, total_cam}
    })
    return rovers
}

const photoFilter = (data) => {
    const {latest_photos:photos} = data
    return photos.filter((_,ind)=>(ind < 12)).map(photo => {
        const {camera:{full_name:cam_name},img_src:img, earth_date:date} = photo
        return {cam_name, date, img}
    })
}