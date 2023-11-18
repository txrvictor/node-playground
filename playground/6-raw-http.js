// native node http requests
const http = require('http')

const URL = 'http://api.weatherstack.com/current?access_key=dffe7d4456c837cbbb93ef1b8e1a2d62&query=37.8267,-122.4233'

const request = http.request(URL, (response) => {
  let data = ''

  // data comes on chunks, depening on the API
  response.on('data', (chunk) => {
    data = data + chunk.toString()
  })

  // 'end' callback will only fire when everything is done
  response.on('end', () => {
    const body = JSON.parse(data)
    console.log(body)
  })
})

request.on('error', (error) => {
  // catch request errors
  console.log(error)
})

// run the request
request.end()
