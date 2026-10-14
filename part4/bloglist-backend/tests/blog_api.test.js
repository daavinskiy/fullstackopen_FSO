
const { test, before, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
  },
  {
    title: 'Canonical String Reduction',
    author: 'Edsger W. Dijkstra',
    url: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD808.html',
    likes: 12,
  },
]

let token

before(async () => {
  await mongoose.connect(config.TEST_MONGODB_URI)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  await Blog.insertMany(initialBlogs)

  const userResponse = await api
    .post('/api/users')
    .send({
      username: 'testuser',
      name: 'Test User',
      password: 'secret123',
    })
    .expect(201)

  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'testuser',
      password: 'secret123',
    })
    .expect(200)

  token = loginResponse.body.token
})

after(async () => {
  await mongoose.connection.close()
})

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
    likes: 10,
  }

  const blogsAtStart = await api.get('/api/blogs')

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await api.get('/api/blogs')

  assert.strictEqual(
    blogsAtEnd.body.length,
    blogsAtStart.body.length + 1
  )
})

test('likes defaults to zero if missing', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Test Author',
    url: 'https://example.com/no-likes',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Test Author',
    url: 'https://example.com/no-title',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const blogsAfter = await api.get('/api/blogs')
  assert.strictEqual(blogsAfter.body.length, 2)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'Blog without URL',
    author: 'Test Author',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const blogsAfter = await api.get('/api/blogs')
  assert.strictEqual(blogsAfter.body.length, 2)
})

test('creating a blog without a token fails', async () => {
  await api
    .post('/api/blogs')
    .send({
      title: 'Unauthorized blog',
      url: 'https://example.com/unauthorized',
    })
    .expect(401)
})

test('creating a blog with an invalid token fails', async () => {
  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer invalidtoken')
    .send({
      title: 'Invalid token blog',
      url: 'https://example.com/invalid-token',
    })
    .expect(401)

  const blogs = await api.get('/api/blogs')
  assert.strictEqual(blogs.body.length, 2)
})



test('a blog can be deleted by its owner', async () => {
  const newBlog = {
    title: 'Blog to delete',
    author: 'Test Author',
    url: 'https://example.com/delete',
  }

  const createResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  await api
    .delete(`/api/blogs/${createResponse.body.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogs = await api.get('/api/blogs')
  const deletedBlog = blogs.body.find(
    blog => blog.id === createResponse.body.id
  )

  assert.strictEqual(deletedBlog, undefined)
})

test('deleting a blog without a token fails', async () => {
  const createResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Blog protected from unauthorized deletion',
      author: 'Test Author',
      url: 'https://example.com/protected',
    })
    .expect(201)

  await api
    .delete(`/api/blogs/${createResponse.body.id}`)
    .expect(401)

  const blogs = await api.get('/api/blogs')
  const blog = blogs.body.find(
    item => item.id === createResponse.body.id
  )

  assert.notStrictEqual(blog, undefined)
})


test('another user cannot delete a blog', async () => {
  const createResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Another test blog',
      author: 'Test Author',
      url: 'https://example.com/another-blog',
    })
    .expect(201)

  const anotherUserResponse = await api
    .post('/api/users')
    .send({
      username: 'anotheruser',
      name: 'Another User',
      password: 'password123',
    })
    .expect(201)

  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'anotheruser',
      password: 'password123',
    })
    .expect(200)

  await api
    .delete(`/api/blogs/${createResponse.body.id}`)
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
    .expect(403)

  const blogs = await api.get('/api/blogs')
  const blog = blogs.body.find(
    item => item.id === createResponse.body.id
  )

  assert.notStrictEqual(blog, undefined)
})


test('a blog can be updated', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToUpdate = blogsAtStart.body[0]

  const updatedBlog = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: blogToUpdate.likes + 1,
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)

  assert.strictEqual(response.body.likes, updatedBlog.likes)

  const blogsAtEnd = await api.get('/api/blogs')
  const blogAfterUpdate = blogsAtEnd.body.find(
    blog => blog.id === blogToUpdate.id
  )

  assert.strictEqual(blogAfterUpdate.likes, updatedBlog.likes)
})
