// native node http requests
const https = require('https')

const URL = `https://geocode.maps.co/search?q=seoul`

const request = https.request(URL, (response) => {
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
