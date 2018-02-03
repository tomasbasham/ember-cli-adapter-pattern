import EmberError from '@ember/error';

import { assert } from '@ember/debug';
import { computed } from '@ember/object';

/*
 * Utility method, returning a computed
 * property that throws an error unless
 * defined. This is like implementing
 * abstract methods.
 *
 * @method requiredProperty
 *
 * @param {String} propertyName
 *   Name of the required property.
 *
 * @return {Function}
 *   An 'abstract' method implementation.
 */
export default function requiredProperty(propertyName) {
  assert('Property name is required for requiredProperty.', propertyName);

  return computed(function() {
    throw new EmberError(`Definition of property ${propertyName} is required.`);
  });
}
