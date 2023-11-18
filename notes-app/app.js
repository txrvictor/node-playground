const yargs = require('yargs')
const {addNote, removeNote, listNotes, readNote} = require('./notes.js')

// customize yargs version
yargs.version('1.1.0')

// add
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string',
    },
  },
  handler: (argv) => {
    addNote(argv.title, argv.body)
  }
})

// remove
yargs.command({
  command: 'remove',
  describe: 'Remove a note',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler: (argv) => {
    removeNote(argv.title)
  }
})

// list
yargs.command({
  command: 'list',
  describe: 'List notes',
  handler: () => {
    listNotes()
  }
})

// read
yargs.command({
  command: 'read',
  describe: 'Read a note',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler: (argv) => {
    readNote(argv.title)
  }
})

// read arguments passed
yargs.parse()
