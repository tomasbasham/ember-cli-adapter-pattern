import EmberError from '@ember/error';
import EmberObject from '@ember/object';

import requiredMethod from 'dummy/utils/required-method';

import { module, test } from 'qunit';

module('Unit | Utility | required method');

test('it throws an exception if a method name is not specified', function(assert) {
  assert.throws(function() {
    requiredMethod();
  });
});

test('it throws an exception for missing method', function(assert) {
  const AdaptableObject = EmberObject.extend({
    missingMethod: requiredMethod('missingMethod')
  });

  let subject = AdaptableObject.create();
  assert.throws(function() {
    subject.missingMethod();
  }, EmberError, /missingMethod/);
});
