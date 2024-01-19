export const USER_REGEX = new RegExp(
  /^(?=.{1,20}$)(?:[a-zA-Z\d]+(?:(?:\.|_)[a-zA-Z\d])*)+$/
);
export const EMAIL_REGEX = new RegExp(/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i);