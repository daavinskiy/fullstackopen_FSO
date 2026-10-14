
const { test } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, 2)
})

test('blogs have an id property', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)

  response.body.forEach(blog => {
    assert.notStrictEqual(blog.id, undefined)
    assert.strictEqual(blog._id, undefined)
  })
})

test('a new blog can be added', async () => {
  const newBlog = {
    title: 'Testing with Supertest',
    author: 'Test Author',
    url: 'https://example.com/testing',
    likes: 10
  }

  const blogsAtStart = await api.get('/api/blogs')

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await api.get('/api/blogs')

  assert.strictEqual(
    blogsAtEnd.body.length,
    blogsAtStart.body.length + 1
  )
})
