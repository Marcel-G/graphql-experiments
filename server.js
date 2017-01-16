import express from 'express'
import graphQLHTTP from 'express-graphql'

const GRAPHQL_PORT = 3222

let graphQLServer

const startGraphQLServer = callback => {
  const {Schema} = require('./schema')
  const graphQLApp = express()
  graphQLApp.use('/', graphQLHTTP({
    graphiql: true,
    pretty: true,
    schema: Schema
  }))
  graphQLServer = graphQLApp.listen(GRAPHQL_PORT, () => {
    console.log(
      `GraphQL server is now running on http://localhost:${GRAPHQL_PORT}`
    )
    if (callback) {
      callback()
    }
  })
}

startGraphQLServer()
