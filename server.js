import express from 'express'
import bodyParser from 'body-parser'
const jwt = require('express-jwt')
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express'

const GRAPHQL_PORT = 3222

const logErrors = (err, req, res, next) => {
  console.error(err.stack)
  next(err)
}

const graphqlOptions = () => {
  return graphqlExpress(request => {
    return {
      graphiql: true,
      pretty: true,
      context: {user: request.user._doc || false},
      schema: Schema
    }
  })
}

const startGraphQLServer = callback => {
  const {Schema} = require('./schema')
  const graphQLApp = express()
  graphQLApp.use('/graphql',
    bodyParser.json(),
    jwt({secret: 'shhhhh', credentialsRequired: false}),
    (err, req, res, next) => {
      if (err) {
        console.log(err.name, err.message)
      }
      next()
    },
    graphqlExpress(request => {
      return {
        graphiql: true,
        pretty: true,
        formatError: error => ({
          message: error.message,
          locations: error.locations,
          stack: error.stack
        }),
        context: {user: request.user._doc || false},
        schema: Schema
      }
    }))
  graphQLApp.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
  }))
  graphQLApp.use('/login', bodyParser.json(), graphqlExpress(request => {
    return {
      graphiql: true,
      pretty: true,
      context: {user: false},
      schema: Schema
    }
  }))
  graphQLApp.use(logErrors)
  graphQLApp.listen(GRAPHQL_PORT, () => {
    console.log(
      `GraphQL server is now running on http://localhost:${GRAPHQL_PORT}`
    )
    if (callback) {
      callback()
    }
  })
}

startGraphQLServer()
