import mongoose from 'mongoose'
import Faker from 'faker'
import _ from 'lodash'
import { User } from '../database'

mongoose.connect('mongodb://localhost/graphql')

mongoose.connection.collections['users'].drop(error => {
  error && console.warn(error)
  User.create(users(), (error, res) => {
    console.log(res)
    console.log(error || 'Seed data created.')
    process.exit()
  })
})

const users = () => {
  let newUsers = []
  _.times(10, ()=> {
    newUsers.push({
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email: Faker.internet.email()
    })
  })
  return newUsers
}
