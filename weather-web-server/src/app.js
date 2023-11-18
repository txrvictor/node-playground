const path = require('path')
const dotenv = require('dotenv')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// load environment variables from .env file
dotenv.config()

if (!process.env.WEATHERSTACK_API_KEY) {
  console.log('Missing WEATHERSTACK_API_KEY in .env file')
  process.exit(1)
}

const AUTHOR_NAME = 'Inigo Montoya'

// define paths for Express cofnig
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

const app = express()

// setup Handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// setup static directory to serve files ("public/*")
app.use(express.static(publicDirPath))

app.get('', (req, res) => {
  // render a view in the views location (templates/views/index.hbs)
  res.render('index', {
    title: 'Weather',
    name: AUTHOR_NAME,
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: AUTHOR_NAME,
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    name: AUTHOR_NAME,
    helpText: 'Some helpful text',
  })
})

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    res.send({error: 'Require address parameter'})
    return
  }

  geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
    if (error) {
      res.send({
        message: 'Failed to retrieve geocode location',
        error,
      })
      return
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        res.send({
          message: 'Failed to retrieve forecast data',
          error,
        })
        return
      }

      res.send({
        forecast: forecastData,
        location,
        address: req.query.address,
      })
    })
  })
})

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: AUTHOR_NAME,
    errorMessage: 'Help article not found',
  })
})

// everything else which doesn't match the router
app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: AUTHOR_NAME,
    errorMessage: 'Page not found',
  })
})

// using dev port 3000:
app.listen(3000, () => {
  console.log('Server is up on port 3000')
})
