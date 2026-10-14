import type { SupabaseClient } from '@supabase/supabase-js'
import type { ProblemBoxRepository } from './repository'
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
import { cleanText, LIMITS } from '../domain/sanitize'

/**
 * Supabase implementation of ProblemBoxRepository.
 * Maps repository operations directly to Supabase PostgreSQL tables and RPCs.
 */
export class SupabaseProblemBoxRepository implements ProblemBoxRepository {
  private client: SupabaseClient
  private cachedState: ProblemBoxState = SEED_STATE
  private listeners = new Set<() => void>()

  constructor(client: SupabaseClient) {
    this.client = client
    this.initialSync()
  }

  private async initialSync() {
    try {
      const [
        { data: problems },
        { data: submitters },
        { data: validations },
        { data: comments },
        { data: reports },
        { data: buildIntents },
      ] = await Promise.all([
        this.client.from('problems').select('*').order('created_at', { ascending: false }),
        this.client.from('submitters').select('*'),
        this.client.from('problem_validations').select('*'),
        this.client.from('problem_comments').select('*').eq('status', 'visible').order('created_at', { ascending: true }),
        this.client.from('problem_reports').select('*').order('created_at', { ascending: false }),
        this.client.from('problem_build_intents').select('*'),
      ])

      this.cachedState = {
        version: 1,
        problems: (problems as Problem[]) ?? SEED_STATE.problems,
        submitters: (submitters as Submitter[]) ?? SEED_STATE.submitters,
        validations: (validations as Validation[]) ?? SEED_STATE.validations,
        comments: (comments as Comment[]) ?? SEED_STATE.comments,
        reports: (reports as Report[]) ?? SEED_STATE.reports,
        buildInterest: (buildIntents as BuildInterest[]) ?? SEED_STATE.buildInterest,
      }
      this.emit()
    } catch {
      // Keep cached state if initial sync fails
    }
  }

  private emit() {
    this.listeners.forEach((l) => l())
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getState(): ProblemBoxState {
    return this.cachedState
  }

  getProblems(): Problem[] {
    return this.cachedState.problems
  }

  getProblemById(id: string): Problem | undefined {
    return this.cachedState.problems.find(
      (p) => p.id === id || p.ref.toLowerCase() === id.toLowerCase(),
    )
  }

  getSubmitterById(id: string): Submitter | undefined {
    return this.cachedState.submitters.find((s) => s.id === id)
  }

  getValidations(problemId: string): Validation[] {
    return this.cachedState.validations.filter((v) => v.problemId === problemId)
  }

  getUserValidation(problemId: string, userId: string): Validation | undefined {
    return this.cachedState.validations.find(
      (v) => v.problemId === problemId && v.userId === userId,
    )
  }

  getComments(problemId: string): Comment[] {
    return this.cachedState.comments.filter(
      (c) => c.problemId === problemId && c.status === 'visible',
    )
  }

  getReports(): Report[] {
    return this.cachedState.reports
  }

  getBuildInterest(problemId: string): BuildInterest[] {
    return this.cachedState.buildInterest.filter((b) => b.problemId === problemId)
  }

  hasBuildInterest(problemId: string, userId: string): boolean {
    return this.cachedState.buildInterest.some(
      (b) => b.problemId === problemId && b.userId === userId,
    )
  }

  submitProblem(
    data: Omit<Problem, 'id' | 'ref' | 'createdAt' | 'updatedAt' | 'status' | 'duplicateOfId' | 'moderationNote'>,
    _authorName?: string,
  ): Problem {
    const nextNum = this.cachedState.problems.length + 1
    const ref = `PB-${String(nextNum).padStart(4, '0')}`
    const id = `pb-${String(nextNum).padStart(4, '0')}`
    const now = new Date().toISOString()

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

    // Optimistic update
    this.cachedState = {
      ...this.cachedState,
      problems: [newProblem, ...this.cachedState.problems],
    }
    this.emit()

    // Persist to Supabase
    this.client.from('problems').insert({
      id: newProblem.id,
      ref: newProblem.ref,
      title: newProblem.title,
      description: newProblem.description,
      affected_audience: newProblem.affectedAudience,
      industry: newProblem.industry,
      severity: newProblem.severity,
      existing_workarounds: newProblem.existingWorkarounds,
      submitter_id: newProblem.submitterId,
      status: 'published',
    }).then()

    return newProblem
  }

  saveValidation(params: {
    problemId: string
    userId: string
    kind: ValidationKind
    severity?: Severity | null
    note?: string
  }): Validation[] {
    const now = new Date().toISOString()
    const nextValidation: Validation = {
      problemId: params.problemId,
      userId: params.userId,
      kind: params.kind,
      severity: params.severity ?? null,
      note: cleanText(params.note ?? '', LIMITS.validationNote.max),
      createdAt: now,
      updatedAt: now,
    }

    // Optimistic update
    const filtered = this.cachedState.validations.filter(
      (v) => !(v.problemId === params.problemId && v.userId === params.userId),
    )
    this.cachedState = {
      ...this.cachedState,
      validations: [...filtered, nextValidation],
    }
    this.emit()

    // Upsert to Supabase with onConflict: 'problem_id, user_id'
    this.client.from('problem_validations').upsert({
      problem_id: params.problemId,
      user_id: params.userId,
      kind: params.kind,
      severity: params.severity ?? null,
      note: nextValidation.note,
      updated_at: now,
    }, { onConflict: 'problem_id,user_id' }).then()

    return this.getValidations(params.problemId)
  }

  deleteValidation(problemId: string, userId: string): Validation[] {
    this.cachedState = {
      ...this.cachedState,
      validations: this.cachedState.validations.filter(
        (v) => !(v.problemId === problemId && v.userId === userId),
      ),
    }
    this.emit()

    this.client
      .from('problem_validations')
      .delete()
      .match({ problem_id: problemId, user_id: userId })
      .then()

    return this.getValidations(problemId)
  }

  addComment(params: { problemId: string; authorId: string; body: string }): Comment {
    const cleanedBody = cleanText(params.body, LIMITS.comment.max, { multiline: true })
    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      problemId: params.problemId,
      authorId: params.authorId,
      body: cleanedBody,
      createdAt: new Date().toISOString(),
      status: 'visible',
    }

    this.cachedState = {
      ...this.cachedState,
      comments: [...this.cachedState.comments, newComment],
    }
    this.emit()

    this.client.from('problem_comments').insert({
      id: newComment.id,
      problem_id: newComment.problemId,
      author_id: newComment.authorId,
      body: newComment.body,
      status: 'visible',
    }).then()

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
      id: `rep-${Date.now()}`,
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

    this.cachedState = {
      ...this.cachedState,
      reports: [newReport, ...this.cachedState.reports],
    }
    this.emit()

    this.client.from('problem_reports').insert({
      id: newReport.id,
      target_type: newReport.targetType,
      target_id: newReport.targetId,
      problem_id: newReport.problemId,
      reporter_id: newReport.reporterId,
      reason: newReport.reason,
      details: newReport.details,
      status: 'open',
    }).then()

    return newReport
  }

