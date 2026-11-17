import { useQuery } from '@tanstack/react-query'
import { earningsLedgerQueryOptions } from '~/api/queries'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { StatusChip, type StatusTone } from '~/components/dashboard/StatusChip'
import { formatDate } from '~/components/dashboard/format'
import { AcademyPage, ErrorNote, LoadingNote, MoneyText, Notice, Section } from './ui'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Screen 17 — earnings and escrow ledger.
 *
 * Data: `earnings.getLedger` (PROPOSED). Every amount is provisional and
 * rendered through `MoneyText`, which shows the placeholder when the adapter
 * returns no approved figure. Nothing on this screen is a real payout.
 */

const payoutTone: Record<string, StatusTone> = {
  scheduled: 'neutral',
  processing: 'warning',
  paid: 'success',
  on_hold: 'warning',
}

const ledgerTone: Record<string, StatusTone> = {
  pending: 'warning',
  held: 'warning',
  available: 'success',
  paid: 'success',
  reversed: 'neutral',
}

export function EarningsScreen() {
  const strings = useStrings()
  const copy = strings.earnings
  const lang = useLang()
  const query = useQuery(earningsLedgerQueryOptions())

  if (query.isPending) {
    return (
      <AcademyPage badge={copy.badge} title={copy.title} lead={copy.lead}>
        <LoadingNote />
      </AcademyPage>
    )
  }

  if (query.isError || !query.data) {
    return (
      <AcademyPage badge={copy.badge} title={copy.title} lead={copy.lead}>
        <ErrorNote body={copy.loadError} />
      </AcademyPage>
    )
  }

  const data = query.data
  const summary = data.summary

  return (
    <AcademyPage badge={copy.badge} title={copy.title} lead={copy.lead}>
      <section
        className="academy-provisional"
        aria-labelledby="earnings-provisional-heading"
      >
        <span className="academy-tag">{copy.provisionalTag}</span>
        <h2 id="earnings-provisional-heading">{copy.provisionalHeading}</h2>
        <p>{copy.provisionalBody}</p>
      </section>

      <div className="academy-stats">
        <div className="academy-stat">
          <p className="academy-stat__label">{copy.summary.available}</p>
          <p className="academy-stat__value">
            <MoneyText money={summary.available} />
          </p>
        </div>
        <div className="academy-stat">
          <p className="academy-stat__label">{copy.summary.pending}</p>
          <p className="academy-stat__value">
            <MoneyText money={summary.pending} />
          </p>
        </div>
        <div className="academy-stat">
          <p className="academy-stat__label">{copy.summary.held}</p>
          <p className="academy-stat__value">
            <MoneyText money={summary.held} />
          </p>
        </div>
        <div className="academy-stat">
          <p className="academy-stat__label">{copy.summary.paidToDate}</p>
          <p className="academy-stat__value">
            <MoneyText money={summary.paidToDate} />
          </p>
        </div>
        <div className="academy-stat">
          <p className="academy-stat__label">{copy.summary.nextPayout}</p>
          <p className="academy-stat__value">
            {formatDate(summary.nextPayoutDate, copy.noPayoutDate, lang)}
          </p>
        </div>
        <div className="academy-stat">
          <p className="academy-stat__label">{copy.summary.payoutAccount}</p>
          <p className="academy-stat__value">
            <StatusChip
              tone={
                summary.payoutAccountStatus === 'verified'
                  ? 'success'
                  : summary.payoutAccountStatus === 'pending'
                    ? 'warning'
                    : 'neutral'
              }
              label={strings.status.payoutAccount[summary.payoutAccountStatus]}
              icon={
                summary.payoutAccountStatus === 'verified' ? 'check' : 'clock'
              }
            />
          </p>
        </div>
      </div>

      <Section id="earnings-entries" title={copy.ledgerHeading}>
        {data.entries.length === 0 ? (
          <EmptyNote title={copy.emptyTitle} body={copy.emptyBody} icon="chart" />
        ) : (
          <div className="academy-table-wrap">
            <table className="academy-table academy-table--ledger">
              <thead>
                <tr>
                  <th scope="col">{copy.date}</th>
                  <th scope="col">{copy.type}</th>
                  <th scope="col">{copy.description}</th>
                  <th scope="col">{copy.cohort}</th>
                  <th scope="col">{copy.reference}</th>
                  <th scope="col">{copy.amount}</th>
                  <th scope="col">{copy.status}</th>
                </tr>
              </thead>
              <tbody>
                {data.entries.map((entry) => (
                  <tr key={entry.id}>
                    <td data-label={copy.date}>{formatDate(entry.date, strings.common.notAvailable, lang)}</td>
                    <td data-label={copy.type}>{strings.status.ledgerType[entry.type]}</td>
                    <td data-label={copy.description}>{entry.description}</td>
                    <td data-label={copy.cohort}>{entry.cohortLabel ?? strings.common.notAvailable}</td>
                    <td data-label={copy.reference}>{entry.reference ?? strings.common.notAvailable}</td>
                    <td data-label={copy.amount}>
                      <MoneyText money={entry.amount} />
                    </td>
                    <td data-label={copy.status}>
                      <StatusChip
                        tone={ledgerTone[entry.status] ?? 'neutral'}
                        label={strings.status.ledgerStatus[entry.status]}
                        icon={
                          entry.status === 'available' || entry.status === 'paid'
                            ? 'check'
                            : 'clock'
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Notice tone="provisional">{copy.escrowNote}</Notice>
      </Section>

      <Section id="earnings-schedule" title={copy.scheduleHeading}>
        {data.payoutSchedule.length === 0 ? (
          <p className="academy-muted">{copy.emptySchedule}</p>
        ) : (
          <div className="academy-table-wrap">
            <table className="academy-table academy-table--payouts">
              <thead>
                <tr>
                  <th scope="col">{copy.description}</th>
                  <th scope="col">{copy.payoutDate}</th>
                  <th scope="col">{copy.amount}</th>
                  <th scope="col">{copy.status}</th>
                </tr>
              </thead>
              <tbody>
                {data.payoutSchedule.map((item) => (
                  <tr key={item.id}>
                    <td data-label={copy.description}>{item.label}</td>
                    <td data-label={copy.payoutDate}>{formatDate(item.date, copy.noPayoutDate, lang)}</td>
                    <td data-label={copy.amount}>
                      <MoneyText money={item.amount} />
                    </td>
                    <td data-label={copy.status}>
                      <StatusChip
                        tone={payoutTone[item.status] ?? 'neutral'}
                        label={strings.status.payout[item.status]}
                        icon={item.status === 'paid' ? 'check' : 'clock'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </AcademyPage>
  )
}
