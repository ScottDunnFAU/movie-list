import { useCallback, useState } from "react"
import Dashboard from "./components/Dashboard"
import Header from "./components/Header"
import MovieForm from "./components/MovieForm"
import sampleMovies from "./data/sampleMovies"

function nextId(movies) {
  return movies.reduce((maxId, movie) => Math.max(maxId, movie.id), 0) + 1
}

export default function App() {
  const [movies, setMovies] = useState(sampleMovies)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMovie, setEditingMovie] = useState(null)

  const closeForm = useCallback(() => {
    setIsFormOpen(false)
    setEditingMovie(null)
  }, [])

  function openAddForm() {
    setEditingMovie(null)
    setIsFormOpen(true)
  }

  function openEditForm(movie) {
    setEditingMovie(movie)
    setIsFormOpen(true)
  }

  function saveMovie(movieData) {
    if (editingMovie) {
      setMovies((current) =>
        current.map((movie) =>
          movie.id === editingMovie.id ? { ...movieData, id: editingMovie.id } : movie,
        ),
      )
    } else {
      setMovies((current) => [...current, { ...movieData, id: nextId(current) }])
    }

    closeForm()
  }

  function deleteMovie(id) {
    setMovies((current) => current.filter((movie) => movie.id !== id))
  }

  return (
    <div className="app">
      <Header onAddMovie={openAddForm} />
      <Dashboard movies={movies} onAddMovie={openAddForm} onEdit={openEditForm} onDelete={deleteMovie} />
      {isFormOpen && <MovieForm movie={editingMovie} onSave={saveMovie} onClose={closeForm} />}
    </div>
  )
}
