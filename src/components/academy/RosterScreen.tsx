import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { api } from '~/api'
import type { AttendanceMark } from '~/api/types'
import {
  attendanceSheetQueryOptions,
  cohortRosterQueryOptions,
} from '~/api/queries'
import { queryKeys } from '~/api/query-keys'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { StatusChip, type StatusTone } from '~/components/dashboard/StatusChip'
import { formatDate, formatPercent } from '~/components/dashboard/format'
import { AcademyPage, ErrorNote, LoadingNote, Notice, Section } from './ui'
import { useLang, useStrings } from '~/shell/useStrings'
import { usePreviewRole } from '~/shell/usePreviewRole'

/**
 * Screen 14 — roster and attendance.
 *
 * Data: `cohorts.getRoster`, `cohorts.getAttendanceSheet` and
 * `cohorts.markAttendance` (all PROPOSED). Attendance is a proposed model and
 * the screen says so. A rate is null until at least one session is recorded;
 * the UI never turns null into 0.
 */

const marks: AttendanceMark[] = ['present', 'late', 'absent', 'excused']

const attendanceTone: Record<string, StatusTone> = {
  present: 'success',
  late: 'warning',
  absent: 'warning',
  excused: 'neutral',
  not_recorded: 'neutral',
}

export function RosterScreen({ cohortId }: { cohortId: string }) {
  const strings = useStrings()
  const copy = strings.roster
  const lang = useLang()
  const role = usePreviewRole()
  const queryClient = useQueryClient()
  const rosterQuery = useQuery(cohortRosterQueryOptions(cohortId))
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [marksByLearner, setMarksByLearner] = useState<Record<string, AttendanceMark>>(
    {},
  )
  const [saved, setSaved] = useState(false)

  const sessions = rosterQuery.data?.sessions ?? []
  const activeSessionId =
    selectedSessionId ??
    sessions.find((session) => session.attendanceRecorded)?.id ??
    sessions[0]?.id ??
    ''

  const sheetQuery = useQuery({
    ...attendanceSheetQueryOptions(cohortId, activeSessionId),
    enabled: activeSessionId !== '',
  })

  useEffect(() => {
    const sheet = sheetQuery.data
    if (!sheet) return
    const next: Record<string, AttendanceMark> = {}
    for (const record of sheet.records) {
      if (record.status !== 'not_recorded') next[record.learnerId] = record.status
    }
    setMarksByLearner(next)
    setSaved(false)
  }, [sheetQuery.data])

  const saveAttendance = useMutation({
    mutationFn: () =>
      api.cohorts.markAttendance({
        cohortId,
        sessionId: activeSessionId,
        records: Object.entries(marksByLearner).map(([learnerId, status]) => ({
          learnerId,
          status,
        })),
      }),
    onSuccess: () => {
      setSaved(true)
      void queryClient.invalidateQueries({
        queryKey: queryKeys.cohorts.roster(cohortId),
      })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.cohorts.attendance(cohortId, activeSessionId),
      })
    },
  })

  if (rosterQuery.isPending) {
    return (
      <AcademyPage badge={copy.badge} title={copy.title} lead={copy.lead}>
        <LoadingNote />
      </AcademyPage>
    )
  }

  if (rosterQuery.isError || !rosterQuery.data) {
    return (
      <AcademyPage badge={copy.badge} title={copy.title} lead={copy.lead}>
        <ErrorNote body={strings.common.loadErrorBody} />
      </AcademyPage>
    )
  }

  const roster = rosterQuery.data
  const sheet = sheetQuery.data
  const members = roster.members
  const allMarked =
    members.length > 0 && members.every((member) => marksByLearner[member.learnerId])
  const activeSession = sessions.find((session) => session.id === activeSessionId)

  return (
    <AcademyPage badge={copy.badge} title={copy.title} lead={copy.lead}>
      <p>
        <Link
          to="/academy/cohorts"
          search={{ as: role, lang }}
          className="button button--secondary button--small"
          preload={false}
        >
          {copy.back}
        </Link>
      </p>

      <div className="academy-summary">
        <Notice tone="provisional">{copy.proposedNotice}</Notice>

        <div className="academy-stats">
          <div className="academy-stat">
            <p className="academy-stat__label">{strings.common.cohort}</p>
            <p className="academy-stat__value">{roster.cohort.label}</p>
            <p className="academy-stat__hint">
              {roster.cohort.language.label} · {roster.cohort.level.label} ·{' '}
              {roster.cohort.schedule}
            </p>
          </div>
          <div className="academy-stat">
            <p className="academy-stat__label">{copy.attendanceRate}</p>
            <p className="academy-stat__value">
              {roster.attendanceRate === null
                ? copy.noRate
                : copy.attendanceRateValue(roster.attendanceRate)}
            </p>
            <p className="academy-stat__hint">
              {copy.recordedSessions(
                sessions.filter((session) => session.attendanceRecorded).length,
              )}
            </p>
          </div>
          <div className="academy-stat">
            <p className="academy-stat__label">{strings.common.seats}</p>
            <p className="academy-stat__value">
              {strings.cohorts.seatsLabel(
                roster.cohort.seatsFilled,
                roster.cohort.capacity,
              )}
            </p>
            <p className="academy-stat__hint">
              {formatPercent(
                roster.cohort.capacity === 0
                  ? 0
                  : (roster.cohort.seatsFilled / roster.cohort.capacity) * 100,
                lang,
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="academy-two-col academy-two-col--roster">
        <Section id="roster-sessions" title={copy.sessionsHeading}>
          {sessions.length === 0 ? (
            <EmptyNote
              title={copy.noSessionsTitle}
              body={copy.noSessionsBody}
              icon="clock"
            />
          ) : (
            <ul className="academy-session-list">
              {sessions.map((session) => (
                <li key={session.id}>
                  <button
                    type="button"
                    className={`academy-session${
                      session.id === activeSessionId ? ' is-active' : ''
                    }`}
                    onClick={() => {
                      setSelectedSessionId(session.id)
                      setSaved(false)
                    }}
                    aria-current={session.id === activeSessionId ? 'true' : undefined}
                  >
                    <span className="academy-session__topic">{session.topic}</span>
                    <span className="academy-session__meta">
                      {formatDate(session.startsAt, strings.common.notAvailable, lang)} ·{' '}
                      {copy.duration(session.durationMinutes)}
                    </span>
                    <StatusChip
                      tone={
                        session.status === 'completed'
                          ? 'success'
                          : session.status === 'cancelled'
                            ? 'warning'
                            : 'neutral'
                      }
                      label={strings.status.session[session.status]}
                      icon={session.status === 'completed' ? 'check' : 'clock'}
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section id="roster-members" title={copy.membersHeading}>
          {members.length === 0 ? (
            <EmptyNote
              title={copy.noMembersTitle}
              body={copy.noMembersBody}
              icon="students"
            />
          ) : (
            <div className="academy-table-wrap">
              <table className="academy-table">
                <thead>
                  <tr>
                    <th scope="col">{copy.learner}</th>
                    <th scope="col">{copy.email}</th>
                    <th scope="col">{strings.common.status}</th>
                    <th scope="col">{copy.attendanceRate}</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.learnerId}>
                      <td data-label={copy.learner}>{member.displayName}</td>
                      <td data-label={copy.email}>{member.email}</td>
                      <td data-label={strings.common.status}>
                        <StatusChip
                          tone={member.status === 'active' ? 'success' : 'neutral'}
                          label={strings.status.roster[member.status]}
                          icon={member.status === 'active' ? 'check' : 'clock'}
                        />
                      </td>
                      <td data-label={copy.attendanceRate}>
                        {member.attendance.attendanceRate === null
                          ? copy.noRate
                          : copy.attendanceRateValue(member.attendance.attendanceRate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      </div>

      <Section
        id="roster-sheet"
        title={copy.sheetHeading}
        actions={
          activeSession ? (
            <span className="academy-muted">
              {activeSession.topic} ·{' '}
              {formatDate(activeSession.startsAt, strings.common.notAvailable, lang)}
            </span>
          ) : null
        }
      >
        {activeSessionId === '' ? (
          <p className="academy-muted">{copy.selectSession}</p>
        ) : sheetQuery.isPending ? (
          <LoadingNote />
        ) : sheetQuery.isError || !sheet ? (
          <ErrorNote body={strings.common.loadErrorBody} />
        ) : (
          <>
            {!sheet.session.attendanceRecorded ? (
              <p className="academy-section__lead">{copy.notRecordedNote}</p>
            ) : null}
            <div className="academy-table-wrap">
              <table className="academy-table academy-table--attendance">
                <thead>
                  <tr>
                    <th scope="col">{copy.learner}</th>
                    <th scope="col">{strings.common.status}</th>
                    <th scope="col">{strings.common.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {sheet.records.map((record) => {
                    const member = members.find(
                      (item) => item.learnerId === record.learnerId,
                    )
                    return (
                      <tr key={record.learnerId}>
                        <td data-label={copy.learner}>{member?.displayName ?? record.learnerId}</td>
                        <td data-label={strings.common.status}>
                          <StatusChip
                            tone={
                              attendanceTone[marksByLearner[record.learnerId] ?? 'not_recorded'] ??
                              'neutral'
                            }
                            label={
                              strings.status.attendance[
                                marksByLearner[record.learnerId] ?? 'not_recorded'
                              ]
                            }
                            icon="check"
                          />
                        </td>
                        <td data-label={strings.common.actions}>
                          <span className="academy-mark-group">
                            {marks.map((mark) => (
                              <button
                                key={mark}
                                type="button"
                                className={`button button--small ${
                                  marksByLearner[record.learnerId] === mark
                                    ? 'button--primary'
                                    : 'button--secondary'
                                }`}
                                aria-pressed={marksByLearner[record.learnerId] === mark}
                                onClick={() => {
                                  setSaved(false)
                                  setMarksByLearner((current) => ({
                                    ...current,
                                    [record.learnerId]: mark,
                                  }))
                                }}
                              >
                                {strings.status.attendance[mark]}
                              </button>
                            ))}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="academy-form__actions">
              <button
                type="button"
                className="button button--secondary"
                onClick={() => {
                  setSaved(false)
                  setMarksByLearner(
                    Object.fromEntries(
                      members.map((member) => [member.learnerId, 'present' as const]),
                    ),
                  )
                }}
              >
                {copy.markAllPresent}
              </button>
              <button
                type="button"
                className="button button--primary"
                onClick={() => saveAttendance.mutate()}
                disabled={!allMarked || saveAttendance.isPending}
              >
                {saveAttendance.isPending ? copy.saving : copy.save}
              </button>
            </div>
            {!allMarked ? <p className="academy-muted">{copy.selectAllHint}</p> : null}
            {saved ? (
              <p className="academy-success" role="status">
                {copy.saved}
              </p>
            ) : null}
            {saveAttendance.isError ? (
              <p className="academy-error" role="alert">
                {copy.errorSave}
              </p>
            ) : null}
          </>
        )}
      </Section>
    </AcademyPage>
  )
}
