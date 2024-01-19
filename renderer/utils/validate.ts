import { z } from "zod";
import {
  USER_REGEX
} from "./regex";

export const required = (v: string) => !!v;

export const emailValidation = (value: string) => {
  return z.string().email().safeParse(value).success;
};

export const userValidation = (value: string) => {
  if (!value) return true;
  if (USER_REGEX.test(value)) return true;

  return false;
};
