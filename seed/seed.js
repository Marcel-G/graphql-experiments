import Faker from 'faker'
import _ from 'lodash'
import { db, User, Thread, Comment } from '../database'

let fakeUsers, fakeComments, fakeThreads

const randomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

const errorHandler = error => {
  if (typeof error === 'string') {
    console.error(error)
  } else {
    console.error(error.name + ': ' + error.message)
  }
  if (error.errors) {
    Object.keys(error.errors).forEach(key => {
      let e = error.errors[key]
      console.error(e.name + ': ' + e.message)
    })
  }
}

const createFakeUsers = count => {
  fakeUsers = Array(count).fill().map(() => {
    return new User({
      username: Faker.internet.userName(),
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email: Faker.internet.email(),
      password: 'pa$$word'
    })
  })

  return Promise.all(fakeUsers.map(user => user.save()))
  .then(() => {
    console.log(`${fakeUsers.length} users added.`)
    return fakeUsers
  }, errorHandler)
}

const createFakeThreads = count => {
  fakeThreads = Array(count).fill().map(() => {
    return new Thread({
      title: Faker.lorem.words(randomInt(3, 7)),
      description: Faker.lorem.paragraph(),
      _author: fakeUsers[randomInt(0, fakeUsers.length)].id
    })
  })
  return Promise.all(fakeThreads.map(thread => thread.save())).then(() => {
    console.log(`${fakeThreads.length} threads added.`)
    return fakeThreads
  }, errorHandler)
}

const createFakeComments = users => {
  const generateComments = (user, count) => Array(count).fill().map(() => {
    return new Comment({
      _author: user.id,
      _thread: fakeThreads[randomInt(0, fakeThreads.length)].id,
      text: Faker.lorem.paragraph()
    })
  })
  fakeComments = _.flatMap(users, user => generateComments(user, randomInt(0, 10)))
  return Promise.all(fakeComments.map(comment => comment.save()))
  .then(() => {
    console.log(`${fakeComments.length} comments added.`)
    return fakeComments
  }, errorHandler)
}

const deleteTables = tables => {
  return Promise.all(tables.map((tableName, index, array) => {
    if (!db.collections[tableName]) return Promise.reject(`'${tableName}' table does not exist.`)
    return db.collections[tableName].drop(error => {
      if (error) Promise.reject(error)
      else console.log(`${tableName} table dropped.`)
    })
  })).catch(errorHandler)
}

console.log('Seeding database.')
deleteTables(['users', 'comments', 'threads'])
.then(() => createFakeUsers(100))
.then(() => createFakeThreads(10))
.then(() => createFakeComments(fakeUsers))
.then(() => {
  db.close()
})
