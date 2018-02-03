import EmberError from '@ember/error';
import EmberObject from '@ember/object';

import requiredProperty from 'dummy/utils/required-property';

import { get } from '@ember/object';
import { module, test } from 'qunit';

module('Unit | Utility | required property');

test('it throws an exception if a property name is not specified', function(assert) {
  assert.throws(function() {
    requiredProperty();
  });
});

test('it throws an exception for missing property', function(assert) {
  const AdaptableObject = EmberObject.extend({
    missingProperty: requiredProperty('missingProperty')
  });

  let subject = AdaptableObject.create();
  assert.throws(function() {
    get(subject, 'missingProperty');
  }, EmberError, /missingProperty/);
});
