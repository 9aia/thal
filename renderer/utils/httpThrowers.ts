import { HTTPException } from "hono/http-exception";

export function notFound(message = "Not found", res?: Response) {
  return new HTTPException(404, { message, res });
}

export function forbidden(message = "Forbidden", res?: Response) {
  return new HTTPException(401, { message, res });
}
