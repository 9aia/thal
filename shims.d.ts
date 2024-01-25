declare module "*.vue" {
  const Component: import("vue").Component;
  export default Component;
}

/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./renderer/utils/initAuth").Auth;
  type DatabaseUserAttributes = {
    username: string;
  };
  type DatabaseSessionAttributes = {};
}
