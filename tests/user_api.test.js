const mongoose = require('mongoose');
const {
  describe,
  it,
  beforeEach,
  after,
} = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const helper = require('./test_helper');
const User = require('../models/user');

const api = supertest(app);

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  it('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  it('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    assert(result.body.error.includes('expected `username` to be unique'));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  it('creation fails when username missing', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: 'NoFace',
      password: 'goldenhands',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    assert(result.body.error.includes('username or password required'));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  it('creation fails when password missing', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'hungus',
      name: 'NoFace',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    assert(result.body.error.includes('username or password required'));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  it('creation fails when password too short', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'hungus',
      name: 'NoFace',
      password: 'no',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    assert(result.body.error.includes('password minimum length is 3 characters'));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
  it('creation fails when username too short', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'nf',
      name: 'NoFace',
      password: 'hungus',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    assert(result.body.error.includes('username minimum length is 3 characters'));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
