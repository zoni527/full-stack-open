import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleDelete }) => {
  const [view, setView] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
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
            likes {blog.likes}<button onClick={() => handleLike(blog)}>like</button><br/>
            {blog.user && blog.user.name || 'no user assigned'}<br />
            {blog.user &&
              user &&
              user.username === blog.user.username &&
              <button onClick={() => handleDelete(blog)}>remove</button>}
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog
