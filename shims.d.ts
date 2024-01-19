declare module "*.vue" {
  const Component: import("vue").Component;
  export default Component;
}

/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./renderer/middlewares/lucia").Auth;
  type DatabaseUserAttributes = {
    username: string;
  };
  type DatabaseSessionAttributes = {};
}
