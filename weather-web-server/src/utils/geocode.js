const request = require('postman-request')

const geocode = (address, callback) => {
  const uri = `https://geocode.maps.co/search?q=${address}`

  request({
    uri,
    method: 'GET',
    json: true,
  }, (error, {body}) => {
    if (error) {
      callback(`Request failed: ${error}`, undefined)
      return
    }
    if (!body || body.length === 0) {
      callback('Unable to find location', undefined)
      return
    }

    callback(undefined, {
      latitude: body[0].lat,
      longitude: body[0].lon,
      location: body[0].display_name,
    })
  })
}

module.exports = geocode