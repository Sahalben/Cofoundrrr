import { useState } from 'react'
import { Container } from '../../../components/ui'

export function IntegrityBanner() {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-line bg-mint/40 text-[0.8125rem] text-ink/80">
      <Container className="py-2.5">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-forest" />
            <span className="font-semibold text-forest">Problem Box Data Integrity Policy:</span>
            <span>
              Validations are separated into direct experience, observed, and general interest.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="self-start text-[0.75rem] font-medium underline underline-offset-2 hover:text-forest sm:self-auto"
          >
            {open ? 'Hide details' : 'Read standards'}
          </button>
        </div>

        {open && (
          <div className="mt-3 grid gap-3 border-t border-line/60 pt-3 text-[0.75rem] leading-relaxed text-ink/75 sm:grid-cols-3">
            <div>
              <p className="font-semibold text-forest">No Synthetic Aggregate Demand</p>
              <p className="mt-1">
                Validation responses are never summed together into a single &ldquo;vote count&rdquo; or presented as market size or willingness to pay.
              </p>
            </div>
            <div>
              <p className="font-semibold text-forest">Strict Single Response per Member</p>
              <p className="mt-1">
                Each authenticated identity can register at most one validation response per problem statement. Editing updates your single entry.
              </p>
            </div>
            <div>
              <p className="font-semibold text-forest">Transparent Provenance</p>
              <p className="mt-1">
                Statements sourced from public hackathons and ministries are attributed with source program IDs and verified URLs.
              </p>
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
