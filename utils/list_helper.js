const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((a, b) => a.likes < b.likes ? b : a, blogs[0])
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authors = []

  for (blog of blogs) {
    let in_Author = false
    for (author of authors) {
      if (blog.author === author.author) {
        in_Author = true
        author.count += 1
        break
      }
    }
    if (!in_Author) authors.push({ author: blog.author, count: 1 })
  }
  return authors.reduce((a, b) => a.count < b.count ? b : a)
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authors = []

  for (blog of blogs) {
    let in_Author = false
    for (author of authors) {
      if (blog.author === author.author) {
        in_Author = true
        author.likes += blog.likes
        break
      }
    }
    if (!in_Author) authors.push({ author: blog.author, likes: blog.likes })
  }
  return authors.reduce((a, b) => a.likes < b.likes ? b : a)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}