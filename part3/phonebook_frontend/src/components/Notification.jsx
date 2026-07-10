const Notification = ({ message, isError }) => {
  if (message === null)
    return null

  const notificationStyle = {
    color: 'green',
    background: '#ddd',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  const errorStyle = {
    color: 'red',
    background: '#ddd',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  const style = isError ? errorStyle : notificationStyle

  return (
    <div style={style} className="error">
      {message}
    </div>
  )
}

export default Notification
