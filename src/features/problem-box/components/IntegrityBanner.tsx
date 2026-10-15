import { useState } from 'react'
import { Container } from '../../../components/ui'

export function IntegrityBanner() {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-white/10 bg-[#08150E] text-[0.8125rem] text-mist/85">
      <Container className="py-2.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2 sm:items-center">
            <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-mint shadow-[0_0_8px_rgba(221,238,230,0.6)] sm:mt-0" />
            <div className="text-xs leading-normal sm:text-[0.8125rem]">
              <span className="font-bold text-mint mr-1.5">Data Integrity Policy:</span>
              <span className="text-mist/80">
                Validations are strictly separated into direct experience, observed, and interest.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="self-start text-[0.75rem] font-semibold text-mint underline underline-offset-2 hover:text-white sm:self-auto transition-colors shrink-0"
          >
            {open ? 'Hide details' : 'Read standards'}
          </button>
        </div>

        {open && (
          <div className="mt-3 grid gap-3 border-t border-white/10 pt-3 text-[0.75rem] leading-relaxed text-mist/80 sm:grid-cols-3">
            <div className="rounded-[6px] bg-white/[0.03] p-3 border border-white/5">
              <p className="font-semibold text-mint">No Synthetic Aggregate Demand</p>
              <p className="mt-1">
                Validation responses are never summed together into a single &ldquo;vote count&rdquo; or presented as market size or willingness to pay.
              </p>
            </div>
            <div className="rounded-[6px] bg-white/[0.03] p-3 border border-white/5">
              <p className="font-semibold text-mint">Strict Single Response per Member</p>
              <p className="mt-1">
                Each authenticated identity can register at most one validation response per problem statement. Editing updates your single entry.
              </p>
            </div>
            <div className="rounded-[6px] bg-white/[0.03] p-3 border border-white/5">
              <p className="font-semibold text-mint">Transparent Provenance</p>
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
