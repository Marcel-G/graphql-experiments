import Faker from 'faker'
import _ from 'lodash'
import { db, User, Thread, Comment } from '../database'

let fakeUsers, fakeComments, fakeThreads

const randomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

const createFakeUsers = count => {
  fakeUsers = Array(count).fill().map(() => {
    return new User({
      username: Faker.internet.userName(),
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email: Faker.internet.email()
    })
  })

  return Promise.all(fakeUsers.map(user => user.save())).then(() => {
    console.log(`${fakeUsers.length} users added.`)
    return fakeUsers
  })
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
  })
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
deleteTables(['users', 'comments', 'threads'])
.then(() => createFakeUsers(100))
.then(() => createFakeThreads(10))
.then(() => createFakeComments(fakeUsers))
.then(() => {
  db.close()
})
