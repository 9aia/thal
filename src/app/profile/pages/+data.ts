import client from "#framework/client";

export default async () => {
  const res = await client.app.profile[':username'].$get({
    param: {
      username: "luisfloat"
    }
  });
  const profile = await res.json();
  return profile;
};
