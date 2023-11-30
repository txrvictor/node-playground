const add = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (a < 0 || b < 0) {
        return reject('Numbers must have a positive')
      }

      resolve(a + b)
    }, 3000)
  })
}

const doSomething = async () => {
  const sum = await add(1, 2)
  const sum2 = await add(sum, 10)
  const sum3 = await add(sum2, 3)

  return sum3
}

// async in the function  will return a promise instead
// of the return value (e.g. Promise<number>)
console.log(doSomething())

doSomething().then((result) => {
  console.log({result})
}).catch(err => console.log(err))
