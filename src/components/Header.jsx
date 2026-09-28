export default function Header({ onAddMovie }) {
  return (
    <header className="site-header">
      <nav className="container header-inner" aria-label="Main">
        <h1>Movie List</h1>
        <button type="button" className="button button-primary" onClick={onAddMovie}>
          Add Movie
        </button>
      </nav>
    </header>
  )
}
