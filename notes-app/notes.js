const fs = require('fs')
const chalk = require('chalk')

const NOTES_FILE = 'notes.json'

const addNote = (title, body) => {
  const notes = loadNotes()
  const duplicateNote = notes.find((n) => n.title === title)

  if (!duplicateNote) {
    notes.push({
      title,
      body,
    })
  
    saveNotes(notes)
    console.log(chalk.green.inverse('New note added'))
  } else {
    console.log(chalk.red.inverse('Note title duplicated'))
  }
}

const removeNote = (title) => {
  const notes = loadNotes()
  const notesToKeep = notes.filter((n) => n.title !== title)

  if (notes.length > notesToKeep.length) {
    saveNotes(notesToKeep)
    console.log(chalk.green.inverse('Note removed'))
  } else {
    console.log(chalk.red.inverse('No note found'))
  }
}

const listNotes = () => {
  console.log(chalk.inverse('Your notes'))
  
  const notes = loadNotes()
  notes.forEach((n) => {
    console.log(n.title)
  })
}

const readNote = (title) => {
  const notes = loadNotes()
  const foundNote = notes.find((n) => n.title === title)

  if (foundNote) {
    console.log(chalk.inverse(foundNote.title))
    console.log(foundNote.body)
  } else {
    console.log(chalk.red.inverse('Note not found'))
  }
}

const saveNotes = (notes) => {
  const dataJSON = JSON.stringify(notes)
  fs.writeFileSync(NOTES_FILE, dataJSON)
}

const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync(NOTES_FILE)
    const dataJSON = dataBuffer.toString()
    return JSON.parse(dataJSON)
  } catch (err) {
    return []
  }
}

module.exports = {
  addNote,
  removeNote,
  listNotes,
  readNote,
}
