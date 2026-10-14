const { test } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('a user can be created and listed', async () => {
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'secret123'
  }

  const createdUser = await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(createdUser.body.username, newUser.username)
  assert.strictEqual(createdUser.body.name, newUser.name)
  assert.strictEqual(createdUser.body.password, undefined)
  assert.strictEqual(createdUser.body.passwordHash, undefined)

  const response = await api
    .get('/api/users')
    .expect(200)

  const user = response.body.find(
    user => user.username === newUser.username
  )

  assert.ok(user)
  assert.strictEqual(user.name, newUser.name)
  assert.strictEqual(user.password, undefined)
  assert.strictEqual(user.passwordHash, undefined)
})
