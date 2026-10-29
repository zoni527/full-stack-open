import { useState } from 'react'

const Blog = ({ blog, handleLike }) => {
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
            {blog.user && blog.user.name || 'no user assigned' }
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog
