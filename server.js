import express from 'express'
import bodyParser from 'body-parser'
const jwt = require('express-jwt')
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express'

const GRAPHQL_PORT = 3222

const startGraphQLServer = callback => {
  const {Schema} = require('./schema')
  const graphQLApp = express()
  graphQLApp.use('/graphql', bodyParser.json(), jwt({secret: 'shhhhh'}), graphqlExpress(request => {
    return {
      graphiql: true,
      pretty: true,
      context: {user: request.user._doc || false},
      schema: Schema
    }
  }))
  graphQLApp.use('/login', bodyParser.json(), graphqlExpress(request => {
    return {
      graphiql: true,
      pretty: true,
      context: {user: false},
      schema: Schema
    }
  }))
  graphQLApp.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send('invalid token...')
    }
  })
  graphQLApp.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
  }))
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
