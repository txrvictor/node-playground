
const doSomethingCallback = (callback) => {
  setTimeout(() => {
    // callback('Failed', undefined)
    callback(undefined, {success: true})
  }, 3000)
}

doSomethingCallback((error, result) => {
  if (error) {
    console.log({error})
    return
  }
  console.log(result)
})
