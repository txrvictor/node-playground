
const doSomethingPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    // reject('Failed')
    resolve({success: true})
  }, 3000)
})

doSomethingPromise.then((result) => {
  console.log('Success: ', result)
}).catch((error) => {
  console.log('Error: ', error)
})
