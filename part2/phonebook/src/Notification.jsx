const Notification = ({ message, error }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={error ? 'notification error' : 'notification'}>
      {message}
    </div>
  )
}

export default Notification