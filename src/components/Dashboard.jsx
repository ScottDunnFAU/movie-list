import MovieCard from "./MovieCard"

export default function Dashboard({ movies, onAddMovie, onEdit, onDelete }) {
  const countLabel =
    movies.length === 0
      ? "Nothing saved yet"
      : movies.length === 1
        ? "1 movie on your watchlist"
        : `${movies.length} movies on your watchlist`

  return (
    <main className="dashboard">
      <div className="container">
        <div className="dashboard-heading">
          <h2>Your movies</h2>
          <p>{countLabel}</p>
        </div>

        {movies.length === 0 ? (
          <div className="empty-state">
            <h3>Your watchlist is empty</h3>
            <p>Add a movie to start keeping track of what you want to see.</p>
            <button type="button" className="button button-primary" onClick={onAddMovie}>
              Add Movie
            </button>
          </div>
        ) : (
          <ul className="movie-grid">
            {movies.map((movie) => (
              <li key={movie.id}>
                <MovieCard movie={movie} onEdit={onEdit} onDelete={onDelete} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
