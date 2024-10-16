const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);

  try {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    if (error.name === 'ValidationError') {
      response.status(400).end();
    }
  }
});

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogRouter.put('/:id', async (request, response) => {
  const { author, url, likes } = request.body;
  try {

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { author, url, likes, },
      { new: true, context: 'query' },
    );
    response.json(updatedBlog);
  } catch {
    response.status(400).json({ error: 'malformatted id' });
  }
});

module.exports = blogRouter;
