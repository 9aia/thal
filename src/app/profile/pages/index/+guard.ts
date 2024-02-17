import { parseCookies } from "#framework/utils/cookies";
import { redirect } from "vike/abort";
import { PageContext } from "vike/types";

export default (pageContext: PageContext) => {
  const cookies = parseCookies(pageContext.cookies);
  const username = cookies.username;

  throw redirect(`/app/profile/${username}`);
};
