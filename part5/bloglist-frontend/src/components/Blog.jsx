import { useState } from 'react'
import axios from 'axios'

const Blog = ({ blog }) => {
  const [view, setView] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const baseUrl = '/api/blogs'

  const updateBlog = async (blog) => {
    var updatedBlog = {
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    if (blog.user) {
      updatedBlog.user = blog.user.id
    }
    console.log(updatedBlog)
    const request = await axios.put(`${baseUrl}/${blog.id}`, updatedBlog)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}&nbsp;
        {!view && ( <button onClick={() => setView(true)}>view</button> )}
        { view && ( <button onClick={() => setView(false)}>hide</button> )}
        {view && (
          <div>
            {blog.url}<br/>
            likes {blog.likes}<button onClick={() => updateBlog(blog)}>like</button><br/>
            {blog.user && blog.user.name || 'no user assigned' }
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog
