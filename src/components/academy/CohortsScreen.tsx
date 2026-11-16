import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { api } from '~/api'
import { isApiError } from '~/api/errors'
import { cohortListQueryOptions } from '~/api/queries'
import { queryKeys } from '~/api/query-keys'
import { StatusChip, type StatusTone } from '~/components/dashboard/StatusChip'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { AcademyPage, ErrorNote, LoadingNote, Notice, Section } from './ui'
import { useLang, useStrings } from '~/shell/useStrings'
import { usePreviewRole } from '~/shell/usePreviewRole'

/**
 * Screen 13 — cohort builder and seat publisher.
 *
 * Data: `cohorts.list`, `cohorts.create` and `cohorts.publish` (all PROPOSED).
 * Language, level and instructor choices come from the adapter response; they
 * are never hard-coded in the screen.
 */

const cohortTone: Record<string, StatusTone> = {
  active: 'success',
  published: 'neutral',
  draft: 'warning',
  completed: 'neutral',
}

interface CohortFormState {
  label: string
  languageId: string
  levelId: string
  schedule: string
  capacity: string
  instructorId: string
  startDate: string
  endDate: string
}

const emptyForm: CohortFormState = {
  label: '',
  languageId: '',
  levelId: '',
  schedule: '',
  capacity: '',
  instructorId: '',
  startDate: '',
  endDate: '',
}

