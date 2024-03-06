export type ProviderId = 'google'

export interface OAuthAccountInsert {
  providerId: ProviderId
  providerUserId: string
}

export interface GetUserData {
  providerUserId: string
  providerId: ProviderId
}
