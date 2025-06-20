import { eq } from 'drizzle-orm'
import { encodeHexLowerCase } from '@oslojs/encoding'
import { sha256 } from '@oslojs/crypto/sha2'
import type { H3Event, H3EventContext } from 'h3'
import { type Session, type User, sessions } from '~~/db/schema'
import { now } from '~/utils/date'

export async function createSession(orm: H3EventContext['orm'], token: string, userId: string): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  }

  await orm.insert(sessions).values(session)
  return session
}

export async function validateSessionToken(orm: H3EventContext['orm'], token: string): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

  const result = await orm.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
    with: {
      user: {
        with: {
          username: true,
        },
      },
    },
  })

  if (!result?.id || !result.user)
    return { session: null, user: null }

  const { user, ...session } = result

  if (Date.now() >= session.expiresAt.getTime()) {
    await orm.delete(sessions).where(eq(sessions.id, session.id))
    return { session: null, user: null }
  }

  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    await orm
      .update(sessions)
      .set({
        expiresAt: session.expiresAt,
        updatedAt: now(),
      })
      .where(eq(sessions.id, session.id))
  }

  return {
    session,
    user: {
      ...user,
      username: user.username.username,
    },
  }
}

export async function invalidateSession(orm: H3EventContext['orm'], sessionId: string): Promise<void> {
  await orm.delete(sessions).where(eq(sessions.id, sessionId))
}

export function setSessionTokenCookie(event: H3Event, token: string, expiresAt: Date): void {
  setCookie(event, 'session', token, {
    httpOnly: true,
    path: '/',
    secure: !import.meta.dev,
    sameSite: 'lax',
    expires: expiresAt,
  })
}

export function deleteSessionTokenCookie(event: H3Event): void {
  setCookie(event, 'session', '', {
    httpOnly: true,
    path: '/',
    secure: !import.meta.dev,
    sameSite: 'lax',
    maxAge: 0,
  })
}

export type SessionValidationResult =
  | { session: Session, user: User }
  | { session: null, user: null }
