import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '~/api'
import type { OnboardingStepId } from '~/api/types'
import { academyOnboardingQueryOptions } from '~/api/queries'
import { queryKeys } from '~/api/query-keys'
import { AcademyPage, ErrorNote, LoadingNote, Notice, Section } from './ui'
import { StatusChip, type StatusTone } from '~/components/dashboard/StatusChip'
import { MetaList } from '~/components/shared/MetaList'
import { ProgressBar } from '~/components/dashboard/ProgressBar'
import { formatPercent } from '~/components/dashboard/format'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Screen 11 — partner onboarding and calibration.
 *
 * Data: `academies.getOnboarding` (PROPOSED) and the mutation
 * `academies.completeOnboardingStep` (PROPOSED). Calibration, reviewer and
 * appeal-owner values are backend data; the screen never derives them.
 */

const stepTone: Record<string, StatusTone> = {
  complete: 'success',
  in_progress: 'warning',
  pending: 'neutral',
  blocked: 'warning',
}

export function OnboardingScreen() {
  const strings = useStrings()
  const copy = strings.onboarding
  const lang = useLang()
  const queryClient = useQueryClient()
  const query = useQuery(academyOnboardingQueryOptions())

  const completeStep = useMutation({
    mutationFn: (stepId: OnboardingStepId) =>
      api.academies.completeOnboardingStep({
        academyId: query.data?.academy.id ?? '',
        stepId,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.academies.onboarding() })
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
        <ErrorNote body={strings.common.loadErrorBody} />
      </AcademyPage>
    )
  }

  const data = query.data
  const calibration = data.calibration

  return (
    <AcademyPage badge={copy.badge} title={copy.title} lead={copy.lead}>
      <Section
        id="onboarding-progress"
        title={copy.stepsHeading}
        actions={<span className="academy-tag">{copy.completion(data.completionPercent)}</span>}
      >
        <ProgressBar
          percent={data.completionPercent}
          label={copy.completion(data.completionPercent)}
          valueText={formatPercent(data.completionPercent, lang)}
        />
        <ol className="onboarding-steps">
          {data.steps.map((step) => {
            const item = copy.steps[step.id]
            return (
              <li
                key={step.id}
                className={`onboarding-step${step.status === 'complete' ? ' is-complete' : ''}`}
              >
                <div className="onboarding-step__body">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
                <div className="onboarding-step__aside">
                  <StatusChip
                    tone={stepTone[step.status] ?? 'neutral'}
                    label={strings.status.onboarding[step.status]}
                    icon={step.status === 'complete' ? 'check' : 'clock'}
                  />
                  {step.status === 'complete' ? (
                    <p className="academy-muted">{copy.complete}</p>
                  ) : (
                    <button
                      type="button"
                      className="button button--secondary button--small"
                      onClick={() => completeStep.mutate(step.id)}
                      disabled={
                        completeStep.isPending || step.status === 'blocked'
                      }
                    >
                      {copy.markComplete}
                    </button>
                  )}
                  {step.status === 'blocked' ? (
                    <p className="academy-muted">{copy.blockedNote}</p>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ol>
      </Section>

      <Section id="onboarding-calibration" title={copy.calibrationHeading}>
        <MetaList
          items={[
            {
              label: strings.common.status,
              value: (
                <StatusChip
                  tone={
                    calibration.status === 'calibrated'
                      ? 'success'
                      : calibration.status === 'changes_requested'
                        ? 'warning'
                        : 'neutral'
                  }
                  label={strings.status.calibration[calibration.status]}
                  icon={calibration.status === 'calibrated' ? 'check' : 'clock'}
                />
              ),
            },
            {
              label: copy.reviewer,
              value: calibration.reviewerRole ?? strings.common.notAvailable,
            },
            {
              label: copy.rubricVersion,
              value: calibration.rubricVersion ?? strings.common.notAvailable,
            },
            {
              label: copy.appealOwner,
              value: calibration.appealOwnerReady
                ? copy.appealOwnerReady
                : copy.appealOwnerMissing,
            },
            {
              label: copy.calibrationHeading,
              value: copy.samples(
                calibration.sampleLessonsReviewed,
                calibration.sampleLessonsRequired,
              ),
            },
          ]}
        />
        <p className="academy-section__lead">{copy.calibrationBody}</p>
      </Section>

      <Section id="onboarding-languages" title={copy.languagesHeading}>
        <ul className="academy-tag-list">
          {data.languages.map((language) => (
            <li key={language.id} className="academy-tag-card">
              <span lang={language.code} dir={language.direction}>
                {language.nativeLabel}
              </span>
              <span>
                {language.label} · {language.code.toUpperCase()}
              </span>
              <span className="academy-muted">
                {copy.languageDirection(copy.directionLabels[language.direction])}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Notice>{copy.notice}</Notice>
      {completeStep.isError ? (
        <ErrorNote body={strings.common.loadErrorBody} />
      ) : null}
    </AcademyPage>
  )
}
