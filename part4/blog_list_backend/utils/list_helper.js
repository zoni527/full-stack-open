const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, b) => total + b.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0)
    return

  const reducer = (a, b) => {
    return b.likes > a.likes
      ? b
      : a
  }
  return blogs.reduce(reducer)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
