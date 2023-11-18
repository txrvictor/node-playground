const myEvent = {
  name: 'Party',
  guests: ["Mike", "Jen", "Sason"],
  printGuestList: function () {
    console.log('Guest list for ' + this.name)

    this.guests.forEach((guest) => {
      console.log(guest + ' is attending ' + this.name)
    })

    // Alternatively:
    // this.guests.forEach(function (guest) {
    //   console.log(guest + ' is attending ' + this.name)
    // }.bind(this))
  },
}

myEvent.printGuestList()
