import Ember from 'ember';
import proxyToAdapter from '../../../utils/proxy-to-adapter';
import { module, test } from 'qunit';

module('Unit | Utility | proxy to adapter');

test('it throws an exception if a method name is not specified', function(assert) {
  assert.throws(function() {
    proxyToAdapter();
  });
});

test('it returns a resolved promise wrapping the response from invoke', function(assert) {
  const AdaptableObject = Ember.Object.extend({
    invoke: Ember.RSVP.resolve,
    doSomething: proxyToAdapter('doSomething')
  });

  let subject = AdaptableObject.create();
  assert.ok(subject.doSomething() instanceof Ember.RSVP.Promise);
});

test('it throws an exception when missing invoke function', function(assert) {
  const UnadaptableObject = Ember.Object.extend({
    doSomething: proxyToAdapter('doSomething')
  });

  let subject = UnadaptableObject.create();
  assert.throws(function() {
    subject.doSomething();
  }, Ember.Error);
});
