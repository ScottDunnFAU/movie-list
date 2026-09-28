const STATUS_CLASS = {
  "Want to Watch": "status-want",
  Watching: "status-watching",
  Watched: "status-watched",
}

export default function MovieCard({ movie, onEdit, onDelete }) {
  const filledStars = movie.rating ? "★".repeat(movie.rating) : ""
  const emptyStars = movie.rating ? "☆".repeat(5 - movie.rating) : ""

  return (
    <article className="movie-card">
      <div className="movie-card-top">
        <h3>{movie.title}</h3>
        <span className={`status ${STATUS_CLASS[movie.status] ?? ""}`}>{movie.status}</span>
      </div>
      <p className="movie-meta">
        <span>{movie.genre}</span>
        <span aria-hidden="true">·</span>
        <span>{movie.releaseYear}</span>
      </p>
      {movie.rating ? (
        <p className="movie-rating" aria-label={`Rated ${movie.rating} out of 5`}>
          <span aria-hidden="true">
            {filledStars}
            {emptyStars}
          </span>
          <span className="rating-number">{movie.rating}/5</span>
        </p>
      ) : (
        <p className="movie-notes is-empty">No rating</p>
      )}
      {movie.notes ? <p className="movie-notes">{movie.notes}</p> : <p className="movie-notes is-empty">No notes</p>}
      <div className="card-actions">
        <button type="button" className="button button-secondary" onClick={() => onEdit(movie)}>
          Edit
        </button>
        <button type="button" className="button button-danger" onClick={() => onDelete(movie.id)}>
          Delete
        </button>
      </div>
    </article>
  )
}
