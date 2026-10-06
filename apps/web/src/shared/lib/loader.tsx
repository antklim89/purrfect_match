import { type ReactNode, Suspense } from 'react';

export function loader<
  TPromise,
  TProps extends Record<string, unknown>,
  TError,
  TPromises extends Record<string, Promise<unknown>>,
>({
  promise,
  render,
  key,
  props,
  promises,
  fallback,
}: {
  key?: string;
  promise?: () => Promise<TPromise>;
  render: (args: {
    promise: unknown extends TPromise ? never : TPromise;
    props: Record<string, unknown> extends TProps ? never : TProps;
    promises: { [P in keyof TPromises]: Awaited<TPromises[P]> };
  }) => ReactNode;
  props?: TProps;
  promises?: TPromises;
  fallback?: ReactNode;
  errorFallback?: (error: NonNullable<TError>) => ReactNode;
}) {
  const loaderData = (async () => {
    const promisesArray = promises && Promise.all(Object.entries(promises).map(async (p) => [p[0], await p[1]]));
    const [awaitedPromisesArray, awaitedPromise] = await Promise.all([promisesArray, promise?.()]);

    return {
      promises: awaitedPromisesArray && Object.fromEntries(awaitedPromisesArray),
      promise: awaitedPromise,
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
