
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((mostLiked, blog) => {
    return blog.likes > mostLiked.likes ? blog : mostLiked
  })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  const blogsByAuthor = blogs.reduce((result, blog) => {
    if (!result[blog.author]) {
      result[blog.author] = 0
    }

    result[blog.author] += 1
    return result
  }, {})

  const favoriteAuthor = Object.entries(blogsByAuthor).reduce(
    (most, current) => {
      return current[1] > most[1] ? current : most
    }
  )

  return {
    author: favoriteAuthor[0],
    blogs: favoriteAuthor[1]
  }
}

const mostLikes = (blogs) => {
  const likesByAuthor = blogs.reduce((result, blog) => {
    if (!result[blog.author]) {
      result[blog.author] = 0
    }

    result[blog.author] += blog.likes
    return result
  }, {})

  const favoriteAuthor = Object.entries(likesByAuthor).reduce(
    (most, current) => {
      return current[1] > most[1] ? current : most
    }
  )

  return {
    author: favoriteAuthor[0],
    likes: favoriteAuthor[1]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
