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