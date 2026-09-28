import { useState } from "react"
import { supabase } from "../lib/supabase"

export default function AuthForm() {
  const [mode, setMode] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const isRegistering = mode === "register"

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setNotice("")
    setSubmitting(true)

    try {
      if (isRegistering) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        })
        if (signUpError) throw signUpError
        if (!data.session) {
          setNotice("Account created. Check your email to confirm it, then log in.")
          setMode("login")
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (signInError) throw signInError
      }
    } catch (err) {
      setError(err.message || "Authentication failed.")
    } finally {
      setSubmitting(false)
    }
  }

  function switchMode() {
    setMode(isRegistering ? "login" : "register")
    setError("")
    setNotice("")
  }

  return (
    <main className="dashboard">
      <div className="container">
        <div className="auth-card">
          <h2>{isRegistering ? "Create an account" : "Log in"}</h2>
          <p className="auth-intro">
            {isRegistering
              ? "Create an account to save your movie list."
              : "Log in to view and manage your movie list."}
          </p>
          <form onSubmit={handleSubmit}>
            {error ? (
              <p className="message" role="alert">
                {error}
              </p>
            ) : null}
            {notice ? <p className="message is-success">{notice}</p> : null}
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                autoFocus
              />
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={isRegistering ? "new-password" : "current-password"}
                minLength={6}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="button button-primary" disabled={submitting}>
                {submitting ? "Please wait..." : isRegistering ? "Register" : "Log in"}
              </button>
            </div>
          </form>
          <button type="button" className="text-button" onClick={switchMode}>
            {isRegistering ? "Already have an account? Log in" : "Need an account? Register"}
          </button>
        </div>
      </div>
    </main>
  )
}
