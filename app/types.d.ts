import type { HOBBIES } from "./constants/base"
import type { UserSelect } from "~~/db/schema"

// #region Settings

export interface Item { id: keyof UserSelect, icon: string, label: string }
export type Interest = typeof HOBBIES[number]

// #endregion

// #region Payment

export interface PlanType {
  amount: number
  name: string
  lookupKey: string
}

// #endregion

// DTOs

// #region Chat

export interface MessageData {
  type: "text"
  value: string
}

export type MessageStatus = "seen" | "sent" | "received" | "sending" | "error"

export interface MessageContent {
  date: Date
  text: string
  status: MessageStatus
}

export interface Persona {
  id?: string
  name: string
  username: string
  avatar?: string
}

export interface Contact {
  id?: string
  name: string
  username: string
}

export interface Chat {
  id: number
  persona: Persona
  lastMessage: MessageContent
}

export interface Message {
  id: number
  from: "user" | "bot"
  message: string
  replyMessage?: string
  replyFrom?: "user" | "bot"
  time: number
  status: MessageStatus
  replyingId?: number | null
}

export interface Reply {
  id: number
  message: string
  from: "user" | "bot"
}

export interface Replies {
  [key: string]: Reply // Username: Message
}

// #endregion
