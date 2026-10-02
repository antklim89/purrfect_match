import { type ReactNode, Suspense } from 'react';

export function loader<
  TPromise,
  TProps extends Record<string, unknown>,
  TSearchParams extends Record<string, string | string[] | undefined> | undefined,
  TParams,
  TError,
  TPromises extends Record<string, Promise<unknown>>,
>(
  {
    promise,
    render,
    key,
    params,
    props,
    searchParams,
    promises,
    fallback,
  }: {
    key?: string;
    promise?: () => Promise<TPromise>;
    render: (args: {
      promise: unknown extends TPromise ? never : TPromise;
      props: Record<string, unknown> extends TProps ? never : TProps;
      searchParams: [TSearchParams] extends [undefined] ? never : TSearchParams;
      params: unknown extends TParams ? never : TParams;
      promises: { [P in keyof TPromises]: Awaited<TPromises[P]> };
    }) => ReactNode;
    props?: TProps;
    searchParams?: Promise<TSearchParams>;
    params?: Promise<TParams>;
    promises?: TPromises;
    fallback?: ReactNode;
    errorFallback?: (error: NonNullable<TError>) => ReactNode;
  },
  // & ({ searchParams: TSearchParams } | { searchParams?: never })
) {
  const loaderData = (async () => {
    const [awaitedSearchParams, awaitedParams, awaitedPromise] = await Promise.all([searchParams, params, promise?.()]);
    // const x =
    //   promises &&
    //   Object.fromEntries(
    //     await Promise.all(Object.entries(promises).map(async ([key, promise]) => [key, await promise])),
    //   );
    // console.log('🚀 ~ x: \n%o\n', x);
    return {
      promise: awaitedPromise,
      searchParams: awaitedSearchParams,
      params: awaitedParams,
      props,
    };
  })();

  return (
    <Suspense key={key} fallback={fallback}>
      {/** biome-ignore lint/suspicious/noExplicitAny: for simplicity */}
      {loaderData.then((data) => render(data as any))}
    </Suspense>
  );
}
