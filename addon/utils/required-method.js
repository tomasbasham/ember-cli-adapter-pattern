import Ember from 'ember';

const {
  assert
} = Ember;

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
    throw new Ember.Error(`Definition of method ${methodName} is required.`);
  };
}