export function CohortsScreen() {
  const strings = useStrings()
  const copy = strings.cohorts
  const lang = useLang()
  const role = usePreviewRole()
  const queryClient = useQueryClient()
  const query = useQuery(cohortListQueryOptions())
  const [form, setForm] = useState<CohortFormState>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  const createCohort = useMutation({
    mutationFn: () =>
      api.cohorts.create({
        label: form.label,
        languageId: form.languageId,
        levelId: form.levelId,
        schedule: form.schedule,
        capacity: Number.parseInt(form.capacity, 10),
        instructorId: form.instructorId,
        startDate: form.startDate,
        endDate: form.endDate,
      }),
    onSuccess: () => {
      setForm(emptyForm)
      setFormError(null)
      void queryClient.invalidateQueries({ queryKey: queryKeys.cohorts.list() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.academies.dashboard() })
    },
    onError: (error) => {
      setFormError(isApiError(error) ? error.message : strings.common.loadErrorBody)
    },
  })

  const publishCohort = useMutation({
    mutationFn: (cohortId: string) => api.cohorts.publish({ cohortId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.cohorts.list() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.academies.dashboard() })
    },
  })

  function update<K extends keyof CohortFormState>(key: K, value: CohortFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function submit() {
    const capacity = Number.parseInt(form.capacity, 10)
    if (
      !form.label.trim() ||
      !form.languageId ||
      !form.levelId ||
      !form.instructorId ||
      !form.startDate ||
      !form.endDate
    ) {
      setFormError(copy.validation.required)
      return
    }
    if (!Number.isFinite(capacity) || capacity < 1 || capacity > 200) {
      setFormError(copy.validation.capacity)
      return
    }
    setFormError(null)
    createCohort.mutate()
  }

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
        <ErrorNote body={copy.loadListError} />
      </AcademyPage>
    )
  }

  const data = query.data
  const publishError = publishCohort.error

  return (
    <AcademyPage badge={copy.badge} title={copy.title} lead={copy.lead}>
      <Section id="cohorts-list" title={copy.listHeading}>
        {data.cohorts.length === 0 ? (
          <EmptyNote title={copy.emptyTitle} body={copy.emptyBody} icon="classes" />
        ) : (
          <div className="academy-table-wrap">
            <table className="academy-table academy-table--cohorts">
              <thead>
                <tr>
                  <th scope="col">{strings.common.cohort}</th>
                  <th scope="col">{strings.common.language}</th>
                  <th scope="col">{strings.common.level}</th>
                  <th scope="col">{strings.common.schedule}</th>
                  <th scope="col">{strings.common.seats}</th>
                  <th scope="col">{strings.common.instructor}</th>
                  <th scope="col">{strings.common.status}</th>
                  <th scope="col">{strings.common.actions}</th>
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
                    <td data-label={strings.common.schedule}>{cohort.schedule}</td>
                    <td data-label={strings.common.seats}>
                      {copy.seatsLabel(cohort.seatsFilled, cohort.capacity)}
                    </td>
                    <td data-label={strings.common.instructor}>
                      {cohort.instructor?.displayName ?? strings.common.notAvailable}
                    </td>
                    <td data-label={strings.common.status}>
                      <StatusChip
                        tone={cohortTone[cohort.status] ?? 'neutral'}
                        label={strings.status.cohort[cohort.status]}
                        icon={cohort.status === 'active' ? 'check' : 'clock'}
                      />
                    </td>
                    <td data-label={strings.common.actions}>
                      <span className="academy-row-actions">
                        <Link
                          to="/academy/cohorts/$cohortId"
                          params={{ cohortId: cohort.id }}
                          search={{ as: role, lang }}
                          className="button button--secondary button--small"
                          preload={false}
                        >
                          {copy.openRoster}
                        </Link>
                        {cohort.status === 'draft' ? (
                          <button
                            type="button"
                            className="button button--primary button--small"
                            onClick={() => publishCohort.mutate(cohort.id)}
                            disabled={publishCohort.isPending}
                          >
                            {copy.publish}
                          </button>
                        ) : (
                          <span className="academy-muted">{copy.published}</span>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Notice>{copy.publishNote}</Notice>
        {publishCohort.isError ? (
          <p className="academy-error" role="alert">
            {isApiError(publishError) && publishError.code === 'CONFLICT'
              ? copy.conflict
              : strings.common.loadErrorBody}
          </p>
        ) : null}
      </Section>

      {role === 'academy' ? (
        <Section id="cohorts-create" title={copy.createHeading}>
          <form
            className="academy-form"
            onSubmit={(event) => {
              event.preventDefault()
              submit()
            }}
          >
            <label className="field academy-form__wide">
              <span className="field__label">{copy.form.label}</span>
              <input
                className="input"
                value={form.label}
                onChange={(event) => update('label', event.target.value)}
                placeholder={copy.form.labelPlaceholder}
              />
            </label>

            <label className="field">
              <span className="field__label">{copy.form.language}</span>
              <select
                className="input"
                value={form.languageId}
                onChange={(event) => update('languageId', event.target.value)}
              >
                <option value="">{copy.form.selectPlaceholder}</option>
                {data.languages.map((language) => (
                  <option key={language.id} value={language.id}>
                    {language.label} · {language.code.toUpperCase()}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="field__label">{copy.form.level}</span>
              <select
                className="input"
                value={form.levelId}
                onChange={(event) => update('levelId', event.target.value)}
              >
                <option value="">{copy.form.selectPlaceholder}</option>
                {data.levels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="field__label">{copy.form.instructor}</span>
              <select
                className="input"
                value={form.instructorId}
                onChange={(event) => update('instructorId', event.target.value)}
              >
                <option value="">{copy.form.selectPlaceholder}</option>
                {data.instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.displayName}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="field__label">{copy.form.capacity}</span>
              <input
                className="input"
                type="number"
                min={1}
                max={200}
                value={form.capacity}
                onChange={(event) => update('capacity', event.target.value)}
              />
            </label>

            <label className="field academy-form__wide">
              <span className="field__label">{copy.form.schedule}</span>
              <input
                className="input"
                value={form.schedule}
                onChange={(event) => update('schedule', event.target.value)}
                placeholder={copy.form.schedulePlaceholder}
              />
            </label>

            <label className="field">
              <span className="field__label">{copy.form.startDate}</span>
              <input
                className="input"
                type="date"
                value={form.startDate}
                onChange={(event) => update('startDate', event.target.value)}
              />
            </label>

            <label className="field">
              <span className="field__label">{copy.form.endDate}</span>
              <input
                className="input"
                type="date"
                value={form.endDate}
                onChange={(event) => update('endDate', event.target.value)}
              />
            </label>

            <div className="academy-form__actions">
              <button
                type="submit"
                className="button button--primary"
                disabled={createCohort.isPending}
              >
                {createCohort.isPending ? copy.form.submitting : copy.form.submit}
              </button>
            </div>
          </form>

          {formError ? (
            <p className="academy-error" role="alert">
              {formError}
            </p>
          ) : null}
          {createCohort.isSuccess ? (
            <p className="academy-success" role="status">
              {copy.createdNote}
            </p>
          ) : null}
          <Notice>{copy.priceNote}</Notice>
        </Section>
      ) : null}
    </AcademyPage>
  )
}
