import Ember from 'ember';
import requiredProperty from '../../../utils/required-property';
import { module, test } from 'qunit';

const {
  get
} = Ember;

module('Unit | Utility | required property');

test('it throws an exception if a property name is not specified', function(assert) {
  assert.throws(function() {
    requiredProperty();
  });
});

test('it throws an exception for missing property', function(assert) {
  const AdaptableObject = Ember.Object.extend({
    missingProperty: requiredProperty('missingProperty')
  });

  let subject = AdaptableObject.create();
  assert.throws(function() {
    get(subject, 'missingProperty');
  }, Ember.Error, /missingProperty/);
});
