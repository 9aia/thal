import client from "#lib/hono/client";
import { CfProperties } from "@cloudflare/workers-types";
import { PageContext } from "vike/types";

export default async function (ctx: PageContext) {
  const res = await client.auth["verify-login"].$get(undefined, {
    fetch(input: string | Request | URL, requestInit?: RequestInit<CfProperties<unknown>>) {
      return fetch(input, {
        ...requestInit,
        headers: {
          'Cookie': ctx.cookies,
        },
      });
    },
  });

  const data = await res.json();

  return data
}
