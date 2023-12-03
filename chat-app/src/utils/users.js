const users = []

const addUser = ({id, username, room}) => {
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  if (!username || !room) {
    return {
      error: 'Username and room are required',
    }
  }

  // check for duplicates
  const existingUser = users.find((user) => user.room && user.username === username)
  if (existingUser) {
    return {
      error: 'User already exists in this room',
    }
  }

  const user = {id, username, room}
  users.push(user)

  return {user}
}

const removeUser = (id) => {
  const index = users.findIndex((u) => u.id === id)
  if (index < 0) {
    return {
      error: 'User not found',
    }
  }

  // user found, return removed user
  return users.splice(index, 1)[0]
}

const getUser = (id) => users.find((u) => u.id === id)

const getUsersInRoom = (room) => users.find((u) => u.room === room.trim().toLowerCase())

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
}
