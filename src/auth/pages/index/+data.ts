import { PageContext } from "vike/types";

interface Data {
  type?: "pricing";
}

export default async (pageContext: PageContext): Promise<Data> => {
  const queryParams = pageContext.urlOriginal.split("?")[1];

  const type = queryParams?.split("=")[1];

  return {
    type: type as "pricing" | undefined,
  };
};
