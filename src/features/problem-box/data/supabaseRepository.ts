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
  Evidence,
  Industry,
  SubmitterKind,
  ValidationKind,
  Severity,
  ProblemStatus,
  ReportReason,
} from '../domain/types'
import { SEED_STATE } from './seed'
import { cleanText, LIMITS } from '../domain/sanitize'

function isUuid(val: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val)
}

function mapDbSubmitter(row: any): Submitter {
  return {
    id: String(row.id),
    displayName: String(row.display_name ?? 'Anonymous'),
    kind: (row.kind === 'public_source' ? 'public-source' : row.kind) as SubmitterKind,
    verified: Boolean(row.is_verified),
  }
}

function mapDbEvidence(row: any): Evidence {
  return {
    id: String(row.id),
    label: String(row.label ?? ''),
    url: row.url ? String(row.url) : null,
    note: String(row.note ?? ''),
  }
}

function mapDbProblem(row: any, evidenceList: any[] = []): Problem {
  const hasSource = Boolean(row.source_organization || row.source_id)
  return {
    id: String(row.id),
    ref: String(row.ref ?? row.id),
    title: String(row.title ?? ''),
    description: String(row.description ?? ''),
    affectedAudience: String(row.affected_audience ?? ''),
    industry: (row.industry as Industry) ?? 'Other',
    severity: (row.severity as Severity) ?? null,
    existingWorkarounds: String(row.existing_workarounds ?? ''),
    evidence: evidenceList.filter((e) => e.problem_id === row.id).map(mapDbEvidence),
    submitterId: String(row.submitter_id ?? ''),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
    status: (row.status as ProblemStatus) ?? 'published',
    duplicateOfId: row.duplicate_of_id ? String(row.duplicate_of_id) : null,
    moderationNote: String(row.moderation_note ?? ''),
    source: hasSource
      ? {
          organization: String(row.source_organization ?? ''),
          program: String(row.source_program ?? ''),
          sourceId: String(row.source_id ?? ''),
          url: String(row.source_url ?? ''),
          publishedYear: typeof row.source_published_year === 'number' ? row.source_published_year : null,
        }
      : null,
  }
}

function mapDbValidation(row: any): Validation {
  return {
    problemId: String(row.problem_id),
    userId: String(row.user_id),
    kind: row.kind as ValidationKind,
    severity: (row.severity as Severity) ?? null,
    note: String(row.note ?? ''),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  }
}

function mapDbComment(row: any): Comment {
  return {
    id: String(row.id),
    problemId: String(row.problem_id),
    authorId: String(row.author_id),
    body: String(row.body ?? ''),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    status: (row.status as 'visible' | 'removed') ?? 'visible',
  }
}

function mapDbReport(row: any): Report {
  return {
    id: String(row.id),
    targetType: row.target_type as 'problem' | 'comment',
    targetId: String(row.target_id),
    problemId: String(row.problem_id),
    reporterId: String(row.reporter_id),
    reason: row.reason as ReportReason,
    details: String(row.details ?? ''),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    status: (row.status as 'open' | 'resolved' | 'dismissed') ?? 'open',
    resolutionNote: String(row.resolution_note ?? ''),
  }
}

