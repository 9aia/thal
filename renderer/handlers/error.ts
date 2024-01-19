import { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";

export const error: ErrorHandler = (err, c) => {
  console.error(err);

  if (err instanceof HTTPException) {
    const e = err as HTTPException;

    if (e.res) {
      return e.res;
    }

    return c.json({ message: err.message }, err.status);
  }

  return c.json({ message: err.message }, 500);
};
