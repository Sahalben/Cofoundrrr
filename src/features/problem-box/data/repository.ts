import type {
  ProblemBoxState,
  Problem,
  Submitter,
  Validation,
  Comment,
  Report,
  BuildInterest,
  ValidationKind,
  Severity,
  ProblemStatus,
  ReportReason,
} from '../domain/types'
import { SEED_STATE } from './seed'
import { upsertValidation, removeValidation } from '../domain/validation'
import { cleanText, LIMITS } from '../domain/sanitize'

export interface ProblemBoxRepository {
  getState(): ProblemBoxState
  getProblems(): Problem[]
  getProblemById(id: string): Problem | undefined
  getSubmitterById(id: string): Submitter | undefined
  getValidations(problemId: string): Validation[]
  getUserValidation(problemId: string, userId: string): Validation | undefined
  getComments(problemId: string): Comment[]
  getReports(): Report[]
  getBuildInterest(problemId: string): BuildInterest[]
  hasBuildInterest(problemId: string, userId: string): boolean

  // Actions
  submitProblem(
    data: Omit<Problem, 'id' | 'ref' | 'createdAt' | 'updatedAt' | 'status' | 'duplicateOfId' | 'moderationNote'>,
    authorName?: string,
  ): Problem

  saveValidation(params: {
    problemId: string
    userId: string
    kind: ValidationKind
    severity?: Severity | null
    note?: string
  }): Validation[]

  deleteValidation(problemId: string, userId: string): Validation[]

  addComment(params: { problemId: string; authorId: string; body: string }): Comment

  addReport(params: {
    targetType: 'problem' | 'comment'
    targetId: string
    problemId: string
    reporterId: string
    reason: ReportReason
    details: string
  }): Report

  toggleBuildInterest(problemId: string, userId: string): boolean

  // Moderator actions
  setProblemStatus(problemId: string, status: ProblemStatus, note?: string): void
  markDuplicate(problemId: string, duplicateOfId: string, note?: string): void
  resolveReport(reportId: string, resolutionNote: string, status?: 'resolved' | 'dismissed'): void

  resetToSeed(): void
  subscribe(listener: () => void): () => void
}

const STORAGE_KEY = 'cofoundrrr.problembox.state.v1'

export class LocalStorageProblemBoxRepository implements ProblemBoxRepository {
  private state: ProblemBoxState
  private listeners = new Set<() => void>()

  constructor() {
    this.state = this.load()
  }

