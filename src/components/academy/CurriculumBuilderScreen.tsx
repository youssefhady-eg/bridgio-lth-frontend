import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { api } from '~/api'
import type { LessonKind, MohsenCurriculumDraft } from '~/api/types'
import {
  curriculumQueryOptions,
  languagesQueryOptions,
} from '~/api/queries'
import { queryKeys } from '~/api/query-keys'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { StatusChip } from '~/components/dashboard/StatusChip'
import { formatDate } from '~/components/dashboard/format'
import { AcademyPage, ErrorNote, LoadingNote, Notice, Section } from './ui'
import { useLang, useStrings } from '~/shell/useStrings'
import { usePreviewRole } from '~/shell/usePreviewRole'

/**
 * Screen 15 — curriculum and lesson builder.
 *
 * Data: `curricula.get`, `curricula.addUnit`, `curricula.addLesson`,
 * `curricula.publish`, `curricula.draftOutline` and `languages.list` (all
 * PROPOSED). Every lesson keeps its own content language, and the lesson block
 * sets `lang`/`dir` from that record — the UI language never leaks into it.
 */

const lessonKinds: LessonKind[] = ['lesson', 'practice', 'assessment']

export function CurriculumBuilderScreen({ curriculumId }: { curriculumId: string }) {
  const strings = useStrings()
  const copy = strings.curriculum
  const lang = useLang()
  const role = usePreviewRole()
  const queryClient = useQueryClient()
  const query = useQuery(curriculumQueryOptions(curriculumId))
  const languagesQuery = useQuery(languagesQueryOptions())

  const [unitTitle, setUnitTitle] = useState('')
  const [unitObjective, setUnitObjective] = useState('')
  const [lessonUnitId, setLessonUnitId] = useState('')
  const [lessonTitle, setLessonTitle] = useState('')
  const [lessonObjective, setLessonObjective] = useState('')
  const [lessonDuration, setLessonDuration] = useState('45')
  const [lessonKind, setLessonKind] = useState<LessonKind>('lesson')
  const [lessonLanguageId, setLessonLanguageId] = useState('')
  const [draftUnitTitle, setDraftUnitTitle] = useState('')
  const [draftLessonCount, setDraftLessonCount] = useState('4')
  const [draft, setDraft] = useState<MohsenCurriculumDraft | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  function invalidate() {
    void queryClient.invalidateQueries({
      queryKey: queryKeys.curricula.detail(curriculumId),
    })
    void queryClient.invalidateQueries({ queryKey: queryKeys.curricula.list() })
  }

  const addUnit = useMutation({
    mutationFn: (input: { title: string; objective: string }) =>
      api.curricula.addUnit({
        curriculumId,
        title: input.title,
        objective: input.objective,
      }),
    onSuccess: () => {
      setUnitTitle('')
      setUnitObjective('')
      setDraft(null)
      setFormError(null)
      invalidate()
    },
    onError: () => setFormError(strings.common.loadErrorBody),
  })

  const addLesson = useMutation({
    mutationFn: () =>
      api.curricula.addLesson({
        curriculumId,
        unitId: lessonUnitId,
        title: lessonTitle,
        objective: lessonObjective,
        durationMinutes: Number.parseInt(lessonDuration, 10),
        contentLanguageId: lessonLanguageId,
        kind: lessonKind,
      }),
    onSuccess: () => {
      setLessonTitle('')
      setLessonObjective('')
      setFormError(null)
      invalidate()
    },
    onError: () => setFormError(strings.common.loadErrorBody),
  })

  const publish = useMutation({
    mutationFn: () => api.curricula.publish({ curriculumId }),
    onSuccess: () => invalidate(),
  })

  const draftOutline = useMutation({
    mutationFn: () =>
      api.curricula.draftOutline({
        curriculumId,
        unitTitle: draftUnitTitle,
        lessonCount: Number.parseInt(draftLessonCount, 10),
      }),
    onSuccess: (result) => setDraft(result),
    onError: () => setFormError(copy.mohsen.error),
  })

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

  const curriculum = query.data
  const languages = languagesQuery.data ?? []
  const lessonCount = curriculum.units.reduce(
    (total, unit) => total + unit.lessons.length,
    0,
  )

  return (
    <AcademyPage badge={copy.badge} title={curriculum.title} lead={copy.lead}>
      <p>
        <Link
          to="/academy/curriculum"
          search={{ as: role, lang }}
          className="button button--secondary button--small"
          preload={false}
        >
          {copy.detail.back}
        </Link>
      </p>

      <div className="academy-stats">
        <div className="academy-stat">
          <p className="academy-stat__label">{strings.common.language}</p>
          <p className="academy-stat__value">
            <span lang={curriculum.language.code} dir={curriculum.language.direction}>
              {curriculum.language.label}
            </span>
          </p>
          <p className="academy-stat__hint">
            {copy.detail.contentDirection(
              strings.onboarding.directionLabels[curriculum.language.direction],
            )}
          </p>
        </div>
        <div className="academy-stat">
          <p className="academy-stat__label">{strings.common.level}</p>
          <p className="academy-stat__value">{curriculum.level.label}</p>
          <p className="academy-stat__hint">
            {copy.unitsCount(curriculum.units.length)} ·{' '}
            {copy.lessonsCount(lessonCount)}
          </p>
        </div>
        <div className="academy-stat">
          <p className="academy-stat__label">{strings.common.status}</p>
          <p className="academy-stat__value">
            <StatusChip
              tone={curriculum.status === 'published' ? 'success' : 'warning'}
              label={
                curriculum.status === 'published'
                  ? strings.status.rubric.published
                  : strings.status.rubric.draft
              }
              icon={curriculum.status === 'published' ? 'check' : 'pencil'}
            />
          </p>
          <p className="academy-stat__hint">
            {copy.detail.updatedAt}{' '}
            {formatDate(curriculum.updatedAt, strings.common.notAvailable, lang)}
          </p>
        </div>
      </div>

      <Section
        id="curriculum-units"
        title={copy.detail.unitsHeading}
        actions={
          role === 'academy' ? (
            <button
              type="button"
              className="button button--primary button--small"
              onClick={() => publish.mutate()}
              disabled={
                publish.isPending ||
                curriculum.status === 'published' ||
                lessonCount === 0
              }
            >
              {curriculum.status === 'published'
                ? copy.detail.published
                : copy.detail.publish}
            </button>
          ) : null
        }
      >
        {curriculum.units.length === 0 ? (
          <EmptyNote
            title={copy.detail.emptyUnitsTitle}
            body={copy.detail.emptyUnitsBody}
            icon="book"
          />
        ) : (
          <ol className="curriculum-units">
            {curriculum.units.map((unit) => (
              <li key={unit.id} className="curriculum-unit">
                <header className="curriculum-unit__head">
                  <h3>{unit.title}</h3>
                  <p className="academy-muted">{unit.objective}</p>
                </header>
                {unit.lessons.length === 0 ? (
                  <p className="academy-muted">{copy.detail.noLessons}</p>
                ) : (
                  <ul className="curriculum-lessons">
                    {unit.lessons.map((lesson) => (
                      <li key={lesson.id} className="curriculum-lesson">
                        <div
                          className="curriculum-lesson__body"
                          lang={lesson.contentLanguage.code}
                          dir={lesson.contentLanguage.direction}
                        >
                          <h4>{lesson.title}</h4>
                          <p>{lesson.objective}</p>
                          <p className="academy-muted">
                            {copy.detail.contentDirection(
                              strings.onboarding.directionLabels[
                                lesson.contentLanguage.direction
                              ],
                            )}{' '}
                            · {lesson.contentLanguage.label}
                          </p>
                        </div>
                        <div className="curriculum-lesson__meta">
                          <span className="academy-tag">
                            {strings.status.lessonKind[lesson.kind]}
                          </span>
                          <span className="academy-muted">
                            {copy.detail.duration(lesson.durationMinutes)}
                          </span>
                          <span className="academy-muted">
                            {copy.detail.materials(lesson.materials.length)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        )}
        <Notice>{copy.detail.publishNote}</Notice>
        {publish.isError ? (
          <p className="academy-error" role="alert">
            {copy.detail.errorPublish}
          </p>
        ) : null}
      </Section>

      {role === 'academy' ? (
        <div className="academy-two-col">
          <Section id="curriculum-add-unit" title={copy.detail.addUnitHeading}>
            <form
              className="academy-form academy-form--single"
              onSubmit={(event) => {
                event.preventDefault()
                if (!unitTitle.trim() || !unitObjective.trim()) {
                  setFormError(copy.validation.required)
                  return
                }
                addUnit.mutate({ title: unitTitle, objective: unitObjective })
              }}
            >
              <label className="field">
                <span className="field__label">{copy.detail.unitTitle}</span>
                <input
                  className="input"
                  value={unitTitle}
                  onChange={(event) => setUnitTitle(event.target.value)}
                />
              </label>
              <label className="field">
                <span className="field__label">{copy.detail.unitObjective}</span>
                <textarea
                  className="input"
                  rows={2}
                  value={unitObjective}
                  onChange={(event) => setUnitObjective(event.target.value)}
                />
              </label>
              <div className="academy-form__actions">
                <button
                  type="submit"
                  className="button button--primary"
                  disabled={addUnit.isPending}
                >
                  {copy.detail.addUnit}
                </button>
              </div>
            </form>
          </Section>

          <Section id="curriculum-add-lesson" title={copy.detail.addLessonHeading}>
            <form
              className="academy-form academy-form--single"
              onSubmit={(event) => {
                event.preventDefault()
                const duration = Number.parseInt(lessonDuration, 10)
                if (
                  !lessonUnitId ||
                  !lessonTitle.trim() ||
                  !lessonObjective.trim() ||
                  !lessonLanguageId
                ) {
                  setFormError(copy.validation.required)
                  return
                }
                if (!Number.isFinite(duration) || duration < 5 || duration > 240) {
                  setFormError(copy.validation.duration)
                  return
                }
                addLesson.mutate()
              }}
            >
              <label className="field">
                <span className="field__label">{copy.detail.unitsHeading}</span>
                <select
                  className="input"
                  value={lessonUnitId}
                  onChange={(event) => setLessonUnitId(event.target.value)}
                >
                  <option value="">{strings.cohorts.form.selectPlaceholder}</option>
                  {curriculum.units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span className="field__label">{copy.detail.lessonTitle}</span>
                <input
                  className="input"
                  value={lessonTitle}
                  onChange={(event) => setLessonTitle(event.target.value)}
                />
              </label>
              <label className="field">
                <span className="field__label">{copy.detail.lessonObjective}</span>
                <textarea
                  className="input"
                  rows={2}
                  value={lessonObjective}
                  onChange={(event) => setLessonObjective(event.target.value)}
                />
              </label>
              <div className="academy-inline-fields">
                <label className="field">
                  <span className="field__label">{copy.detail.lessonDuration}</span>
                  <input
                    className="input"
                    type="number"
                    min={5}
                    max={240}
                    value={lessonDuration}
                    onChange={(event) => setLessonDuration(event.target.value)}
                  />
                </label>
                <label className="field">
                  <span className="field__label">{copy.detail.lessonKind}</span>
                  <select
                    className="input"
                    value={lessonKind}
                    onChange={(event) =>
                      setLessonKind(event.target.value as LessonKind)
                    }
                  >
                    {lessonKinds.map((kind) => (
                      <option key={kind} value={kind}>
                        {strings.status.lessonKind[kind]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="field">
                <span className="field__label">{copy.detail.contentLanguage}</span>
                <select
                  className="input"
                  value={lessonLanguageId}
                  onChange={(event) => setLessonLanguageId(event.target.value)}
                >
                  <option value="">{strings.cohorts.form.selectPlaceholder}</option>
                  {languages.map((language) => (
                    <option key={language.id} value={language.id}>
                      {language.label} · {language.code.toUpperCase()}
                    </option>
                  ))}
                </select>
              </label>
              <div className="academy-form__actions">
                <button
                  type="submit"
                  className="button button--primary"
                  disabled={addLesson.isPending}
                >
                  {copy.detail.addLesson}
                </button>
              </div>
            </form>
          </Section>
        </div>
      ) : null}

      {role === 'academy' ? (
        <Section id="curriculum-mohsen" title={copy.mohsen.heading} lead={copy.mohsen.lead}>
          <form
            className="academy-form academy-form--single"
            onSubmit={(event) => {
              event.preventDefault()
              if (!draftUnitTitle.trim()) {
                setFormError(copy.validation.required)
                return
              }
              draftOutline.mutate()
            }}
          >
            <label className="field">
              <span className="field__label">{copy.mohsen.unitTitle}</span>
              <input
                className="input"
                value={draftUnitTitle}
                onChange={(event) => setDraftUnitTitle(event.target.value)}
              />
            </label>
            <label className="field">
              <span className="field__label">{copy.mohsen.lessonCount}</span>
              <input
                className="input"
                type="number"
                min={1}
                max={6}
                value={draftLessonCount}
                onChange={(event) => setDraftLessonCount(event.target.value)}
              />
            </label>
            <div className="academy-form__actions">
              <button
                type="submit"
                className="button button--secondary"
                disabled={draftOutline.isPending}
              >
                {draftOutline.isPending ? copy.mohsen.submitting : copy.mohsen.submit}
              </button>
            </div>
          </form>

          {draft ? (
            <div className="academy-draft">
              <h3>{copy.mohsen.resultHeading}</h3>
              {draft.units.map((unit) => (
                <div key={unit.title} className="academy-draft__unit">
                  <h4>{unit.title}</h4>
                  <p>{unit.objective}</p>
                  <ul>
                    {unit.lessons.map((lesson) => (
                      <li key={lesson.title}>
                        {lesson.title} · {copy.detail.duration(lesson.durationMinutes)} ·{' '}
                        {strings.status.lessonKind[lesson.kind]}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="button button--primary button--small"
                    onClick={() =>
                      addUnit.mutate({ title: unit.title, objective: unit.objective })
                    }
                    disabled={addUnit.isPending}
                  >
                    {copy.mohsen.addUnit}
                  </button>
                </div>
              ))}
              <h4>{copy.mohsen.grounding}</h4>
              <ul className="academy-tag-list">
                {draft.grounding.map((ref) => (
                  <li key={ref.id} className="academy-tag">
                    {ref.label}
                  </li>
                ))}
              </ul>
              <Notice>{copy.mohsen.disclaimer}</Notice>
            </div>
          ) : null}
        </Section>
      ) : null}

      {formError ? (
        <p className="academy-error" role="alert">
          {formError}
        </p>
      ) : null}
      <Notice>{strings.common.provisionalFigures}</Notice>
    </AcademyPage>
  )
}
