import mongoose, { Schema } from 'mongoose'

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
  }
})

let User = mongoose.model('User', UserSchema)

const getUser = ({username}) => User.findOne({username})

const getUsers = ({limit}) => User.find().limit(limit || 10)

const getCommentsByAuthor = user => Comment.find({_author: user.id})

const createUser = ({username, firstName, lastName, email}) => {
  let newUser = new User({username, firstName, lastName, email})
  return newUser.save()
}

/*
 * Comment Scema & Methods
 */

const CommentSchema = new Schema({
  _author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  text: {
    type: String,
    required: true
  }
})

let Comment = mongoose.model('Comment', CommentSchema)

const getComments = ({limit}) => Comment.find().limit(limit || 10)

const getAuthorByComment = ({_author}) => User.findOne({_id: _author})

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
  User,
  getUser,
  getUsers,
  createUser,
  Comment,
  getComments,
  getCommentsByAuthor,
  createComment,
  getAuthorByComment
}
