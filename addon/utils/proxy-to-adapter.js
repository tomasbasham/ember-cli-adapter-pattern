import EmberError from '@ember/error';
import { assert } from '@ember/debug';

/*
 * Utility method, returning a proxy function
 * that looks up a function on the intended
 * adapter. The proxy funtion will return a
 * resolved promise with a value.
 *
 * @method proxyToAdapter
 *
 * @param {String} methodName
 *   Name of the method to proxy.
 *
 * @return {Function}
 *   A proxy function returning a resolved promise.
 */
export default function proxyToAdapter(methodName) {
  assert('Method name is required for proxyToAdapter.', methodName);

  return function(...args) {
    if (!this.invoke && typeof this.invoke !== 'function') {
      throw new EmberError('No invoke method. Have you forgotten to include the Adaptable mixin?');
    }

    return this.invoke(methodName, ...args);
  };
}
