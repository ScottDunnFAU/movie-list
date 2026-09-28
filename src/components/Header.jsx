export default function Header({ user, onAddMovie, onLogout }) {
  return (
    <header className="site-header">
      <nav className="container header-inner" aria-label="Main">
        <h1>Movie List</h1>
        <div className="header-actions">
          {user ? (
            <>
              <p className="header-user">Logged in as {user.email}</p>
              <button type="button" className="button button-secondary" onClick={onLogout}>
                Log out
              </button>
              <button type="button" className="button button-primary" onClick={onAddMovie}>
                Add Movie
              </button>
            </>
          ) : (
            <p className="header-user">Not logged in</p>
          )}
        </div>
      </nav>
    </header>
  )
}
