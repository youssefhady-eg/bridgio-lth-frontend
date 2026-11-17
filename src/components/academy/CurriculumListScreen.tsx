import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { api } from '~/api'
import { curriculumListQueryOptions } from '~/api/queries'
import { queryKeys } from '~/api/query-keys'
import { formatDate } from '~/components/dashboard/format'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { StatusChip } from '~/components/dashboard/StatusChip'
import { AcademyPage, ErrorNote, LoadingNote, Notice, Section } from './ui'
import { useLang, useStrings } from '~/shell/useStrings'
import { usePreviewRole } from '~/shell/usePreviewRole'

/**
 * Screen 15 — curriculum list and start of the builder.
 *
 * Data: `curricula.list` and `curricula.create` (PROPOSED). Language and level
 * choices come from the adapter response, never a hard-coded list.
 */

interface CurriculumFormState {
  title: string
  description: string
  languageId: string
  levelId: string
}

const emptyForm: CurriculumFormState = {
  title: '',
  description: '',
  languageId: '',
  levelId: '',
}

export function CurriculumListScreen() {
  const strings = useStrings()
  const copy = strings.curriculum
  const lang = useLang()
  const role = usePreviewRole()
  const queryClient = useQueryClient()
  const query = useQuery(curriculumListQueryOptions())
  const [form, setForm] = useState<CurriculumFormState>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  const createCurriculum = useMutation({
    mutationFn: () =>
      api.curricula.create({
        title: form.title,
        description: form.description,
        languageId: form.languageId,
        levelId: form.levelId,
      }),
    onSuccess: () => {
      setForm(emptyForm)
      setFormError(null)
      void queryClient.invalidateQueries({ queryKey: queryKeys.curricula.list() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.academies.dashboard() })
    },
    onError: () => setFormError(strings.common.loadErrorBody),
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

  const data = query.data

  return (
    <AcademyPage badge={copy.badge} title={copy.title} lead={copy.lead}>
      <Section id="curricula-list" title={copy.listHeading}>
        {data.curricula.length === 0 ? (
          <EmptyNote title={copy.emptyTitle} body={copy.emptyBody} icon="book" />
        ) : (
          <div className="academy-table-wrap">
            <table className="academy-table">
              <thead>
                <tr>
                  <th scope="col">{copy.form.title}</th>
                  <th scope="col">{strings.common.language}</th>
                  <th scope="col">{strings.common.level}</th>
                  <th scope="col">{copy.detail.unitsHeading}</th>
                  <th scope="col">{copy.detail.lessonsHeading}</th>
                  <th scope="col">{strings.common.status}</th>
                  <th scope="col">{strings.common.updatedAt}</th>
                  <th scope="col">{strings.common.actions}</th>
                </tr>
              </thead>
              <tbody>
                {data.curricula.map((curriculum) => (
                  <tr key={curriculum.id}>
                    <td>{curriculum.title}</td>
                    <td>
                      <span
                        lang={curriculum.language.code}
                        dir={curriculum.language.direction}
                      >
                        {curriculum.language.label}
                      </span>
                    </td>
                    <td>{curriculum.level.label}</td>
                    <td>{copy.unitsCount(curriculum.unitCount)}</td>
                    <td>{copy.lessonsCount(curriculum.lessonCount)}</td>
                    <td>
                      <StatusChip
                        tone={curriculum.status === 'published' ? 'success' : 'warning'}
                        label={
                          curriculum.status === 'published'
                            ? strings.status.rubric.published
                            : strings.status.rubric.draft
                        }
                        icon={curriculum.status === 'published' ? 'check' : 'pencil'}
                      />
                    </td>
                    <td>
                      {formatDate(curriculum.updatedAt, strings.common.notAvailable, lang)}
                    </td>
                    <td>
                      <Link
                        to="/academy/curriculum/$curriculumId"
                        params={{ curriculumId: curriculum.id }}
                        search={{ as: role, lang }}
                        className="button button--secondary button--small"
                        preload={false}
                      >
                        {copy.open}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {role === 'academy' ? (
        <Section id="curricula-create" title={copy.createHeading}>
          <form
            className="academy-form"
            onSubmit={(event) => {
              event.preventDefault()
              if (
                !form.title.trim() ||
                !form.description.trim() ||
                !form.languageId ||
                !form.levelId
              ) {
                setFormError(copy.validation.required)
                return
              }
              setFormError(null)
              createCurriculum.mutate()
            }}
          >
            <label className="field academy-form__wide">
              <span className="field__label">{copy.form.title}</span>
              <input
                className="input"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
              />
            </label>
            <label className="field academy-form__wide">
              <span className="field__label">{copy.form.description}</span>
              <textarea
                className="input"
                rows={3}
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
              />
            </label>
            <label className="field">
              <span className="field__label">{copy.form.language}</span>
              <select
                className="input"
                value={form.languageId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    languageId: event.target.value,
                  }))
                }
              >
                <option value="">{strings.cohorts.form.selectPlaceholder}</option>
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
                onChange={(event) =>
                  setForm((current) => ({ ...current, levelId: event.target.value }))
                }
              >
                <option value="">{strings.cohorts.form.selectPlaceholder}</option>
                {data.levels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="academy-form__actions">
              <button
                type="submit"
                className="button button--primary"
                disabled={createCurriculum.isPending}
              >
                {createCurriculum.isPending
                  ? copy.form.submitting
                  : copy.form.submit}
              </button>
            </div>
          </form>
          {formError ? (
            <p className="academy-error" role="alert">
              {formError}
            </p>
          ) : null}
          {createCurriculum.isSuccess ? (
            <p className="academy-success" role="status">
              {copy.createdNote}
            </p>
          ) : null}
          <Notice>{strings.common.demoNotice}</Notice>
        </Section>
      ) : null}
    </AcademyPage>
  )
}
