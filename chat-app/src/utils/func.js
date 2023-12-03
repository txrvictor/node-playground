// defensive code for client socket callbacks behaving unexpectedly
const checkAndExec = (func, ...args) => {
  if (typeof func === 'function') {
    func(...args)
  }
}

module.exports = checkAndExec
