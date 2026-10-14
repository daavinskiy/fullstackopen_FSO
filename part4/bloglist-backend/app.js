
const express = require('express')
const bcrypt = require('bcryptjs')
const app = express()

app.use(express.json())

let blogs = [
  {
    id: '1',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5
  },
  {
    id: '2',
    title: 'Canonical String Reduction',
    author: 'Edsger W. Dijkstra',
    url: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  }
]

let users = []
let nextUserId = 1

app.get('/', (request, response) => {
  response.send('<h1>Blog List</h1>')
})

app.get('/api/blogs', async (request, response) => {
  response.json(blogs)
})

app.post('/api/blogs', async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).json({
      error: 'title or url is missing'
    })
  }

  const blog = {
    id: String(Math.max(0, ...blogs.map(blog => Number(blog.id))) + 1),
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes ?? 0
  }

  blogs = blogs.concat(blog)

  response.status(201).json(blog)
})

app.delete('/api/blogs/:id', async (request, response) => {
  const id = request.params.id

  blogs = blogs.filter(blog => blog.id !== id)

  response.status(204).end()
})

app.put('/api/blogs/:id', async (request, response) => {
  const id = request.params.id
  const updatedBlog = request.body

  blogs = blogs.map(blog => {
    if (blog.id === id) {
      return {
        ...blog,
        ...updatedBlog,
        id: blog.id
      }
    }

    return blog
  })

  const blog = blogs.find(blog => blog.id === id)

  if (!blog) {
    return response.status(404).json({
      error: 'blog not found'
    })
  }

  response.status(200).json(blog)
})

app.get('/api/users', (request, response) => {
  const usersWithoutPasswords = users.map(user => ({
    id: user.id,
    username: user.username,
    name: user.name
  }))

  response.json(usersWithoutPasswords)
})

app.post('/api/users', async (request, response) => {
  const { username, name, password } = request.body

  if (!username || !password) {
    return response.status(400).json({
      error: 'username and password are required'
    })
  }

  if (password.length < 3) {
    return response.status(400).json({
      error: 'password must contain at least 3 characters'
    })
  }

  if (users.some(user => user.username === username)) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = {
    id: String(nextUserId++),
    username,
    name,
    passwordHash
  }

  users = users.concat(user)

  response.status(201).json({
    id: user.id,
    username: user.username,
    name: user.name
  })
})

module.exports = app
