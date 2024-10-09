const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((acc, blog) => acc + blog.likes, 0);

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  const compareLikes = (a, b) => (a.likes < b.likes ? b : a);
  return blogs.reduce(compareLikes, blogs[0]);
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const authors = [];

  blogs.forEach((blog) => {
    const inAuthor = authors.find((author) => author.author === blog.author);
    if (inAuthor) {
      inAuthor.count += 1;
    } else {
      authors.push({ author: blog.author, count: 1 });
    }
  });
  return authors.reduce((a, b) => (a.count < b.count ? b : a));
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const authors = [];

  blogs.forEach((blog) => {
    const inAuthor = authors.find((author) => author.author === blog.author);
    if (inAuthor) {
      inAuthor.likes += blog.likes;
    } else {
      authors.push({ author: blog.author, likes: blog.likes });
    }
  });
  return authors.reduce((a, b) => (a.likes < b.likes ? b : a));
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
