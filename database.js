import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  }
})

const getUsers = args => mongoose.model('User').find((error, users) => {
  error && console.warn('getUsers:', error)
  return users
})

const User = mongoose.model('User', UserSchema)

module.exports = {
  User,
  getUsers
}
