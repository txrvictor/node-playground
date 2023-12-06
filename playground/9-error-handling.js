
process.on('uncaughtException', (error) => {
  console.log('Error:', {error})

  if (error instanceof RangeError) {
    return console.log('RangeError')
  }
  if (error instanceof ReferenceError) {
    return console.log('ReferenceError')
  }
  if (error instanceof SyntaxError) {
    return console.log('SyntaxError')
  }
  if (error instanceof TypeError) {
    return console.log('TypeError')
  }
  if (error instanceof EvalError) {
    return console.log('EvalError')
  }
  if (error instanceof URIError) {
    return console.log('URIError')
  }
  
  console.log('Unknown error')
 })

// -- Testings:

// eval("const 123") // syntax error
// throw new RangeError('The number is out of range') // range error (custom)
// let someVar = undefinedVar // reference error
// decodeURIComponent("%") // uri error
null.toString() // type error
