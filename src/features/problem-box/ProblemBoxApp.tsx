import { useRoute, matchRoute } from '../../lib/router'
import { ProblemBoxProvider } from './data/context'
import { ProblemBoxHeader } from './components/ProblemBoxHeader'
import { IntegrityBanner } from './components/IntegrityBanner'
import { ProblemDirectoryView } from './views/ProblemDirectoryView'
import { ProblemDetailView } from './views/ProblemDetailView'
import { ProblemSubmitView } from './views/ProblemSubmitView'
import { ProblemModerationView } from './views/ProblemModerationView'

import { ErrorBoundary } from '../../components/ui'

export function ProblemBoxApp() {
  const currentPath = useRoute()

  let view = <ProblemDirectoryView />

  if (currentPath === '/problems/submit') {
    view = <ProblemSubmitView />
  } else if (currentPath === '/problems/moderation') {
    view = <ProblemModerationView />
  } else {
    const detailMatch = matchRoute('/problems/:id', currentPath)
    if (detailMatch?.id) {
      view = <ProblemDetailView problemId={detailMatch.id} />
    }
  }

  return (
    <ProblemBoxProvider>
      <div className="min-h-screen bg-mist text-ink">
        <ProblemBoxHeader />
        <IntegrityBanner />
        <ErrorBoundary fallbackTitle="Problem Box encountered an issue">
          <main>{view}</main>
        </ErrorBoundary>
      </div>
    </ProblemBoxProvider>
  )
}
