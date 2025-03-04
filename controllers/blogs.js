const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const middleware = require('../utils/middleware');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 });
  response.json(blogs);
});

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { body } = request;
  const user = await request.user;
  const newBlog = {
    user,
    ...body,
  };
  const blog = new Blog(newBlog);
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user;
  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() !== user?.id.toString()) {
    return response.status(401).json({ error: 'user not authorized' });
  }
  await Blog.findByIdAndDelete(request.params.id);
  return response.status(204).end();
});

blogRouter.put('/:id', async (request, response) => {
  const { author, url, likes } = request.body;
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { author, url, likes },
    { new: true, context: 'query' },
  );
  response.json(updatedBlog);
});

module.exports = blogRouter;
