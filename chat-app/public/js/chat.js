// elements
const $sidebar = document.querySelector('#sidebar')
const $messages = document.querySelector('#messages')
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $shareLocationButton = document.querySelector('#share-location')

// templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// options (Qs comes from the loaded CDN lib)
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

// 'io' is available because we loaded 'socket.io.js' previously
const socket = io()

socket.on('message', (message) => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    // moment is available because we imported the CDN script
    createdAt: moment(message.createdAt).format('h:mm a'),
  })
  $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (message) => {
  const html = Mustache.render(locationMessageTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format('h:mm a'),
  })
  $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('roomData', ({room, users}) => {
  const html = Mustache.render(sidebarTemplate, {room, users})
  $sidebar.innerHTML = html
})

$messageForm.addEventListener('submit', (evt) => {
  evt.preventDefault()

  // disable it until previous message is ack
  $messageFormButton.setAttribute('disabled', 'disabled')

  const message = evt.target.elements.message?.value

  socket.emit('sendMessage', message, (error) => {
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = '' // clean up
    $messageFormInput.focus()

    if (error) {
      return console.error(error)
    }

    console.log('Message delivered')
  })
})

$shareLocationButton.addEventListener('click', () => {
  // check if browser supports it
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser')
  }

  $shareLocationButton.setAttribute('disabled', 'disabled')

  navigator.geolocation.getCurrentPosition((position) => {
    const {latitude, longitude} = position.coords
    socket.emit('sendLocation',{latitude, longitude}, () => {
      // ack callback
      $shareLocationButton.removeAttribute('disabled')
      console.log('Location shared')
    })
  })
})

socket.emit('join', {username, room}, (error) => {
  // ack callback
  if (error) {
    alert(error)
    location.href = '/' // go back to home
  }
})