  toggleBuildInterest(problemId: string, userId: string): boolean {
    const exists = this.hasBuildInterest(problemId, userId)
    let nextInterest: BuildInterest[]
    if (exists) {
      nextInterest = this.cachedState.buildInterest.filter(
        (b) => !(b.problemId === problemId && b.userId === userId),
      )
      this.client
        .from('problem_build_intents')
        .delete()
        .match({ problem_id: problemId, user_id: userId })
        .then()
    } else {
      nextInterest = [
        ...this.cachedState.buildInterest,
        { problemId, userId, createdAt: new Date().toISOString() },
      ]
      this.client
        .from('problem_build_intents')
        .insert({ problem_id: problemId, user_id: userId })
        .then()
    }

    this.cachedState = {
      ...this.cachedState,
      buildInterest: nextInterest,
    }
    this.emit()
    return !exists
  }

  setProblemStatus(problemId: string, status: ProblemStatus, note = ''): void {
    this.cachedState = {
      ...this.cachedState,
      problems: this.cachedState.problems.map((p) =>
        p.id === problemId
          ? { ...p, status, moderationNote: note || p.moderationNote, updatedAt: new Date().toISOString() }
          : p,
      ),
    }
    this.emit()

    this.client
      .from('problems')
      .update({ status, moderation_note: note, updated_at: new Date().toISOString() })
      .eq('id', problemId)
      .then()
  }

  markDuplicate(problemId: string, duplicateOfId: string, note = ''): void {
    this.cachedState = {
      ...this.cachedState,
      problems: this.cachedState.problems.map((p) =>
        p.id === problemId
          ? {
              ...p,
              status: 'duplicate' as const,
              duplicateOfId,
              moderationNote: note || `Marked as duplicate of ${duplicateOfId}`,
              updatedAt: new Date().toISOString(),
            }
          : p,
      ),
    }
    this.emit()

    this.client
      .from('problems')
      .update({
        status: 'duplicate',
        duplicate_of_id: duplicateOfId,
        moderation_note: note,
        updated_at: new Date().toISOString(),
      })
      .eq('id', problemId)
      .then()
  }

  resolveReport(reportId: string, resolutionNote: string, status: 'resolved' | 'dismissed' = 'resolved'): void {
    this.cachedState = {
      ...this.cachedState,
      reports: this.cachedState.reports.map((r) =>
        r.id === reportId ? { ...r, status, resolutionNote } : r,
      ),
    }
    this.emit()

    this.client
      .from('problem_reports')
      .update({ status, resolution_note: resolutionNote, resolved_at: new Date().toISOString() })
      .eq('id', reportId)
      .then()
  }

  resetToSeed(): void {
    this.cachedState = SEED_STATE
    this.emit()
  }
}
