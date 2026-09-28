import { useEffect, useState } from "react"
const MOVIE_STATUSES = ["Want to Watch", "Watching", "Watched"]

const CURRENT_YEAR = new Date().getFullYear()

const MOVIE_GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Thriller",
  "Other",
]

function createFormState(movie) {
  if (!movie) {
    return {
      title: "",
      genre: "",
      releaseYear: "",
      status: "Want to Watch",
      rating: "",
      notes: "",
    }
  }

  return {
    title: movie.title,
    genre: movie.genre,
    releaseYear: String(movie.releaseYear),
    status: movie.status,
    rating: movie.rating ? String(movie.rating) : "",
    notes: movie.notes,
  }
}

export default function MovieForm({ movie, onSave, onClose, saveError, saving }) {
  const [form, setForm] = useState(() => createFormState(movie))
  const isEditing = Boolean(movie)

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSave({
      title: form.title.trim(),
      genre: form.genre,
      releaseYear: Number(form.releaseYear),
      status: form.status,
      rating: form.rating ? Number(form.rating) : null,
      notes: form.notes.trim(),
    })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-form-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="movie-form-title">{isEditing ? "Edit movie" : "Add movie"}</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-field">
            <label htmlFor="title">Movie title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Inception"
              maxLength={120}
              required
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="genre">Genre</label>
              <select id="genre" name="genre" value={form.genre} onChange={handleChange} required>
                <option value="">Select a genre</option>
                {MOVIE_GENRES.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="releaseYear">Release year</label>
              <input
                id="releaseYear"
                name="releaseYear"
                type="number"
                value={form.releaseYear}
                onChange={handleChange}
                min="1900"
                max={CURRENT_YEAR}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={form.status} onChange={handleChange} required>
              {MOVIE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <fieldset className="form-field">
            <legend>Rating</legend>
            <div className="rating-options">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="rating"
                    value={value}
                    checked={form.rating === String(value)}
                    onChange={handleChange}
                  />
                  <span>{value}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="form-field">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Anything you want to remember"
              maxLength={500}
              rows={4}
            />
          </div>

          {saveError ? (
            <p className="message" role="alert">
              {saveError}
            </p>
          ) : null}

          <div className="form-actions">
            <button type="button" className="button button-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="button button-primary" disabled={saving}>
              {saving ? "Saving..." : isEditing ? "Save changes" : "Add movie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
