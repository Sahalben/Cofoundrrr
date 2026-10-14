import { Nav } from './components/layout/Nav'
import { Footer } from './components/layout/Footer'
import { Hero } from './sections/Hero'
import { Problem } from './sections/Problem'
import { Pathways } from './sections/Pathways'
import { Profiles } from './sections/Profiles'
import { Discovery } from './sections/Discovery'
import { Journey } from './sections/Journey'
import { Programs } from './sections/Programs'
import { ClosingCTA } from './sections/ClosingCTA'
import { useReveal } from './hooks/useReveal'
import { useRoute } from './lib/router'
import { ProblemBoxApp } from './features/problem-box/ProblemBoxApp'
import { ErrorBoundary } from './components/ui'

export default function App() {
  useReveal()
  const currentRoute = useRoute()

  if (currentRoute.startsWith('/problems')) {
    return <ProblemBoxApp />
  }

  return (
    <ErrorBoundary>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Pathways />
        <Profiles />
        <Discovery />
        <Journey />
        <Programs />
        <ClosingCTA />
      </main>
      <Footer />
    </ErrorBoundary>
  )
}
