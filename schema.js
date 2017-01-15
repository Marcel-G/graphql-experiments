import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString
} from 'graphql'

import {
  getUsers,
  getComments,
  getCommentsByAuthor,
  getAuthorByComment} from './database'

const commentType = new GraphQLObjectType({
  name: 'Comment',
  description: 'A comment made by a user',
  fields: () => ({
    author: {
      type: userType,
      description: 'The user that made the comment',
      resolve: comment => getAuthorByComment(comment)
    },
    text: {
      type: GraphQLString,
      description: 'The content of te comment'
    }
  })
})

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    firstName: {
      type: GraphQLString,
      description: 'First name of user'
    },
    lastName: {
      type: GraphQLString,
      description: 'Last name of user'
    },
    email: {
      type: GraphQLString,
      description: 'Email address of user'
    },
    comments: {
      type: new GraphQLList(commentType),
      description: 'All comments made by this user',
      resolve: user => getCommentsByAuthor(user)
    }
  })
})

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    users: {
      type: new GraphQLList(userType),
      args: {
        limit: {
          name: 'limit',
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      resolve: (root, args) => getUsers(args)
    },
    comments: {
      type: new GraphQLList(commentType),
      args: {
        limit: {
          name: 'limit',
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      resolve: (root, args) => getComments(args)
    }
  })
})

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
  })
})

export var Schema = new GraphQLSchema({
  query: queryType
  // mutation: mutationType
})
