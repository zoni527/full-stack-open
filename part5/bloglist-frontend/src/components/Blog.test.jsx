import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog.jsx'

describe('<Blog />', () => {
  const exampleBlog = {
    title: 'Example Title',
    url: 'example_url_123456790',
    author: 'Example Author',
    user: {
      username: 'example_username',
      name: 'Example User Name',
    },
    likes: 12345,
  }

  test('title is visible by default', () => {
    render(<Blog blog={exampleBlog} />)
    screen.getByText(/Example Title/)
  })

  test('view button renders url, likes and user', async () => {
    render(<Blog blog={exampleBlog} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    screen.getByText(/likes/)
    screen.getByText(/example_url_123456790/)
    screen.getByText(/Example User Name/)
  })

  test('clicking like button twice calls handler twice', async () => {
    const mockHandler = vi.fn()

    render(<Blog blog={exampleBlog} handleLike={mockHandler}/>)

    // Reveal like button
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    // Click like button twice
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
