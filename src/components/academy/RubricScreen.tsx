import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { api } from '~/api'
import type { RubricDimension } from '~/api/types'
import { rubricListQueryOptions, rubricQueryOptions } from '~/api/queries'
import { queryKeys } from '~/api/query-keys'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { StatusChip } from '~/components/dashboard/StatusChip'
import { formatDate, formatPercent } from '~/components/dashboard/format'
import { AcademyPage, ErrorNote, LoadingNote, Notice, Section } from './ui'
import { useLang, useStrings } from '~/shell/useStrings'
import { usePreviewRole } from '~/shell/usePreviewRole'

/**
 * Screen 16 — grading rubric.
 *
 * Data: `rubrics.list`, `rubrics.get`, `rubrics.updateDimension` and
 * `rubrics.publish` (all PROPOSED). Five-dimension coverage is NOT VERIFIED in
 * Mentingo, so an unassessed dimension is rendered as "not assessed" and never
 * given an invented weight. Publishing requires assessed weights to total 100%.
 */

export function RubricListScreen() {
  const strings = useStrings()
  const copy = strings.rubric
  const lang = useLang()
  const role = usePreviewRole()
  const query = useQuery(rubricListQueryOptions())

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
      <Notice tone="provisional">{copy.proposedNotice}</Notice>

      <Section id="rubrics-list" title={copy.listHeading}>
        {data.rubrics.length === 0 ? (
          <EmptyNote title={copy.emptyTitle} body={copy.emptyBody} icon="check" />
        ) : (
          <div className="academy-table-wrap">
            <table className="academy-table">
              <thead>
                <tr>
                  <th scope="col">{copy.title}</th>
                  <th scope="col">{strings.common.language}</th>
                  <th scope="col">{strings.common.level}</th>
                  <th scope="col">{copy.versionHeading}</th>
                  <th scope="col">{strings.common.status}</th>
                  <th scope="col">{strings.common.updatedAt}</th>
                  <th scope="col">{strings.common.actions}</th>
                </tr>
              </thead>
              <tbody>
                {data.rubrics.map((rubric) => (
                  <tr key={rubric.id}>
                    <td data-label={copy.title}>{rubric.title}</td>
                    <td data-label={strings.common.language}>
                      <span lang={rubric.language.code} dir={rubric.language.direction}>
                        {rubric.language.label}
                      </span>
                    </td>
                    <td data-label={strings.common.level}>{rubric.level.label}</td>
                    <td data-label={copy.versionHeading}>{copy.version(rubric.version)}</td>
                    <td data-label={strings.common.status}>
                      <StatusChip
                        tone={rubric.status === 'published' ? 'success' : 'warning'}
                        label={strings.status.rubric[rubric.status]}
                        icon={rubric.status === 'published' ? 'check' : 'pencil'}
                      />
                    </td>
                    <td data-label={strings.common.updatedAt}>
                      {formatDate(rubric.updatedAt, strings.common.notAvailable, lang)}
                    </td>
                    <td data-label={strings.common.actions}>
                      <Link
                        to="/academy/rubrics/$rubricId"
                        params={{ rubricId: rubric.id }}
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
    </AcademyPage>
  )
}

export function RubricScreen({ rubricId }: { rubricId: string }) {
  const strings = useStrings()
  const copy = strings.rubric
  const lang = useLang()
  const role = usePreviewRole()
  const queryClient = useQueryClient()
  const query = useQuery(rubricQueryOptions(rubricId))
  const [weights, setWeights] = useState<Record<string, string>>({})
  const [weightError, setWeightError] = useState<string | null>(null)

  useEffect(() => {
    if (!query.data) return
    const next: Record<string, string> = {}
    for (const dimension of query.data.dimensions) {
      next[dimension.id] = String(dimension.weightPercent)
    }
    setWeights(next)
  }, [query.data])

  const updateDimension = useMutation({
    mutationFn: (dimension: RubricDimension) =>
      api.rubrics.updateDimension({
        rubricId,
        dimensionId: dimension.id,
        weightPercent: Number.parseInt(weights[dimension.id] ?? '0', 10),
        descriptors: dimension.descriptors,
      }),
    onSuccess: () => {
      setWeightError(null)
      void queryClient.invalidateQueries({ queryKey: queryKeys.rubrics.detail(rubricId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.rubrics.list() })
    },
    onError: () => setWeightError(strings.common.loadErrorBody),
  })

  const publish = useMutation({
    mutationFn: () => api.rubrics.publish({ rubricId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.rubrics.detail(rubricId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.rubrics.list() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.academies.dashboard() })
    },
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

  const rubric = query.data
  const assessed = rubric.dimensions.filter((dimension) => dimension.assessed)
  const assessedTotal = assessed.reduce(
    (total, dimension) => total + dimension.weightPercent,
    0,
  )
  const canPublish =
    role === 'academy' &&
    rubric.status !== 'published' &&
    assessed.length > 0 &&
    assessedTotal === 100

  return (
    <AcademyPage badge={copy.badge} title={rubric.title} lead={copy.lead}>
      <p>
        <Link
          to="/academy/rubrics"
          search={{ as: role, lang }}
          className="button button--secondary button--small"
          preload={false}
        >
          {copy.back}
        </Link>
      </p>

      <Notice tone="provisional">{copy.proposedNotice}</Notice>

      <div className="academy-stats">
        <div className="academy-stat">
          <p className="academy-stat__label">{strings.common.language}</p>
          <p className="academy-stat__value">
            <span lang={rubric.language.code} dir={rubric.language.direction}>
              {rubric.language.label}
            </span>
          </p>
          <p className="academy-stat__hint">{rubric.level.label}</p>
        </div>
        <div className="academy-stat">
          <p className="academy-stat__label">{copy.weightTotal}</p>
          <p className="academy-stat__value">
            {formatPercent(assessedTotal, lang)}
          </p>
          <p className="academy-stat__hint">
            {copy.version(rubric.version)} · {copy.assessed}: {assessed.length}
          </p>
        </div>
        <div className="academy-stat">
          <p className="academy-stat__label">{strings.common.status}</p>
          <p className="academy-stat__value">
            <StatusChip
              tone={rubric.status === 'published' ? 'success' : 'warning'}
              label={strings.status.rubric[rubric.status]}
              icon={rubric.status === 'published' ? 'check' : 'pencil'}
            />
          </p>
          <p className="academy-stat__hint">
            {copy.updatedAt}{' '}
            {formatDate(rubric.updatedAt, strings.common.notAvailable, lang)}
          </p>
        </div>
      </div>

      <Section
        id="rubric-dimensions"
        title={copy.dimensionsHeading}
        actions={
          role === 'academy' ? (
            <button
              type="button"
              className="button button--primary button--small"
              onClick={() => publish.mutate()}
              disabled={publish.isPending || !canPublish}
            >
              {rubric.status === 'published' ? copy.published : copy.publish}
            </button>
          ) : null
        }
      >
        <div className="academy-table-wrap">
          <table className="academy-table academy-table--rubric">
            <thead>
              <tr>
                <th scope="col">{copy.dimension}</th>
                <th scope="col">{copy.assessed}</th>
                <th scope="col">{copy.weight}</th>
                <th scope="col">{copy.descriptors}</th>
              </tr>
            </thead>
            <tbody>
              {rubric.dimensions.map((dimension) => (
                <tr key={dimension.id}>
                  <td data-label={copy.dimension}>{strings.status.dimension[dimension.key]}</td>
                  <td data-label={copy.assessed}>
                    <StatusChip
                      tone={dimension.assessed ? 'success' : 'neutral'}
                      label={
                        dimension.assessed ? copy.assessed : copy.notAssessed
                      }
                      icon={dimension.assessed ? 'check' : 'clock'}
                    />
                  </td>
                  <td data-label={copy.weight}>
                    {dimension.assessed && role === 'academy' ? (
                      <span className="academy-weight">
                        <input
                          className="input input--weight"
                          type="number"
                          min={0}
                          max={100}
                          aria-label={`${strings.status.dimension[dimension.key]} — ${copy.weight}`}
                          value={weights[dimension.id] ?? ''}
                          onChange={(event) =>
                            setWeights((current) => ({
                              ...current,
                              [dimension.id]: event.target.value,
                            }))
                          }
                        />
                        <button
                          type="button"
                          className="button button--secondary button--small"
                          onClick={() => {
                            const value = Number.parseInt(
                              weights[dimension.id] ?? '',
                              10,
                            )
                            if (!Number.isFinite(value) || value < 0 || value > 100) {
                              setWeightError(copy.errorWeight)
                              return
                            }
                            setWeightError(null)
                            updateDimension.mutate(dimension)
                          }}
                          disabled={updateDimension.isPending}
                        >
                          {updateDimension.isPending
                            ? copy.saving
                            : copy.saveWeight}
                        </button>
                      </span>
                    ) : (
                      <span>{formatPercent(dimension.weightPercent, lang)}</span>
                    )}
                  </td>
                  <td data-label={copy.descriptors}>
                    <ul className="academy-descriptors">
                      {dimension.descriptors.map((descriptor) => (
                        <li key={`${dimension.id}-${descriptor.band}`}>
                          <strong>{copy.band(descriptor.band)}</strong>{' '}
                          {descriptor.label}: {descriptor.descriptor}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="academy-section__lead">{copy.publishNote}</p>
        <dl className="summary-list">
          <div>
            <dt>{copy.coverageNote}</dt>
            <dd>{rubric.coverageNote ?? copy.noCoverageNote}</dd>
          </div>
        </dl>

        {weightError ? (
          <p className="academy-error" role="alert">
            {weightError}
          </p>
        ) : null}
        {publish.isError ? (
          <p className="academy-error" role="alert">
            {copy.publishNote}
          </p>
        ) : null}
      </Section>
    </AcademyPage>
  )
}
