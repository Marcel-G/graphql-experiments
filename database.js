import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'

mongoose.Promise = global.Promise

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/graphql')
}

const db = mongoose.connection

/*
 * User Scema & Methods
 */
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

UserSchema.pre('save', function (next) {
  let user = this
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return err
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err)
        user.password = hash
        next()
      })
    })
  } else {
    return next()
  }
})

UserSchema.methods.comparePassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (error, isMatch) => {
      error && reject(error)
      resolve(isMatch)
    })
  })
}

let User = mongoose.model('User', UserSchema)

const login = ({username, password}) => {
  const user = getUser({username})
  const passwordMatch = user.then(user => user.comparePassword(password))
  return Promise.all([user, passwordMatch])
  .then(response => {
   /**
    * Need Promise.all().spread es6 equivalent
    */
    return response[1] ? response[0] : null
  })
}

const getUser = ({_id, username}) => {
  let find = {_id, username}
  deleteUndefKeys(find)
  return User.findOne(find)
}

const getUsers = ({limit}) => User.find().limit(limit || 10)

const createUser = ({username, firstName, lastName, email}) => {
  let newUser = new User({username, firstName, lastName, email})
  return newUser.save()
}

/*
 * Threads Scema & Methods
 */

const ThreadSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  _author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

let Thread = mongoose.model('Thread', ThreadSchema)

const getThread = ({_id}) => Thread.findOne({_id})

const getThreads = ({limit, _author}) => {
  let find = {_author}
  deleteUndefKeys(find)
  return Thread.find(find).limit(limit || 10)
}

/*
 * Comment Scema & Methods
 */

const CommentSchema = new Schema({
  _author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  _thread: {
    type: Schema.Types.ObjectId,
    ref: 'Thread'
  },
  text: {
    type: String,
    required: true
  }
})

let Comment = mongoose.model('Comment', CommentSchema)

const getComments = ({limit, _author, _thread}) => {
  let find = {_author, _thread}
  deleteUndefKeys(find)
  return Comment.find(find).limit(limit || 10)
}

const createComment = ({username, text}) => {
  return getUser({username}).then(author => {
    let newComment = new Comment({_author: author._id, text})
    return newComment.save()
  })
}

/*
 * Helper functions
 */

const deleteUndefKeys = object => {
  Object.keys(object).map(key => {
    if (typeof object[key] === 'undefined') delete object[key]
  })
}

module.exports = {
  db,
  login,
  User,
  getUser,
  getUsers,
  createUser,
  Thread,
  getThread,
  getThreads,
  Comment,
  getComments,
  createComment
}
