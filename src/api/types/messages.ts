import type {
  ContentDirection,
  IsoDateTime,
  MessageId,
  MessageThreadId,
} from './common'

/**
 * In-app chat — PROPOSED, mock only.
 *
 * This is the header's human message surface (N1: the header button opens human
 * threads, not the AI persona). It is never WhatsApp and never an external
 * channel. No real-time transport and no notifications are claimed. Every
 * method stays PROPOSED.
 *
 * Message bodies carry their own language and direction, so a mixed-direction
 * conversation renders each block correctly.
 */

export type MessageAuthorRole = 'academy_owner' | 'instructor' | 'support'

export interface MessageParticipant {
  role: MessageAuthorRole
  name: string
}

export interface MessageThread {
  id: MessageThreadId
  title: string
  participant: MessageParticipant
  lastMessageAt: IsoDateTime
}

export interface Message {
  id: MessageId
  threadId: MessageThreadId
  author: MessageParticipant
  /** True when the signed-in user sent this message. */
  fromMe: boolean
  body: string
  sentAt: IsoDateTime
  /** BCP 47-style language tag for this content block. */
  lang: string
  dir: ContentDirection
}

export interface SendMessageInput {
  threadId: MessageThreadId
  body: string
}

export interface SendMessageResult {
  /** The sent message plus the deterministic mock reply, in order. */
  messages: Message[]
  /** Author of the mock reply, so the UI can label who answered. */
  repliedBy: MessageParticipant | null
}
