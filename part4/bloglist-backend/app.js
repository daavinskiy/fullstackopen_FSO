
const express = require('express')
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

app.get('/', (request, response) => {
  response.send('<h1>Blog List</h1>')
})

app.get('/api/blogs', async (request, response) => {
  response.json(blogs)
})

app.post('/api/blogs', async (request, response) => {
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

module.exports = app
