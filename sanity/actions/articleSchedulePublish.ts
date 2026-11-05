import {useState} from 'react'
import type {SanityClient} from '@sanity/client'
import type {DocumentActionComponent} from 'sanity'

/**
 * For article drafts with a future publishedAt, the normal Sanity Publish
 * action would go live immediately. Instead, use Sanity's Scheduled Drafts
 * (a one-document Content Release), so the user can keep their chosen date.
 *
 * Sanity's Scheduled Drafts require a Growth plan. If the API rejects
 * scheduling, leave the draft untouched and explain why — never publish it.
 * All other document types and articles without future dates keep Sanity's
 * original publish permissions, validation and action.
 */
export function withArticleScheduling(
  originalPublish: DocumentActionComponent,
  client: SanityClient,
): DocumentActionComponent {
  const ArticleScheduleAction: DocumentActionComponent = (props) => {
    // Always evaluate the built-in action to preserve its validation/permissions.
    const original = originalPublish(props)
    const [scheduling, setScheduling] = useState(false)
    const [scheduled, setScheduled] = useState(false)
    const [notice, setNotice] = useState<{title: string; text: string} | null>(null)

    const requested = props.draft?.publishedAt
    const scheduledTime = typeof requested === 'string' ? Date.parse(requested) : NaN
    const future = Number.isFinite(scheduledTime) && scheduledTime > Date.now()

    if (!future || !original) return original

    return {
      ...original,
      label: scheduled ? 'Scheduled' : scheduling ? 'Scheduling…' : 'Schedule publish',
      disabled: Boolean(original.disabled) || scheduling || scheduled,
      onHandle: async () => {
        if (!props.draft || scheduling || scheduled) return

        // Re-check on click. A date can expire while the editor is open.
        const raw = props.draft.publishedAt
        const time = typeof raw === 'string' ? Date.parse(raw) : NaN
        if (!Number.isFinite(time) || time <= Date.now()) {
          setNotice({
            title: 'Choose a future date',
            text: 'The selected publication time has passed. Change the Publication date field and try scheduling again.',
          })
          return
        }

        setScheduling(true)
        let releaseCreated = false
        try {
          const publishAt = new Date(time).toISOString()
          const documentId = props.id.replace(/^drafts\./, '')

          // Official Sanity Scheduled Drafts workflow. Do not call
          // original.onHandle() here: that would immediately publish.
          const release = await client.releases.create({
            metadata: {
              title: `Scheduled: ${String(props.draft.title || 'GlowSkin article')}`,
              releaseType: 'scheduled',
              cardinality: 'one',
              intendedPublishAt: publishAt,
            },
          })
          releaseCreated = true
          await client.createVersion({
            publishedId: documentId,
            baseId: `drafts.${documentId}`,
            releaseId: release.releaseId,
          })
          await client.releases.schedule({
            releaseId: release.releaseId,
            publishAt,
          })

          setScheduled(true)
          setNotice({
            title: 'Article scheduled',
            text: `This article is queued for ${new Date(time).toLocaleString()} (your browser time zone). It is not live yet. You can review it under Scheduled Drafts in Sanity Studio.`,
          })
          props.onComplete()
        } catch (error) {
          const detail = error instanceof Error ? error.message : 'Unknown scheduling error'
          setNotice({
            title: 'Could not schedule — draft not published',
            text: `Sanity did not confirm the schedule. Your article was NOT published by this action. Scheduled Drafts requires an eligible Growth plan and release permissions. ${releaseCreated ? 'A partial unscheduled release may exist; inspect Content Releases before retrying. ' : ''}Details: ${detail.slice(0, 350)}`,
          })
        } finally {
          setScheduling(false)
        }
      },
      dialog: notice
        ? {
            type: 'dialog' as const,
            header: notice.title,
            content: notice.text,
            onClose: () => setNotice(null),
          }
        : undefined,
    }
  }
  return ArticleScheduleAction
}
