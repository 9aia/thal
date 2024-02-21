type AnyFunction = (...args: any) => any;
export type InferData<T extends AnyFunction> = Awaited<ReturnType<T>>;

export type PageProps = Record<string, unknown>;
