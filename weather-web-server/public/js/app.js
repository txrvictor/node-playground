console.log('client side javascript loaded')

const weatherForm = document.querySelector('form')
const searchInput = document.querySelector('input')

const addressLocation = document.querySelector('#address-location')
const weatherResponse = document.querySelector('#weather-response')

weatherForm.addEventListener('submit', (evt) => {
  evt.preventDefault()

  // reset display
  addressLocation.textContent = ''
  weatherResponse.textContent = 'Loading...'

  const address = searchInput.value?.trim()
  fetch(`http://localhost:3000/weather?address=${address}`)
    .then((response) => {
      return response.json()
        .then((data) => {
          if (data.error) {
            console.error(data.error)

            weatherResponse.textContent = data.error
          } else {
            console.log({data})

            addressLocation.textContent = data.location
            weatherResponse.textContent = data.forecast
          }
        })
    })
    .catch((err) => {
      console.error(err)
      weatherResponse.textContent = 'Request failed'
    })
})
