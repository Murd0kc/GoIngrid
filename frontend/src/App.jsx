import React from 'react'
import { AuthScreen } from './features/auth/AuthScreen'
import { useSession } from './features/auth/useSession'
import { CurriculumBrowser } from './features/curriculum/CurriculumBrowser'

export function App() {
  const { session, loading } = useSession()

  if (loading) {
    return (
      <main className="centered-state">
        <div className="brand-orb">G</div>
        <p>Preparando tu ruta de aprendizaje...</p>
      </main>
    )
  }

  if (!session) {
    return <AuthScreen />
  }

  return <CurriculumBrowser session={session} />
}
