import { useCallback, useEffect, useRef, useState } from "react"
import AuthForm from "./components/AuthForm"
import Dashboard from "./components/Dashboard"
import Header from "./components/Header"
import MovieForm from "./components/MovieForm"
import { createMovie, deleteMovieById, listMovies, updateMovie } from "./lib/movies"
import { isSupabaseConfigured, supabase } from "./lib/supabase"

export default function App() {
  const [session, setSession] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [movies, setMovies] = useState(null)
  const [error, setError] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMovie, setEditingMovie] = useState(null)
  const [saveError, setSaveError] = useState("")
  const [saving, setSaving] = useState(false)
  const userIdRef = useRef(null)

  const closeForm = useCallback(() => {
    setIsFormOpen(false)
    setEditingMovie(null)
    setSaveError("")
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      const nextUserId = nextSession?.user?.id ?? null
      if (userIdRef.current !== nextUserId) {
        userIdRef.current = nextUserId
        setMovies(null)
        setError("")
      }
      setSession(nextSession)
      setAuthReady(true)
    })

    return () => subscription.unsubscribe()
  }, [])

  const userId = session?.user?.id ?? null

  useEffect(() => {
    if (!userId) return undefined

    let active = true

    listMovies()
      .then((rows) => {
        if (active) setMovies(rows)
      })
      .catch((err) => {
        if (!active) return
        setMovies([])
        setError(err.message || "Could not load your movies.")
      })

    return () => {
      active = false
    }
  }, [userId])

  function openAddForm() {
    setSaveError("")
    setEditingMovie(null)
    setIsFormOpen(true)
  }

  function openEditForm(movie) {
    setSaveError("")
    setEditingMovie(movie)
    setIsFormOpen(true)
  }

  async function saveMovie(movieData) {
    setSaving(true)
    setSaveError("")

    try {
      if (editingMovie) {
        const updated = await updateMovie(editingMovie.id, movieData)
        setMovies((current) => (current ?? []).map((movie) => (movie.id === updated.id ? updated : movie)))
      } else {
        const created = await createMovie(movieData)
        setMovies((current) => [created, ...(current ?? [])])
      }
      closeForm()
    } catch (err) {
      setSaveError(err.message || "Could not save the movie.")
    } finally {
      setSaving(false)
    }
  }

  async function deleteMovie(id) {
    setError("")
    try {
      await deleteMovieById(id)
      setMovies((current) => (current ?? []).filter((movie) => movie.id !== id))
    } catch (err) {
      setError(err.message || "Could not delete the movie.")
    }
  }

  async function handleLogout() {
    setError("")
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) setError(signOutError.message)
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="app">
        <Header user={null} />
        <main className="dashboard">
          <div className="container">
            <div className="auth-card">
              <h2>Setup needed</h2>
              <p className="message" role="alert">
                Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local, then restart the dev server.
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <Header user={session?.user ?? null} onAddMovie={openAddForm} onLogout={handleLogout} />
      {!authReady ? (
        <main className="dashboard">
          <div className="container">
            <p className="loading-message">Checking your session...</p>
          </div>
        </main>
      ) : session ? (
        <Dashboard
          movies={movies ?? []}
          loading={movies === null && !error}
          error={error}
          onAddMovie={openAddForm}
          onEdit={openEditForm}
          onDelete={deleteMovie}
        />
      ) : (
        <AuthForm />
      )}
      {isFormOpen && session ? (
        <MovieForm
          movie={editingMovie}
          onSave={saveMovie}
          onClose={closeForm}
          saveError={saveError}
          saving={saving}
        />
      ) : null}
    </div>
  )
}
