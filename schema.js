import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString
} from 'graphql'

import {
  getUser,
  getUsers,
  createUser,
  getComments,
  getCommentsByAuthor,
  createComment,
  getAuthorByComment} from './database'

const commentType = new GraphQLObjectType({
  name: 'Comment',
  description: 'A comment made by a user',
  fields: () => ({
    author: {
      type: userType,
      description: 'The user that made the comment',
      resolve: ({_author}) => getAuthorByComment({_author})
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
    username: {
      type: GraphQLString,
      description: 'Unique identifier for user'
    },
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
          type: GraphQLInt
        }
      },
      resolve: (root, {limit}) => getUsers({limit})
    },
    user: {
      type: userType,
      args: {
        username: {
          name: 'username',
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (root, {username}) => getUser({username})
    },
    comments: {
      type: new GraphQLList(commentType),
      args: {
        limit: {
          name: 'limit',
          type: GraphQLInt
        }
      },
      resolve: (root, {limit}) => getComments({limit})
    }
  })
})

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createUser: {
      type: userType,
      args: {
        username: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Unique identifier for user'
        },
        firstName: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'First name of user'
        },
        lastName: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Last name of user'
        },
        email: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Email address of user'
        }
      },
      resolve: (root, args) => createUser(args)
    },
    createComment: {
      type: commentType,
      args: {
        username: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Author of comment'
        },
        text: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Comment text'
        }
      },
      resolve: (root, args) => createComment(args)
    }
  })
})

export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
})
