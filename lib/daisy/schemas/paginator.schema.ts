import { numericString } from "#lib/daisy/utils/schema";
import { z } from "zod";

export const paginatorSchema = z.object({
    page: numericString(z.number().positive().default(1)),
    perPage: numericString(z.number().positive().max(50).default(10)),
});
