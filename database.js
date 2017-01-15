import mongoose, { Schema } from 'mongoose'

/*
 * User Scema & Methods
 */
const UserSchema = new Schema({
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

const getUsers = args => User.find().limit(args.limit || 10)
const getCommentsByAuthor = user => Comment.find({_author: user._id})

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

const getComments = args => Comment.find().limit(args.limit || 10)
const getAuthorByComment = comment => User.find({_id: comment._author}).then(doc => doc[0])

module.exports = {
  User,
  getUsers,
  Comment,
  getComments,
  getCommentsByAuthor,
  getAuthorByComment
}
