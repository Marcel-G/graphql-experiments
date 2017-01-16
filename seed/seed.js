import mongoose from 'mongoose'
import Faker from 'faker'
import _ from 'lodash'
import { User, Comment } from '../database'

mongoose.connect('mongodb://localhost/graphql')
const db = mongoose.connection

const randomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

const createFakeUsers = count => {
  let users = Array(count).fill().map(() => {
    return new User({
      username: Faker.internet.userName(),
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email: Faker.internet.email()
    })
  })

  return Promise.all(users.map(user => user.save())).then(() => {
    console.log(`${users.length} users added.`)
    return users
  })
}

const createFakeComments = users => {
  const generateComments = (user, count) => Array(count).fill().map(() => {
    return new Comment({
      _author: user.id,
      text: Faker.lorem.paragraph()
    })
  })
  let comments = _.flatMap(users, user => generateComments(user, randomInt(0, 10)))
  return Promise.all(comments.map(comment => comment.save()))
  .then(() => {
    console.log(`${comments.length} comments added.`)
    return comments
  })
}

const deleteTables = tables => {
  return Promise.all(tables.map((tableName, index, array) => {
    return db.collections[tableName].drop()
  }))
  .then(() => {
    tables.forEach(table => console.log(`${table} table dropped.`))
  })
}

console.log('Seeding database.')
deleteTables(['users', 'comments'])
.then(() => createFakeUsers(100))
.then(createFakeComments)
.then(() => {
  mongoose.connection.close()
})
