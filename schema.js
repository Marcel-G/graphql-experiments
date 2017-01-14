import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql'

import { getUsers } from './database'

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
    }
  })
})

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    users: {
      type: new GraphQLList(userType),
      args: {
        id: {
          name: 'id',
          type: GraphQLInt
        },
        email: {
          type: GraphQLString
        }
      },
      resolve: (root, args) => getUsers()
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
