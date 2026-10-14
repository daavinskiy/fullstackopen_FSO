
const express = require('express')
const bcrypt = require('bcryptjs')
const Blog = require('./models/blog')
const User = require('./models/user')
const app = express()

app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Blog List</h1>')
})

app.get('/api/blogs', async (request, response, next) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

app.post('/api/blogs', async (request, response, next) => {
  try {
    const { title, author, url, likes } = request.body

    if (!title || !url) {
      return response.status(400).json({
        error: 'title or url is missing',
      })
    }

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes ?? 0,
    })

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/blogs/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.put('/api/blogs/:id', async (request, response, next) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true,
      }
    )

    if (!updatedBlog) {
      return response.status(404).json({
        error: 'blog not found',
      })
    }

    response.status(200).json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

app.get('/api/users', async (request, response, next) => {
  try {
    const users = await User.find({})
    response.json(users)
  } catch (error) {
    next(error)
  }
})

app.post('/api/users', async (request, response, next) => {
  try {
    const { username, name, password } = request.body

    if (!username || !password) {
      return response.status(400).json({
        error: 'username and password are required',
      })
    }

    if (username.length < 3) {
      return response.status(400).json({
        error: 'username must contain at least 3 characters',
      })
    }

    if (password.length < 3) {
      return response.status(400).json({
        error: 'password must contain at least 3 characters',
      })
    }

    const existingUser = await User.findOne({ username })

    if (existingUser) {
      return response.status(400).json({
        error: 'username must be unique',
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

module.exports = app
