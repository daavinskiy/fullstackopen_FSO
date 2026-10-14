
const { test, before, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const Blog = require('../models/blog')
const config = require('../utils/config')

const api = supertest(app)

let testUser

before(async () => {
  await mongoose.connect(config.TEST_MONGODB_URI)
})

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const userResponse = await api
    .post('/api/users')
    .send({
      username: 'testuser',
      name: 'Test User',
      password: 'secret123',
    })
    .expect(201)

  testUser = userResponse.body
})

after(async () => {
  await mongoose.connection.close()
})

test('a user can be created and listed', async () => {
  const listResponse = await api
    .get('/api/users')
    .expect(200)

  const user = listResponse.body.find(
    user => user.username === testUser.username
  )

  assert.notStrictEqual(user, undefined)
  assert.strictEqual(user.name, testUser.name)
  assert.strictEqual(user.password, undefined)
  assert.strictEqual(user.passwordHash, undefined)
})

test('user with too short username is not created', async () => {
  await api
    .post('/api/users')
    .send({
      username: 'ab',
      password: 'secret123',
    })
    .expect(400)

  const users = await User.find({})
  assert.strictEqual(users.length, 1)
})

test('user with too short password is not created', async () => {
  await api
    .post('/api/users')
    .send({
      username: 'anotheruser',
      password: 'ab',
    })
    .expect(400)

  const users = await User.find({})
  assert.strictEqual(users.length, 1)
})

test('user without username is not created', async () => {
  await api
    .post('/api/users')
    .send({
      password: 'secret123',
    })
    .expect(400)

  const users = await User.find({})
  assert.strictEqual(users.length, 1)
})

test('user without password is not created', async () => {
  await api
    .post('/api/users')
    .send({
      username: 'anotheruser',
    })
    .expect(400)

  const users = await User.find({})
  assert.strictEqual(users.length, 1)
})

test('user with duplicate username is not created', async () => {
  await api
    .post('/api/users')
    .send({
      username: 'testuser',
      password: 'secret123',
    })
    .expect(400)

  const users = await User.find({})
  assert.strictEqual(users.length, 1)
})


test('a blog can be associated with a user', async () => {
  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'testuser',
      password: 'secret123',
    })
    .expect(200)

  const token = loginResponse.body.token

  const newBlog = {
    title: 'A test blog',
    author: 'Blog Author',
    url: 'https://example.com/blog',
  }

  const blogResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  assert.strictEqual(blogResponse.body.user, testUser.id)

  const updatedUser = await User.findById(testUser.id)

  assert.strictEqual(updatedUser.blogs.length, 1)
  assert.strictEqual(
    updatedUser.blogs[0].toString(),
    blogResponse.body.id
  )
})


test('login succeeds with correct credentials', async () => {
  const response = await api
    .post('/api/login')
    .send({
      username: 'testuser',
      password: 'secret123',
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(typeof response.body.token, 'string')
  assert.strictEqual(response.body.username, 'testuser')
  assert.strictEqual(response.body.name, 'Test User')
})

test('login fails with incorrect password', async () => {
  await api
    .post('/api/login')
    .send({
      username: 'testuser',
      password: 'wrongpassword',
    })
    .expect(401)
})

test('login fails with unknown username', async () => {
  await api
    .post('/api/login')
    .send({
      username: 'unknownuser',
      password: 'secret123',
    })
    .expect(401)
})
