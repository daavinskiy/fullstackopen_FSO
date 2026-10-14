
const { test, before, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const config = require('../utils/config')

const api = supertest(app)

before(async () => {
  await mongoose.connect(config.TEST_MONGODB_URI)
})

beforeEach(async () => {
  await User.deleteMany({})
})

after(async () => {
  await mongoose.connection.close()
})

test('a user can be created and listed', async () => {
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'secret123',
  }

  const createResponse = await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(createResponse.body.username, newUser.username)
  assert.strictEqual(createResponse.body.name, newUser.name)
  assert.strictEqual(createResponse.body.password, undefined)
  assert.strictEqual(createResponse.body.passwordHash, undefined)

  const listResponse = await api
    .get('/api/users')
    .expect(200)

  const user = listResponse.body.find(
    user => user.username === newUser.username
  )

  assert.notStrictEqual(user, undefined)
  assert.strictEqual(user.password, undefined)
  assert.strictEqual(user.passwordHash, undefined)
})

test('user with too short username is not created', async () => {
  const newUser = {
    username: 'ab',
    password: 'secret123',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const users = await User.find({})
  assert.strictEqual(users.length, 0)
})

test('user with too short password is not created', async () => {
  const newUser = {
    username: 'testuser',
    password: 'ab',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const users = await User.find({})
  assert.strictEqual(users.length, 0)
})

test('user without username is not created', async () => {
  const newUser = {
    password: 'secret123',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const users = await User.find({})
  assert.strictEqual(users.length, 0)
})

test('user without password is not created', async () => {
  const newUser = {
    username: 'testuser',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const users = await User.find({})
  assert.strictEqual(users.length, 0)
})

test('user with duplicate username is not created', async () => {
  const newUser = {
    username: 'testuser',
    password: 'secret123',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const users = await User.find({})
  assert.strictEqual(users.length, 1)
})
