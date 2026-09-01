const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

describe('initial blogs in database', () => {
  beforeEach(async() => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  describe('GET', () => {
    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    describe('ids', () =>{
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

  describe('POST', () => {
    test('a valid blog can be added', async() => {
      const newBlog = {
        author: 'test author',
        title: 'test blog',
        url: 'https://www.example.com',
        likes: 27,
      }

      await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const authors = blogsAtEnd.map(b => b.author)
      assert(authors.includes('test author'))
    })

    test('likes defaults to 0', async() => {
      const newBlog = {
        author: 'test author',
        title: 'test blog',
        url: 'https://www.example.com',
      }

      await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const createdBlog = blogsAtEnd.find(b => b.author === 'test author')
      assert.strictEqual(createdBlog.likes, 0)
    })

    describe('required fields', () => {
      test('title is required', async () => {
        const newBlog = {
          author: 'test author',
          url: 'https://www.example.com',
        }

        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
      })

      test('url is required', async () => {
        const newBlog = {
          author: 'test author',
          title: 'test title',
        }

        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
      })
    })
  })

  describe('DELETE', () => {
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

  describe('PUT', () => {
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
      const changedBlog = blogsAtEnd.find(b => b.id == blogToUpdate.id)

      assert(changedBlog && changedBlog.likes !== blogToUpdate.likes)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