  private load(): ProblemBoxState {
    if (typeof window === 'undefined') return SEED_STATE
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        this.persist(SEED_STATE)
        return SEED_STATE
      }
      const parsed = JSON.parse(raw) as ProblemBoxState
      if (!parsed || parsed.version !== SEED_STATE.version || !Array.isArray(parsed.problems)) {
        this.persist(SEED_STATE)
        return SEED_STATE
      }
      return parsed
    } catch {
      return SEED_STATE
    }
  }

  private persist(nextState: ProblemBoxState) {
    this.state = nextState
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
      } catch {
        /* storage exceeded or blocked */
      }
    }
    this.emit()
  }

  private emit() {
    this.listeners.forEach((l) => l())
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getState(): ProblemBoxState {
    return this.state
  }

  getProblems(): Problem[] {
    return this.state.problems
  }

  getProblemById(id: string): Problem | undefined {
    return this.state.problems.find((p) => p.id === id || p.ref.toLowerCase() === id.toLowerCase())
  }

  getSubmitterById(id: string): Submitter | undefined {
    return this.state.submitters.find((s) => s.id === id)
  }

  getValidations(problemId: string): Validation[] {
    return this.state.validations.filter((v) => v.problemId === problemId)
  }

  getUserValidation(problemId: string, userId: string): Validation | undefined {
    return this.state.validations.find((v) => v.problemId === problemId && v.userId === userId)
  }

  getComments(problemId: string): Comment[] {
    return this.state.comments.filter((c) => c.problemId === problemId && c.status === 'visible')
  }

  getReports(): Report[] {
    return this.state.reports
  }

  getBuildInterest(problemId: string): BuildInterest[] {
    return this.state.buildInterest.filter((b) => b.problemId === problemId)
  }

  hasBuildInterest(problemId: string, userId: string): boolean {
    return this.state.buildInterest.some((b) => b.problemId === problemId && b.userId === userId)
  }

  submitProblem(
    data: Omit<Problem, 'id' | 'ref' | 'createdAt' | 'updatedAt' | 'status' | 'duplicateOfId' | 'moderationNote'>,
    authorName?: string,
  ): Problem {
    const nextNum = this.state.problems.length + 1
    const ref = `PB-${String(nextNum).padStart(4, '0')}`
    const id = `pb-${String(nextNum).padStart(4, '0')}`
    const now = new Date().toISOString()

    let submitterId = data.submitterId
    let submitters = this.state.submitters

    if (!this.getSubmitterById(submitterId) && authorName) {
      const newSubmitter: Submitter = {
        id: submitterId,
        displayName: cleanText(authorName, 100),
        kind: 'individual',
        verified: false,
      }
      submitters = [...submitters, newSubmitter]
    }

    const newProblem: Problem = {
      ...data,
      id,
      ref,
      createdAt: now,
      updatedAt: now,
      status: 'published',
      duplicateOfId: null,
      moderationNote: '',
    }

    this.persist({
      ...this.state,
      submitters,
      problems: [newProblem, ...this.state.problems],
    })

    return newProblem
  }

  saveValidation(params: {
    problemId: string
    userId: string
    kind: ValidationKind
    severity?: Severity | null
    note?: string
  }): Validation[] {
    const nextValidations = upsertValidation(this.state.validations, params)
    this.persist({
      ...this.state,
      validations: nextValidations,
    })
    return nextValidations.filter((v) => v.problemId === params.problemId)
  }

  deleteValidation(problemId: string, userId: string): Validation[] {
    const nextValidations = removeValidation(this.state.validations, problemId, userId)
    this.persist({
      ...this.state,
      validations: nextValidations,
    })
    return nextValidations.filter((v) => v.problemId === problemId)
  }

  addComment(params: { problemId: string; authorId: string; body: string }): Comment {
    const cleanedBody = cleanText(params.body, LIMITS.comment.max, { multiline: true })
    const newComment: Comment = {
      id: `comm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      problemId: params.problemId,
      authorId: params.authorId,
      body: cleanedBody,
      createdAt: new Date().toISOString(),
      status: 'visible',
    }

    this.persist({
      ...this.state,
      comments: [...this.state.comments, newComment],
    })

    return newComment
  }

  addReport(params: {
    targetType: 'problem' | 'comment'
    targetId: string
    problemId: string
    reporterId: string
    reason: ReportReason
    details: string
  }): Report {
    const newReport: Report = {
      id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      targetType: params.targetType,
      targetId: params.targetId,
      problemId: params.problemId,
      reporterId: params.reporterId,
      reason: params.reason,
      details: cleanText(params.details, LIMITS.reportDetails.max, { multiline: true }),
      createdAt: new Date().toISOString(),
      status: 'open',
      resolutionNote: '',
    }

    this.persist({
      ...this.state,
      reports: [newReport, ...this.state.reports],
    })

    return newReport
  }

  toggleBuildInterest(problemId: string, userId: string): boolean {
    const exists = this.hasBuildInterest(problemId, userId)
    let nextInterest: BuildInterest[]
    if (exists) {
      nextInterest = this.state.buildInterest.filter((b) => !(b.problemId === problemId && b.userId === userId))
    } else {
      nextInterest = [
        ...this.state.buildInterest,
        { problemId, userId, createdAt: new Date().toISOString() },
      ]
    }
    this.persist({
      ...this.state,
      buildInterest: nextInterest,
    })
    return !exists
  }

  setProblemStatus(problemId: string, status: ProblemStatus, note = ''): void {
    const problems = this.state.problems.map((p) =>
      p.id === problemId
        ? {
            ...p,
            status,
            moderationNote: note ? cleanText(note, LIMITS.moderationNote.max) : p.moderationNote,
            updatedAt: new Date().toISOString(),
          }
        : p,
    )
    this.persist({ ...this.state, problems })
  }

  markDuplicate(problemId: string, duplicateOfId: string, note = ''): void {
    const problems = this.state.problems.map((p) =>
      p.id === problemId
        ? {
            ...p,
            status: 'duplicate' as const,
            duplicateOfId,
            moderationNote: note ? cleanText(note, LIMITS.moderationNote.max) : `Marked as duplicate of ${duplicateOfId}`,
            updatedAt: new Date().toISOString(),
          }
        : p,
    )
    this.persist({ ...this.state, problems })
  }

  resolveReport(reportId: string, resolutionNote: string, status: 'resolved' | 'dismissed' = 'resolved'): void {
    const reports = this.state.reports.map((r) =>
      r.id === reportId
        ? {
            ...r,
            status,
            resolutionNote: cleanText(resolutionNote, LIMITS.moderationNote.max),
          }
        : r,
    )
    this.persist({ ...this.state, reports })
  }

  resetToSeed(): void {
    this.persist(SEED_STATE)
  }
}

export const defaultRepository = new LocalStorageProblemBoxRepository()
