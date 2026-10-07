const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const api = supertest(app)

describe('initial blogs and users in database', () => {
  beforeEach(async() => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await User.deleteMany({})

    const userData = helper.initialUsers
    for (var i = 0; i < userData.length; ++i) {
      const u = userData[i]
      const passwordHash = await bcrypt.hash(u.password, 10)
      const user = new User({ passwordHash, ...u })

      await user.save()
    }
  })

  describe('GET /api/users', () => {
    test('All users are returned', async () => {
      const response = await api.get('/api/users')

      assert(response.body.length === helper.initialUsers.length)
    })
  })

  describe('POST /api/users', () => {
    test('Username is required', async () => {
      const usersAtStart = await helper.usersInDb()

      const noUsername = {
        name: 'Testy McTester',
        password: 'sekret'
      }

      const response = await api
        .post('/api/users')
        .send(noUsername)
        .expect(400)
        .expect('Content-type', /application\/json/)

      assert(response.body.error.includes('user data missing'))

      const usersAtEnd = await helper.usersInDb()

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('Password is required', async () => {
      const usersAtStart = await helper.usersInDb()

      const noPassword = {
        username: 'testMc',
        name: 'Testy McTester',
      }

      const response = await api
        .post('/api/users')
        .send(noPassword)
        .expect(400)
        .expect('Content-type', /application\/json/)

      assert(response.body.error.includes('user data missing'))

      const usersAtEnd = await helper.usersInDb()

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('Too short username', async () => {
      const usersAtStart = await helper.usersInDb()

      const noPassword = {
        username: 'ab',
        name: 'Testy McTester',
        password: 'sekret'
      }

      const response = await api
        .post('/api/users')
        .send(noPassword)
        .expect(400)
        .expect('Content-type', /application\/json/)

      assert(response.body.error.includes('bad user data'))

      const usersAtEnd = await helper.usersInDb()

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('Too short password', async () => {
      const usersAtStart = await helper.usersInDb()

      const noPassword = {
        username: 'abc',
        name: 'Testy McTester',
        password: 'ab'
      }

      const response = await api
        .post('/api/users')
        .send(noPassword)
        .expect(400)
        .expect('Content-type', /application\/json/)

      assert(response.body.error.includes('bad user data'))

      const usersAtEnd = await helper.usersInDb()

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('Valid user is saved', async () => {
      const usersAtStart = await helper.usersInDb()

      const validUser = {
        username: 'abc',
        name: 'a',
        password: 'abc'
      }

      const response = await api
        .post('/api/users')
        .send(validUser)
        .expect(201)
        .expect('Content-type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()

      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
      assert.strictEqual(response.body.username, 'abc')
    })
  })

  describe('GET /api/blogs', () => {
    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    describe('ids', () => {
      test('returned blogs have id field', async () => {
        const response = await api.get('/api/blogs')

        assert(response.body[0].id)
      })

      test('returned blogs dont have _id field', async () => {
        const response = await api.get('/api/blogs')

        assert(response.body[0]._id === undefined)
      })
    })
  })

  describe('POST /api/blogs', () => {
    test('a valid blog can be added', async() => {
      const response = await api
        .post('/api/login')
        .send({
          username: helper.initialUsers[0].username,
          password: helper.initialUsers[0].password,
        })

      const token = response.body.token
      const decodedToken = jwt.verify(token, process.env.SECRET)

      const newBlog = {
        author: 'test author',
        title: 'test blog',
        url: 'https://www.example.com',
        likes: 27,
        userId: decodedToken.id,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const authors = blogsAtEnd.map(b => b.author)
      assert(authors.includes('test author'))
    })

    test('likes defaults to 0', async() => {
      const response = await api
        .post('/api/login')
        .send({
          username: helper.initialUsers[0].username,
          password: helper.initialUsers[0].password,
        })

      const token = response.body.token
      jwt.verify(token, process.env.SECRET)

      const newBlog = {
        author: 'test author',
        title: 'test blog',
        url: 'https://www.example.com',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const createdBlog = blogsAtEnd.find(b => b.author === 'test author')
      assert.strictEqual(createdBlog.likes, 0)
    })

    describe('required fields', () => {
      test('title is required', async () => {
        const response = await api
          .post('/api/login')
          .send({
            username: helper.initialUsers[0].username,
            password: helper.initialUsers[0].password,
          })

        const token = response.body.token
        jwt.verify(token, process.env.SECRET)

        const newBlog = {
          author: 'test author',
          url: 'https://www.example.com',
        }

        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)
          .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
      })

      test('url is required', async () => {
        const response = await api
          .post('/api/login')
          .send({
            username: helper.initialUsers[0].username,
            password: helper.initialUsers[0].password,
          })

        const token = response.body.token
        jwt.verify(token, process.env.SECRET)

        const newBlog = {
          author: 'test author',
          title: 'test title',
        }

        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)
          .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
      })
    })
  })

  describe('DELETE /api/blogs', () => {
    test('deleting a blog succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map(b => b.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

  describe('PUT /api/blogs', () => {
    test('updating a note works', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        author: blogToUpdate.author,
        title: blogToUpdate.title,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes + 1,
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const changedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)

      assert(changedBlog && changedBlog.likes !== blogToUpdate.likes)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
