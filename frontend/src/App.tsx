import { useEffect, useState } from 'react'
import './App.css'

type HealthResponse = {
  status: string
}

const apiBase = import.meta.env.VITE_API_URL ?? ''

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${apiBase}/api/health`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Health check failed (${response.status})`)
        }
        return response.json() as Promise<HealthResponse>
      })
      .then((data) => setHealth(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="app">
      <h1>Todoist</h1>
      <p className="tagline">Phase 0 — scaffold hello</p>
      <section className="health-card" aria-live="polite">
        <h2>Backend health</h2>
        {loading && <p>Checking API…</p>}
        {!loading && health && (
          <p className="status ok">
            API status: <strong>{health.status}</strong>
          </p>
        )}
        {!loading && error && (
          <p className="status error">Could not reach backend: {error}</p>
        )}
      </section>
    </main>
  )
}

export default App
