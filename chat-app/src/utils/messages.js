const generateMessage = (text) => ({
  text,
  createdAt: new Date().getTime(),
})

const generateLocationMessage = (location) => ({
  url: `https://google.com/maps?q=${location.latitude},${location.longitude}`,
  createdAt: new Date().getTime(),
})

module.exports = {
  generateMessage,
  generateLocationMessage,
}
