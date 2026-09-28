# Movie List

Movie List is a personal movie watchlist. After registering and logging in, a user can add movies, update them, and delete them. Each person only sees the movies saved to their own account.

## Features

- User registration with email and password
- Login and logout
- A personal movie watchlist that requires the user to be logged in
- Add movies
- View movies
- Edit movies
- Delete movies
- Movie status: Want to Watch, Watching, or Watched
- Optional rating from 1 to 5
- Notes on each movie
- User-specific database security through Supabase Row Level Security, so users can only access their own rows

## Technologies

- React
- Vite
- Supabase
- PostgreSQL, through the Supabase database
- Supabase Authentication
- Git and GitHub

## Getting Started

1. Clone the repository and open the project folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root. See [Environment Variables](#environment-variables).
4. Start the app:

   ```bash
   npm run dev
   ```

5. Open the local address printed in the terminal, usually `http://localhost:5173`.

If email confirmation is enabled in the Supabase project, confirm the account from the email before logging in.

## Environment Variables

The app reads Supabase settings from `.env.local` in the project root. This file is not committed. Create it with these names and fill in the values from the Supabase dashboard under Project Settings → API:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

`VITE_SUPABASE_URL` is the project URL, such as `https://your-project.supabase.co`. Do not include `/rest/v1`.

`VITE_SUPABASE_ANON_KEY` is the anon or publishable key. Do not put the service-role or secret key in this file.

Restart the dev server after changing `.env.local`.

## Database

Movies are stored in the `movies` table in the `public` schema.

| Field | Purpose |
| --- | --- |
| `id` | Unique id for the movie |
| `user_id` | The logged-in user who owns the movie |
| `title` | Movie title |
| `genre` | Genre chosen from the form |
| `release_year` | Release year |
| `status` | Want to Watch, Watching, or Watched |
| `rating` | Optional rating from 1 to 5 |
| `notes` | Optional notes |
| `created_at` | When the movie was added |

Row Level Security is enabled. Authenticated users can select, insert, update, and delete only movies whose `user_id` matches their account.

## Deployment

[Deployed App](https://melodic-griffin-dd213c.netlify.app/)

## Demo

[YouTube Demo (3:30)](https://www.youtube.com/watch?v=WIisdzm2-no)

## Project Structure

- `src/main.jsx` starts the React app.
- `src/App.jsx` handles the login session and loads the current user's movies.
- `src/components/AuthForm.jsx` is the registration and login form.
- `src/components/Header.jsx` shows whether the user is logged in, plus logout and Add Movie.
- `src/components/Dashboard.jsx` lists the watchlist and shows loading or error messages.
- `src/components/MovieCard.jsx` displays one movie, with Edit and Delete.
- `src/components/MovieForm.jsx` is the form for adding or editing a movie.
- `src/lib/supabase.js` creates the Supabase client from the environment variables.
- `src/lib/movies.js` lists, creates, updates, and deletes movies.