function mapDbBuildIntent(row: any): BuildInterest {
  return {
    problemId: String(row.problem_id),
    userId: String(row.user_id),
    createdAt: String(row.created_at ?? new Date().toISOString()),
  }
}

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
        { data: evidence },
      ] = await Promise.all([
        this.client.from('problems').select('*').order('created_at', { ascending: false }),
        this.client.from('submitters').select('*'),
        this.client.from('problem_validations').select('*'),
        this.client.from('problem_comments').select('*').eq('status', 'visible').order('created_at', { ascending: true }),
        this.client.from('problem_reports').select('*').order('created_at', { ascending: false }),
        this.client.from('problem_build_intents').select('*'),
        this.client.from('problem_evidence').select('*'),
      ])

      const evidenceList = evidence ?? []
      const dbSubmitters = (submitters || []).map(mapDbSubmitter)

      // Retain all seed submitters and merge with database submitters
      const submitterMap = new Map<string, Submitter>()
      SEED_STATE.submitters.forEach((s) => submitterMap.set(s.id, s))
      dbSubmitters.forEach((s) => submitterMap.set(s.id, s))

      // Index problems by ref and ID to merge the curated public bank with live DB problems
      const problemsByRef = new Map<string, Problem>()
      SEED_STATE.problems.forEach((p) => problemsByRef.set(p.ref.toUpperCase(), p))
      if (problems && problems.length > 0) {
        problems.forEach((p) => {
          const mapped = mapDbProblem(p, evidenceList)
          problemsByRef.set(mapped.ref.toUpperCase(), mapped)
        })
      }
      const dbProblems = Array.from(problemsByRef.values())

      // Merge validations (seed + live)
      const validationsMap = new Map<string, Validation>()
      SEED_STATE.validations.forEach((v) => validationsMap.set(`${v.problemId}:${v.userId}`, v))
      if (validations && validations.length > 0) {
        validations.forEach((v) => {
          const mapped = mapDbValidation(v)
          validationsMap.set(`${mapped.problemId}:${mapped.userId}`, mapped)
        })
      }
      const dbValidations = Array.from(validationsMap.values())

      // Merge comments
      const commentsMap = new Map<string, Comment>()
      SEED_STATE.comments.forEach((c) => commentsMap.set(c.id, c))
      if (comments && comments.length > 0) {
        comments.forEach((c) => {
          const mapped = mapDbComment(c)
          commentsMap.set(mapped.id, mapped)
        })
      }
      const dbComments = Array.from(commentsMap.values())

      // Merge reports
      const reportsMap = new Map<string, Report>()
      SEED_STATE.reports.forEach((r) => reportsMap.set(r.id, r))
      if (reports && reports.length > 0) {
        reports.forEach((r) => {
          const mapped = mapDbReport(r)
          reportsMap.set(mapped.id, mapped)
        })
      }
      const dbReports = Array.from(reportsMap.values())

      // Merge build interest
      const buildMap = new Map<string, BuildInterest>()
      SEED_STATE.buildInterest.forEach((b) => buildMap.set(`${b.problemId}:${b.userId}`, b))
      if (buildIntents && buildIntents.length > 0) {
        buildIntents.forEach((b) => {
          const mapped = mapDbBuildIntent(b)
          buildMap.set(`${mapped.problemId}:${mapped.userId}`, mapped)
        })
      }
      const dbBuildInterest = Array.from(buildMap.values())

      this.cachedState = {
        version: 1,
        problems: dbProblems,
        submitters: Array.from(submitterMap.values()),
        validations: dbValidations,
        comments: dbComments,
        reports: dbReports,
        buildInterest: dbBuildInterest,
      }
      this.emit()
    } catch (err) {
      console.warn('[Supabase] Initial sync failed, using cached/seed state:', err)
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
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `pb-${Date.now()}`
    const now = new Date().toISOString()

    // Ensure submitter_id satisfies DB foreign key constraint
    const dbSubmitterId = isUuid(data.submitterId)
      ? data.submitterId
      : '66666666-6666-4666-8666-666666666666'

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

    // Persist to Supabase if valid UUID
    if (isUuid(id)) {
      this.client.from('problems').insert({
        id: newProblem.id,
        ref: newProblem.ref,
        title: newProblem.title,
        description: newProblem.description,
        affected_audience: newProblem.affectedAudience,
        industry: newProblem.industry,
        severity: newProblem.severity,
        existing_workarounds: newProblem.existingWorkarounds,
        submitter_id: dbSubmitterId,
        status: 'published',
      }).then(({ error }) => {
        if (error) console.warn('[Supabase] Problem insert note:', error.message)
      })
    }

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

    // Upsert to Supabase if UUIDs
    if (isUuid(params.problemId) && isUuid(params.userId)) {
      this.client.from('problem_validations').upsert({
        problem_id: params.problemId,
        user_id: params.userId,
        kind: params.kind,
        severity: params.severity ?? null,
        note: nextValidation.note,
        updated_at: now,
      }, { onConflict: 'problem_id,user_id' }).then(({ error }) => {
        if (error) console.warn('[Supabase] Validation upsert note:', error.message)
      })
    }

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

    if (isUuid(problemId) && isUuid(userId)) {
      this.client
        .from('problem_validations')
        .delete()
        .match({ problem_id: problemId, user_id: userId })
        .then(({ error }) => {
          if (error) console.warn('[Supabase] Validation delete note:', error.message)
        })
    }

    return this.getValidations(problemId)
  }

  addComment(params: { problemId: string; authorId: string; body: string }): Comment {
    const cleanedBody = cleanText(params.body, LIMITS.comment.max, { multiline: true })
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `comm-${Date.now()}`
    const newComment: Comment = {
      id,
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

    if (isUuid(id) && isUuid(params.problemId) && isUuid(params.authorId)) {
      this.client.from('problem_comments').insert({
        id: newComment.id,
        problem_id: newComment.problemId,
        author_id: newComment.authorId,
        body: newComment.body,
        status: 'visible',
      }).then(({ error }) => {
        if (error) console.warn('[Supabase] Comment insert note:', error.message)
      })
    }

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
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `rep-${Date.now()}`
    const newReport: Report = {
      id,
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

    if (isUuid(id) && isUuid(params.problemId) && isUuid(params.reporterId)) {
      this.client.from('problem_reports').insert({
        id: newReport.id,
        target_type: newReport.targetType,
        target_id: newReport.targetId,
        problem_id: newReport.problemId,
        reporter_id: newReport.reporterId,
        reason: newReport.reason,
        details: newReport.details,
        status: 'open',
      }).then(({ error }) => {
        if (error) console.warn('[Supabase] Report insert note:', error.message)
      })
    }

    return newReport
  }

  toggleBuildInterest(problemId: string, userId: string): boolean {
    const exists = this.hasBuildInterest(problemId, userId)
    let nextInterest: BuildInterest[]
    if (exists) {
      nextInterest = this.cachedState.buildInterest.filter(
        (b) => !(b.problemId === problemId && b.userId === userId),
      )
      if (isUuid(problemId) && isUuid(userId)) {
        this.client
          .from('problem_build_intents')
          .delete()
          .match({ problem_id: problemId, user_id: userId })
          .then()
      }
    } else {
      nextInterest = [
        ...this.cachedState.buildInterest,
        { problemId, userId, createdAt: new Date().toISOString() },
      ]
      if (isUuid(problemId) && isUuid(userId)) {
        this.client
          .from('problem_build_intents')
          .insert({ problem_id: problemId, user_id: userId })
          .then()
      }
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

    if (isUuid(problemId)) {
      this.client
        .from('problems')
        .update({ status, moderation_note: note, updated_at: new Date().toISOString() })
        .eq('id', problemId)
        .then()
    }
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

    if (isUuid(problemId)) {
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
  }

  resolveReport(reportId: string, resolutionNote: string, status: 'resolved' | 'dismissed' = 'resolved'): void {
    this.cachedState = {
      ...this.cachedState,
      reports: this.cachedState.reports.map((r) =>
        r.id === reportId ? { ...r, status, resolutionNote } : r,
      ),
    }
    this.emit()

    if (isUuid(reportId)) {
      this.client
        .from('problem_reports')
        .update({ status, resolution_note: resolutionNote, resolved_at: new Date().toISOString() })
        .eq('id', reportId)
        .then()
    }
  }

  resetToSeed(): void {
    this.cachedState = SEED_STATE
    this.emit()
  }
}
