import express from 'express'
import bodyParser from 'body-parser'
const jwt = require('express-jwt')
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express'

const GRAPHQL_PORT = 3222

const logErrors = (err, req, res, next) => {
  console.error(err.stack)
  next(err)
}

const startGraphQLServer = callback => {
  const {Schema} = require('./schema')
  const graphQLApp = express()
  graphQLApp.use('/graphql',
    bodyParser.json(),
    jwt({secret: 'shhhhh'}),
    (error, request, response, next) => {
      if (error) {
        console.log(error.name, error.message)
      }
      next()
    },
    graphqlExpress(request => {
      return {
        graphiql: true,
        pretty: true,
        formatError: error => ({
          message: error.message
        }),
        context: {viewer: request.user && request.user._doc},
        schema: Schema
      }
    }))
  graphQLApp.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
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
