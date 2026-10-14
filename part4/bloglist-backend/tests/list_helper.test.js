
const { test } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)

  assert.strictEqual(result, 1)
})

test('total likes of multiple blogs', () => {
  const blogs = [
    {
      title: 'Blog 1',
      author: 'Author 1',
      url: 'https://example.com/1',
      likes: 5
    },
    {
      title: 'Blog 2',
      author: 'Author 2',
      url: 'https://example.com/2',
      likes: 7
    }
  ]

  const result = listHelper.totalLikes(blogs)

  assert.strictEqual(result, 12)
})

test('favorite blog has the most likes', () => {
  const blogs = [
    {
      title: 'Blog 1',
      author: 'Author 1',
      url: 'https://example.com/1',
      likes: 5
    },
    {
      title: 'Blog 2',
      author: 'Author 2',
      url: 'https://example.com/2',
      likes: 12
    },
    {
      title: 'Blog 3',
      author: 'Author 3',
      url: 'https://example.com/3',
      likes: 7
    }
  ]

  const result = listHelper.favoriteBlog(blogs)

  assert.deepStrictEqual(result, {
    title: 'Blog 2',
    author: 'Author 2',
    likes: 12
  })
})

test('most blogs', () => {
  const blogs = [
    {
      title: 'Blog 1',
      author: 'Author 1',
      url: 'https://example.com/1',
      likes: 5
    },
    {
      title: 'Blog 2',
      author: 'Author 2',
      url: 'https://example.com/2',
      likes: 7
    },
    {
      title: 'Blog 3',
      author: 'Author 1',
      url: 'https://example.com/3',
      likes: 3
    },
    {
      title: 'Blog 4',
      author: 'Author 1',
      url: 'https://example.com/4',
      likes: 8
    }
  ]

  const result = listHelper.mostBlogs(blogs)

  assert.deepStrictEqual(result, {
    author: 'Author 1',
    blogs: 3
  })
})

test('most likes', () => {
  const blogs = [
    {
      title: 'Blog 1',
      author: 'Author 1',
      url: 'https://example.com/1',
      likes: 5
    },
    {
      title: 'Blog 2',
      author: 'Author 2',
      url: 'https://example.com/2',
      likes: 7
    },
    {
      title: 'Blog 3',
      author: 'Author 1',
      url: 'https://example.com/3',
      likes: 3
    },
    {
      title: 'Blog 4',
      author: 'Author 2',
      url: 'https://example.com/4',
      likes: 8
    }
  ]

  const result = listHelper.mostLikes(blogs)

  assert.deepStrictEqual(result, {
    author: 'Author 2',
    likes: 15
  })
})
