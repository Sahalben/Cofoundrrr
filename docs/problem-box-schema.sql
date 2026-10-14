-- ============================================================================
-- COFOUNDRRR — PROBLEM BOX PRODUCTION DATABASE SCHEMA
-- PostgreSQL 15+ compatible
--
-- This schema establishes the production data model for Problem Box,
-- guaranteeing data integrity, preventing duplicate validation votes,
-- preserving moderation audit trails, and separating validation kinds.
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enums
CREATE TYPE problem_status AS ENUM (
  'pending',
  'published',
  'duplicate',
  'removed'
);

CREATE TYPE submitter_kind AS ENUM (
  'individual',
  'organization',
  'public_source'
);

CREATE TYPE validation_kind AS ENUM (
  'direct',    -- Direct personal experience
  'observed',  -- Witnessed others experience it
  'interest'   -- General interest/importance (NEVER equated with experience)
);

CREATE TYPE report_target_type AS ENUM (
  'problem',
  'comment'
);

CREATE TYPE report_status AS ENUM (
  'open',
  'resolved',
  'dismissed'
);

CREATE TYPE comment_status AS ENUM (
  'visible',
  'removed'
);

-- ----------------------------------------------------------------------------
-- 1. SUBMITTERS & ORGANIZATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE submitters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  display_name VARCHAR(140) NOT NULL,
  kind submitter_kind NOT NULL DEFAULT 'individual',
  -- Verified flag MUST only be set after manual administrative verification.
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  verified_by UUID, -- references administrative user
  verification_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. PROBLEM STATEMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ref VARCHAR(16) NOT NULL UNIQUE, -- e.g. 'PB-0001'
  title VARCHAR(140) NOT NULL,
  description TEXT NOT NULL CHECK (char_length(description) >= 80),
  affected_audience VARCHAR(300) NOT NULL,
  industry VARCHAR(60) NOT NULL,
  -- Initial submitter severity rating (1=Minor, 5=Critical). Can be NULL if imported without rating.
  severity SMALLINT CHECK (severity BETWEEN 1 AND 5),
  existing_workarounds TEXT DEFAULT '',
  
  submitter_id UUID NOT NULL REFERENCES submitters(id) ON DELETE RESTRICT,
  status problem_status NOT NULL DEFAULT 'published',
  
  -- Duplicate handling
  duplicate_of_id UUID REFERENCES problems(id) ON DELETE SET NULL,
  moderation_note TEXT DEFAULT '',
  
  -- Public source provenance (if imported from SIH, KSUM, etc.)
  source_organization VARCHAR(160),
  source_program VARCHAR(120),
  source_id VARCHAR(64),
  source_url TEXT,
  source_published_year SMALLINT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_problems_status_created ON problems(status, created_at DESC);
CREATE INDEX idx_problems_industry ON problems(industry);
CREATE INDEX idx_problems_submitter ON problems(submitter_id);
-- Trigram index for fuzzy text search across titles
CREATE INDEX idx_problems_title_trgm ON problems USING gin (title gin_trgm_ops);

-- ----------------------------------------------------------------------------
-- 3. EVIDENCE ATTACHMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE problem_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  label VARCHAR(120) NOT NULL,
  url TEXT CHECK (url IS NULL OR url ~* '^https?://'),
  note VARCHAR(500) DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_evidence_problem ON problem_evidence(problem_id);

-- ----------------------------------------------------------------------------
-- 4. VALIDATIONS (STRICT INTEGRITY)
-- Guaranteed: Exactly ONE validation per authenticated user per problem.
-- Direct vs Observed vs Interest are stored discretely and NEVER merged into an aggregate vote count.
-- ----------------------------------------------------------------------------
CREATE TABLE problem_validations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- references auth.users
  kind validation_kind NOT NULL,
  -- Severity only allowed for experience-based validation (direct or observed)
  severity SMALLINT CHECK (
    (kind = 'interest' AND severity IS NULL) OR
    (kind IN ('direct', 'observed') AND (severity IS NULL OR severity BETWEEN 1 AND 5))
  ),
  note VARCHAR(280) DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- CRITICAL INTEGRITY CONSTRAINT:
  -- A user cannot hold more than one validation response for a given problem.
  -- Updates overwrite the previous response.
  CONSTRAINT uq_problem_user_validation UNIQUE (problem_id, user_id)
);

CREATE INDEX idx_validations_problem_kind ON problem_validations(problem_id, kind);
CREATE INDEX idx_validations_user ON problem_validations(user_id);
CREATE INDEX idx_validations_recent ON problem_validations(updated_at DESC);

-- ----------------------------------------------------------------------------
-- 5. COMMENTS & COMMUNITY DISCUSSION
-- ----------------------------------------------------------------------------
CREATE TABLE problem_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  author_id UUID NOT NULL, -- references auth.users
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 2 AND 2000),
  status comment_status NOT NULL DEFAULT 'visible',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_problem_created ON problem_comments(problem_id, created_at ASC);

-- ----------------------------------------------------------------------------
-- 6. MODERATION & REPORTS
-- ----------------------------------------------------------------------------
CREATE TABLE problem_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  target_type report_target_type NOT NULL,
  target_id UUID NOT NULL,
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL, -- references auth.users
  reason VARCHAR(32) NOT NULL, -- e.g. spam, duplicate, inaccurate, offensive
  details VARCHAR(1000) DEFAULT '',
  status report_status NOT NULL DEFAULT 'open',
  resolved_by UUID, -- references auth.users
  resolution_note TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_reports_status ON problem_reports(status, created_at DESC);

-- ----------------------------------------------------------------------------
-- 7. "BUILD THIS PROBLEM" INTENT
-- Connects validated problem statements to Cofoundrrr teams & venture tracks
-- ----------------------------------------------------------------------------
CREATE TABLE problem_build_intents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- references auth.users
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_problem_user_build_intent UNIQUE (problem_id, user_id)
);

CREATE INDEX idx_build_intents_problem ON problem_build_intents(problem_id);
CREATE INDEX idx_build_intents_user ON problem_build_intents(user_id);

-- ----------------------------------------------------------------------------
-- 8. INTEGRITY VIEW: SEPARATED VALIDATION METRICS
-- Does NOT sum kinds together into a deceptive 'market demand' score.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_problem_validation_summary AS
SELECT
  p.id AS problem_id,
  COUNT(pv.id) AS total_responses,
  COUNT(pv.id) FILTER (WHERE pv.kind = 'direct') AS direct_experience_count,
  COUNT(pv.id) FILTER (WHERE pv.kind = 'observed') AS observed_experience_count,
  COUNT(pv.id) FILTER (WHERE pv.kind = 'interest') AS general_interest_count,
  -- Community median severity from members with direct or observed experience
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY pv.severity)
    FILTER (WHERE pv.kind IN ('direct', 'observed') AND pv.severity IS NOT NULL) AS community_median_severity
FROM problems p
LEFT JOIN problem_validations pv ON pv.problem_id = p.id
GROUP BY p.id;
