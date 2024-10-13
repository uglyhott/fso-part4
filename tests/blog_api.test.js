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

describe('with initial Blogs already saved', () => {
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
});

describe('POST /api/blogs/', () => {
  it('saves a new blog', async () => {
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

  it('likes property defaults to 0 if missing', async () => {
    const blog = {
      title: 'likes default to 0',
      author: 'Pippin',
      url: 'lotr.world',
    };

    await api
      .post('/api/blogs/')
      .send(blog)
      .expect(201)
      .expect((res) => {
        res.body.likes = 0;
      });
  });

  it('responds correctly when title is missing', async () => {
    const blogMissingTitle = {
      author: 'Gandalf',
      url: 'greywizard.net',
    };

    await api
      .post('/api/blogs/')
      .send(blogMissingTitle)
      .expect(400);
  });

  it('responds correctly when url is missing', async () => {
    const blogMissingUrl = {
      title: 'url is missing',
      author: 'Gandalf',
    };

    await api
      .post('/api/blogs/')
      .send(blogMissingUrl)
      .expect(400);
  });
});

describe('DELETE /api/blogs/', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });

  it('deletes a single blog post', async () => {
    const blogsInDb = await helper.blogsInDb();

    await api
      .delete(`/api/blogs/${blogsInDb[0].id}`)
      .expect(204);
  });
});

describe('PUT /api/blogs/', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });

  it('updates a blog\'s likes', async () => {
    const blogs = await helper.blogsInDb();
    const {
      author,
      title,
      url,
      likes,
      id,
    } = blogs[0];

    const changedBlog = {
      id,
      author,
      title,
      url,
      likes: likes + 1,
    };

    const updatedBlog = await api
      .put(`/api/blogs/${id}`)
      .send(changedBlog);

    assert.deepStrictEqual(updatedBlog.body, changedBlog);
  });
});

after(async () => {
  await mongoose.connection.close();
});
