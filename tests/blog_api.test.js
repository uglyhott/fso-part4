const mongoose = require('mongoose');
const {
  describe,
  it,
  beforeEach,
  after,
} = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

describe.only('with initial Blogs already saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });

  it('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  it('blog object uses id and not _id', async () => {
    const blogs = await helper.blogsInDb();
    const checkId = Object.keys(blogs[0]).includes('id');
    const checkUnderscoreId = Object.keys(blogs[0]).includes('_id');
    assert.strictEqual(checkId, true, 'id key not found');
    assert.strictEqual(checkUnderscoreId, false, '_id key found');
  });

  it.only('saves another blog', async () => {
    const blog = {
      title: 'test async blog POST',
      author: 'Bilbo',
      url: 'bilbobaggins.com',
    };

    await api
      .post('/api/blogs/')
      .send(blog)
      .expect(201);

    const blogsInDb = await helper.blogsInDb();
    const blogTitles = blogsInDb.map((blogs) => blogs.title.toString());

    assert.strictEqual(blogsInDb.length, helper.initialBlogs.length + 1);
    assert(blogTitles.includes('test async blog POST'));
  });
});

after(async () => {
  await mongoose.connection.close();
});
