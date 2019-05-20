import { useState, useEffect } from 'react';

/**
 * The result of an async resource hook
 */
interface AsyncHookResource<T> {
  /**
   * If the resource is currently loading
   */
  loading: boolean;

  /**
   * The value of the resource, if successfully loaded
   */
  resource?: T;

  /**
   * A current error, if we failed to load the resource
   */
  error?: Error;

  /**
   * A function to reload the state
   */
  reload: () => Promise<void>;
}

/**
 * A react hook that lets you operate simply with simple async resources
 * @param resourceLoader An async function that provides the resource
 * @param dependencies Values that when changed, should trigger a new load
 */
export default function useAsyncResource<ResourceT>(
  resourceLoader: () => PromiseLike<ResourceT>,
  dependencies: any[] = [],
): AsyncHookResource<ResourceT> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const [resource, setResource] = useState<ResourceT | undefined>();

  async function reload(): Promise<void> {
    setLoading(true);
    try {
      const resourceResponse = await resourceLoader();
      setResource(resourceResponse);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  }

  useEffect(() => {
    reload();
  }, dependencies);

  return { loading, error, resource, reload };
}
