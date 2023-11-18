const dotenv = require('dotenv')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// load environment variables from .env file
dotenv.config()

if (!process.env.WEATHERSTACK_API_KEY) {
  console.log('Missing WEATHERSTACK_API_KEY in .env file')
  process.exit(1)
}

// get args given by command line
const address = process.argv[2]

if (!address) {
  console.log('Address argument is missing')
} else {
  geocode(address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return console.log(error)
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return console.log(error)
      }

      console.log(location)
      console.log(forecastData)
    })
  })
}
