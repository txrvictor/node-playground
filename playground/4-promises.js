
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

const add = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(a + b)
    }, 3000)
  })
}

// chaining
add(1, 1).then((sum) => {
  console.log(sum)
  return add(sum, 4)
}).then((sum2) => {
  console.log(sum2)
}).catch((err) => {
  console.log(err)
})
