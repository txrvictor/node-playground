const request = require('postman-request')

const forecast = (latidude, longitude, callback) => {
  const uri = `http://api.weatherstack.com/current?access_key=${process.env.WEATHERSTACK_API_KEY}&query=${latidude},${longitude}`

  request({
    uri,
    method: 'GET',
    json: true,
  }, (error, {body}) => {
    if (error) {
      callback(`Request failed: ${error}`, undefined)
      return
    }
    if (body.error) {
      callback(`Request failed: ${body.error}`, undefined)
      return
    }
  
    const data = body.current
    
    callback(undefined, `${data.weather_descriptions[0]}. It is currently ${data.temperature} degress out. It feels like ${data.feelslike} degress.`)
  })
}


module.exports = forecast
