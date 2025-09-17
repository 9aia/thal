import { type OAuth2Tokens, decodeIdToken } from 'arctic'
import { ObjectParser } from '@pilcrowjs/object-parser'

export function getGoogleUser(tokens: OAuth2Tokens): GoogleUser {
  const claims = decodeIdToken(tokens.idToken())
  const claimsParser = new ObjectParser(claims)

  const sub = claimsParser.getString('sub')
  const givenName = claimsParser.getString('given_name')
  const familyName = claimsParser.getString('family_name')
  const name = claimsParser.getString('name')
  const picture = claimsParser.getString('picture')
  const email = claimsParser.getString('email')
  const emailVerified = claimsParser.getBoolean('email_verified')

  return {
    sub,
    givenName,
    familyName,
    name,
    picture,
    email,
    emailVerified,
  }
}

interface GoogleUser {
  sub: string
  email: string
  givenName: string
  familyName: string
  picture: string
  emailVerified: boolean
  name: string
}
