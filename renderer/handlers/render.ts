import { MiddlewareHandler } from "hono";
import { renderPage } from "vike/server";

export const render: MiddlewareHandler = async (c, next) => {
  const pageContextInit = {
    urlOriginal: c.req.url,
    acceptLanguage: c.req.header("accept-language"),
    cookies: c.req.header("cookie"),
    userAgent: c.req.header("user-agent"),
  };

  const pageContext = await renderPage(pageContextInit);
  const { httpResponse } = pageContext;

  if (httpResponse === null) {
    await next();
    return;
  }

  const { statusCode, headers } = httpResponse;

  const { readable, writable } = new TransformStream();
  httpResponse.pipe(writable);

  headers.forEach(([name, value]: [string, string]) => {
    c.header(name, value);
  });

  return c.newResponse(readable, statusCode);
};
