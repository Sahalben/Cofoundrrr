import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import type { ProblemBoxRepository } from './repository'
import { defaultRepository } from './repository'

const ProblemBoxContext = createContext<ProblemBoxRepository>(defaultRepository)

export function ProblemBoxProvider({
  repository = defaultRepository,
  children,
}: {
  repository?: ProblemBoxRepository
  children: ReactNode
}) {
  return (
    <ProblemBoxContext.Provider value={repository}>
      {children}
    </ProblemBoxContext.Provider>
  )
}

export function useProblemBoxRepo(): ProblemBoxRepository {
  return useContext(ProblemBoxContext)
}

/** Reactive hook providing the latest Problem Box state. Re-renders on any store update. */
export function useProblemBoxState() {
  const repo = useProblemBoxRepo()
  return useSyncExternalStore(
    (cb) => repo.subscribe(cb),
    () => repo.getState(),
    () => repo.getState(),
  )
}
