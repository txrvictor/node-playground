const generateMessage = (username, text) => ({
  username,
  text,
  createdAt: new Date().getTime(),
})

const generateLocationMessage = (username, location) => ({
  username,
  url: `https://google.com/maps?q=${location.latitude},${location.longitude}`,
  createdAt: new Date().getTime(),
})

module.exports = {
  generateMessage,
  generateLocationMessage,
}
