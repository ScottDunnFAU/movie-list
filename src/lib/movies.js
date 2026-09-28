import { supabase } from "./supabase"

const MOVIE_COLUMNS = "id, title, genre, release_year, status, rating, notes, created_at"

function toMovie(row) {
  return {
    id: row.id,
    title: row.title,
    genre: row.genre,
    releaseYear: row.release_year,
    status: row.status,
    rating: row.rating,
    notes: row.notes ?? "",
  }
}

function toRow(movie) {
  return {
    title: movie.title,
    genre: movie.genre,
    release_year: movie.releaseYear,
    status: movie.status,
    rating: movie.rating,
    notes: movie.notes,
  }
}

async function requireUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  if (!data.user) throw new Error("You must be logged in.")
  return data.user
}

export async function listMovies() {
  const user = await requireUser()
  const { data, error } = await supabase
    .from("movies")
    .select(MOVIE_COLUMNS)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data.map(toMovie)
}

export async function createMovie(movie) {
  const user = await requireUser()
  const { data, error } = await supabase
    .from("movies")
    .insert({ ...toRow(movie), user_id: user.id })
    .select(MOVIE_COLUMNS)
    .single()

  if (error) throw error
  return toMovie(data)
}

export async function updateMovie(id, movie) {
  const user = await requireUser()
  const { data, error } = await supabase
    .from("movies")
    .update(toRow(movie))
    .eq("id", id)
    .eq("user_id", user.id)
    .select(MOVIE_COLUMNS)
    .single()

  if (error) throw error
  return toMovie(data)
}

export async function deleteMovieById(id) {
  const user = await requireUser()
  const { error } = await supabase.from("movies").delete().eq("id", id).eq("user_id", user.id)

  if (error) throw error
}
