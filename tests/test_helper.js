const Blog = require('../models/blog');
const User = require('../models/user');

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

const initialUser = {
  username: 'stacman',
  name: 'Liam',
  password: 'fullstacked',
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  initialUser,
  blogsInDb,
  usersInDb,
};
