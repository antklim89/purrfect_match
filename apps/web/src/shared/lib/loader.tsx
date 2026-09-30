import { type ReactNode, Suspense } from 'react';

export function loader<
  TPromise,
  TProps extends Record<string, unknown>,
  TSearchParams extends Record<string, string | string[] | undefined> | undefined,
  TParams,
  TError,
>({
  promise,
  render,
  key,
  params,
  props,
  searchParams,
  fallback,
}: {
  key?: string;
  promise?: () => Promise<TPromise>;
  render: (args: {
    promise: unknown extends TPromise ? never : TPromise;
    props: Record<string, unknown> extends TProps ? never : TProps;
    searchParams: Record<string, string | string[] | undefined> extends TSearchParams ? never : TSearchParams;
    params: unknown extends TParams ? never : TParams;
  }) => ReactNode;
  props?: TProps;
  searchParams?: Promise<TSearchParams>;
  params?: Promise<TParams>;
  fallback?: ReactNode;
  errorFallback?: (error: NonNullable<TError>) => ReactNode;
}) {
  const loaderData = (async () => {
    const [awaitedSearchParams, awaitedParams, awaitedPromise] = await Promise.all([searchParams, params, promise?.()]);

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
