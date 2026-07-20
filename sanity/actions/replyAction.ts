import { DocumentActionComponent, DocumentActionProps } from 'sanity'

export const replyAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const { draft, published } = props
  const doc = draft || published

  if (!doc || doc._type !== 'message') return null

  const email = doc.email as string
  const name = doc.name as string

  if (!email) return null

  return {
    label: 'Reply via Email',
    icon: () => '✉️',
    onHandle: () => {
      const subject = encodeURIComponent(`Re: Your message to GlowSkin`)
      const body = encodeURIComponent(`Hi ${name || ''},\n\n`)
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
      props.onComplete()
    },
  }
}