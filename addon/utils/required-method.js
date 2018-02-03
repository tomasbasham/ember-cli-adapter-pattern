import EmberError from '@ember/error';
import { assert } from '@ember/debug';

/*
 * Utility method, returning a function that
 * throws an error unless defined. This is
 * like implementing abstract methods.
 *
 * @method requiredMethod
 *
 * @param {String} methodName
 *   Name of the required method.
 *
 * @return {Function}
 *   An 'abstract' method implementation.
 */
export default function requiredMethod(methodName) {
  assert('Method name is required for requiredMethod.', methodName);

  return function() {
    throw new EmberError(`Definition of method ${methodName} is required.`);
  };
}
