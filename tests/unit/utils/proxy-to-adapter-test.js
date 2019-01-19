import EmberError from '@ember/error';
import EmberObject from '@ember/object';

import proxyToAdapter from 'dummy/utils/proxy-to-adapter';

import { Promise, resolve } from 'rsvp';
import { module, test } from 'qunit';

module('Unit | Utility | proxy to adapter', function() {
  test('it throws an exception if a method name is not specified', function(assert) {
    assert.throws(function() {
      proxyToAdapter();
    });
  });

  test('it returns a resolved promise wrapping the response from invoke', function(assert) {
    const AdaptableObject = EmberObject.extend({
      invoke: resolve,
      doSomething: proxyToAdapter('doSomething')
    });

    let subject = AdaptableObject.create();
    assert.ok(subject.doSomething() instanceof Promise);
  });

  test('it throws an exception when missing invoke function', function(assert) {
    const UnadaptableObject = EmberObject.extend({
      doSomething: proxyToAdapter('doSomething')
    });

    let subject = UnadaptableObject.create();
    assert.throws(function() {
      subject.doSomething();
    }, EmberError);
  });
});
