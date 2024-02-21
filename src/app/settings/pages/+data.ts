import client from "#lib/hono/client";
import { PageContext } from "vike/types";
import { render } from "vike/abort";
import { parseCookies } from "#lib/web/utils/cookies";

export default async (pageContext: PageContext) => {
  const { username } = parseCookies(pageContext.cookies);

  if(!username) {
    throw render(401, "Forbidden");
  }

  const res = await client.app.profile[":username"].$get({
    param: {
      username,
    },
  });

  if (!res.ok) {
    const messages: Record<number, string> = {
      404: `Profile not found: ${username}`,
    };
    const message =
      messages[res.status] || `Error fetching profile data: ${username}`;

    throw render(res.status as any, message);
  }

  const data = await res.json();
  return data;
};
