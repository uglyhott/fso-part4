const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'Hello, world!',
    author: 'Meriadoc',
    url: 'medium.com',
    likes: 1,
  },
  {
    title: 'Hello, again!',
    author: 'Jolkien Rolkien Rolkien Tolkien',
    url: 'jrrtolkien.com',
    likes: 100,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
};
