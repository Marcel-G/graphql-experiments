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

const createFakeUsers = () => {
  var processedIndex = 0
  let users = 100
  var count = 0
  return new Promise((resolve, reject) => {
    _.times(users, index => {
      let user = new User({
        username: Faker.internet.userName(),
        firstName: Faker.name.firstName(),
        lastName: Faker.name.lastName(),
        email: Faker.internet.email()
      })
      user.save(error => {
        error && console.log(error)
        let commentCount = randomInt(0, 10)
        count += commentCount
        _.times(commentCount, index => {
          let comment = new Comment ({
            _author: user.id,
            text: Faker.lorem.paragraph()
          })
          comment.save(error => {
            error && console.log(error)
            processedIndex++
            if (processedIndex === count) {
              console.log(`${users} users added. ${count - users} comments added.`)
              resolve()
            }
          })
        })
      })
    })
  })
}

const deleteTables = tables => {
  return new Promise((resolve, reject) => {
    let processedIndex = 0
    tables.forEach((tableName, index, array) => {
      db.collections[tableName].drop(error => {
        console.log(error || `${tableName} table dropped.`)
        processedIndex++
        if (processedIndex === array.length) resolve()
      })
    })
  })
}

deleteTables(['users', 'comments'])
.then(createFakeUsers)
.then(() => {
  mongoose.connection.close()
})
