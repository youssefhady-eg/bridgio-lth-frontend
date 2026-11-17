import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { academyDashboardQueryOptions } from '~/api/queries'
import { formatCount, formatDate, formatTime } from '~/components/dashboard/format'
import { Block, BlockGrid } from '~/components/ds'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { StatusChip, type StatusTone } from '~/components/dashboard/StatusChip'
import { AcademyPage, ErrorNote, LoadingNote, MoneyText, Section, Stat } from './ui'
import { useLang, useStrings } from '~/shell/useStrings'
import { usePreviewRole } from '~/shell/usePreviewRole'

/**
 * Screen 12 — academy dashboard.
 *
 * Data: `academies.getDashboard` (PROPOSED), one aggregate call. Earnings are
 * provisional and rendered through `MoneyText`, never as a computed figure.
 */

const cohortTone: Record<string, StatusTone> = {
  active: 'success',
  published: 'neutral',
  draft: 'warning',
  completed: 'neutral',
}

export function AcademyDashboardScreen() {
  const strings = useStrings()
  const copy = strings.dashboard
  const lang = useLang()
  const role = usePreviewRole()
  const query = useQuery(academyDashboardQueryOptions())

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
        <ErrorNote body={strings.common.loadErrorBody} />
      </AcademyPage>
    )
  }

  const data = query.data

  return (
    <AcademyPage badge={copy.badge} title={copy.title} lead={copy.lead}>
      <p className="academy-greeting">
        {copy.greeting(data.academy.name)} ·{' '}
        <span className="academy-muted">
          {copy.updatedAt} {formatDate(data.updatedAt, strings.common.notAvailable, lang)}
        </span>
      </p>

      <BlockGrid className="academy-dashboard-stats">
        <Block span={4}>
          <Stat
            label={copy.totals.cohorts}
            value={formatCount(data.totals.activeCohorts, lang)}
            hint={copy.cohortsCount(data.totals.activeCohorts)}
          />
        </Block>
        <Block span={4}>
          <Stat
            label={copy.totals.learners}
            value={formatCount(data.totals.activeLearners, lang)}
            hint={copy.learnersCount(data.totals.activeLearners)}
          />
        </Block>
        <Block span={4}>
          <Stat
            label={copy.totals.sessions}
            value={formatCount(data.totals.sessionsThisWeek, lang)}
            hint={copy.sessionsCount(data.totals.sessionsThisWeek)}
          />
        </Block>
      </BlockGrid>

      <BlockGrid className="academy-dashboard-split">
        <Block span={6}>
          <Section id="dashboard-calibration" title={copy.calibration.heading}>
            <StatusChip
              tone={data.calibration.status === 'calibrated' ? 'success' : 'warning'}
              label={strings.status.calibration[data.calibration.status]}
              icon={data.calibration.status === 'calibrated' ? 'check' : 'clock'}
            />
            <p className="academy-section__lead">
              {copy.calibration.samples(
                data.calibration.sampleLessonsReviewed,
                data.calibration.sampleLessonsRequired,
              )}
            </p>
            {role === 'academy' ? (
              <Link
                to="/academy/onboarding"
                search={{ as: role, lang }}
                className="button button--secondary button--small"
                preload={false}
              >
                {copy.calibration.open}
              </Link>
            ) : null}
          </Section>
        </Block>

        <Block span={6}>
          <Section id="dashboard-alerts" title={copy.alerts.heading} lead={copy.alerts.lead}>
            {data.alerts.length === 0 ? (
              <EmptyNote
                title={copy.alerts.emptyTitle}
                body={copy.alerts.emptyBody}
                icon="check"
                tone="success"
              />
            ) : (
              <ul className="academy-alert-list">
                {data.alerts.map((alert) => (
                  <li key={alert.id} className="academy-alert">
                    <span className="academy-alert__count">
                      {copy.alerts.count(alert.count)}
                    </span>
                    <span>{strings.status.alert[alert.kind]}</span>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </Block>
      </BlockGrid>

      <Section id="dashboard-sessions" title={copy.upcoming.heading} lead={copy.upcoming.lead}>
        {data.upcomingSessions.length === 0 ? (
          <EmptyNote
            title={copy.upcoming.emptyTitle}
            body={copy.upcoming.emptyBody}
            icon="clock"
          />
        ) : (
          <div className="academy-table-wrap">
            <table className="academy-table">
              <thead>
                <tr>
                  <th scope="col">{strings.common.cohort}</th>
                  <th scope="col">{strings.common.language}</th>
                  <th scope="col">{strings.roster.sessionDate}</th>
                  <th scope="col">{strings.common.duration}</th>
                </tr>
              </thead>
              <tbody>
                {data.upcomingSessions.map((session) => (
                  <tr key={session.id}>
                    <td data-label={strings.common.cohort}>{session.cohortLabel}</td>
                    <td data-label={strings.common.language}>{session.languageLabel}</td>
                    <td data-label={strings.roster.sessionDate}>
                      {formatDate(session.startsAt, strings.common.notAvailable, lang)} ·{' '}
                      {formatTime(session.startsAt, lang)}
                    </td>
                    <td data-label={strings.common.duration}>
                      {copy.upcoming.duration(session.durationMinutes)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section
        id="dashboard-cohorts"
        title={copy.cohorts.heading}
        actions={
          <Link
            to="/academy/cohorts"
            search={{ as: role, lang }}
            className="button button--secondary button--small"
            preload={false}
          >
            {copy.cohorts.open}
          </Link>
        }
      >
        {data.cohorts.length === 0 ? (
          <EmptyNote
            title={copy.cohorts.emptyTitle}
            body={copy.cohorts.emptyBody}
            icon="classes"
          />
        ) : (
          <div className="academy-table-wrap">
            <table className="academy-table">
              <thead>
                <tr>
                  <th scope="col">{strings.common.cohort}</th>
                  <th scope="col">{strings.common.language}</th>
                  <th scope="col">{strings.common.level}</th>
                  <th scope="col">{strings.common.seats}</th>
                  <th scope="col">{strings.common.status}</th>
                </tr>
              </thead>
              <tbody>
                {data.cohorts.map((cohort) => (
                  <tr key={cohort.id}>
                    <td data-label={strings.common.cohort}>{cohort.label}</td>
                    <td data-label={strings.common.language}>
                      <span lang={cohort.language.code} dir={cohort.language.direction}>
                        {cohort.language.label}
                      </span>
                    </td>
                    <td data-label={strings.common.level}>{cohort.level.label}</td>
                    <td data-label={strings.common.seats}>
                      {strings.cohorts.seatsLabel(
                        cohort.seatsFilled,
                        cohort.capacity,
                      )}
                    </td>
                    <td data-label={strings.common.status}>
                      <StatusChip
                        tone={cohortTone[cohort.status] ?? 'neutral'}
                        label={strings.status.cohort[cohort.status]}
                        icon={cohort.status === 'active' ? 'check' : 'clock'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section id="dashboard-earnings" title={copy.earnings.heading}>
        <div className="academy-earnings-teaser">
          <p className="academy-stat__value">
            <MoneyText money={data.earnings} />
          </p>
          <span className="academy-tag">{copy.earnings.provisional}</span>
        </div>
        <p className="academy-section__lead">{copy.earnings.note}</p>
        {role === 'academy' ? (
          <Link
            to="/academy/earnings"
            search={{ as: role, lang }}
            className="button button--secondary button--small"
            preload={false}
          >
            {copy.earnings.open}
          </Link>
        ) : null}
      </Section>
    </AcademyPage>
  )
}
