import Ember from 'ember';
import AdaptableMixin from '../../../mixins/adaptable';
import Starship from '../../../starships/starship';
import { module, test } from 'qunit';
import Sinon from 'sinon';

const {
  get,
  set
} = Ember;

let sandbox, adapters;

module('Unit | Mixin | adaptable', {
  beforeEach() {
    sandbox = Sinon.sandbox.create();
    adapters = {
      starships: [
        {
          name: 'Enterprise',
          config: {
            captain: 'Jean-Luc Picard'
          }
        },
        {
          name: 'Voyager',
          config: {
            captain: 'Kathryn Janeway'
          }
        }
      ]
    };
  },

  afterEach() {
    sandbox.restore();
  }
});

test('it initialises the adapters object', function(assert) {
  let AdaptableObject = Ember.Object.extend(AdaptableMixin);
  let subject = AdaptableObject.create();

  assert.deepEqual(get(subject, '_adapters'), {});
});

test('it initialises the context object', function(assert) {
  let AdaptableObject = Ember.Object.extend(AdaptableMixin);
  let subject = AdaptableObject.create();

  assert.deepEqual(get(subject, 'context'), {});
});

test('it registers configured adapters', function(assert) {
  let AdaptableObject = Ember.Object.extend(AdaptableMixin);
  let subject = AdaptableObject.create();

  sandbox.stub(subject, '_lookupAdapter', function() {
    return Starship; // Return a non-instantiated adapter.
  });

  subject.activateAdapters(adapters.starships);
  assert.ok(subject);
});

test('it passes config options to the configured adapters', function(assert) {
  let AdaptableObject = Ember.Object.extend(AdaptableMixin);
  let subject = AdaptableObject.create();

  sandbox.stub(subject, '_lookupAdapter', function() {
    return Starship; // Return a non-instantiated adapter.
  });

  subject.activateAdapters(adapters.starships);
  assert.equal(get(subject, '_adapters.Enterprise.config.captain'), 'Jean-Luc Picard');
});

test('#invoke invokes the named method on activated adapters', function(assert) {
  assert.expect(6);

  let AdaptableObject = Ember.Object.extend(AdaptableMixin);
  let subject = AdaptableObject.create();

  sandbox.stub(subject, '_lookupAdapter', function() {
    return Starship; // Return a non-instantiated adapter.
  });

  subject.activateAdapters(adapters.starships);

  const EnterpriseStub = sandbox.stub(get(subject, '_adapters.Enterprise'), '_makeItSo');
  const VoyagerStub = sandbox.stub(get(subject, '_adapters.Voyager'), '_makeItSo');

  const EnterpriseSpy = sandbox.spy(get(subject, '_adapters.Enterprise'), 'warp');
  const VoyagerSpy = sandbox.spy(get(subject, '_adapters.Voyager'), 'warp');

  const warpFactor = {
    factor: 8
  };

  subject.invoke('warp', warpFactor);

  assert.ok(EnterpriseSpy.calledOnce);
  assert.ok(EnterpriseSpy.calledWith(warpFactor));
  assert.ok(EnterpriseStub.calledOnce);

  assert.ok(VoyagerSpy.calledOnce);
  assert.ok(VoyagerSpy.calledWith(warpFactor));
  assert.ok(VoyagerStub.calledOnce);
});

test('#invoke invokes the named method on a single activated adapter', function(assert) {
  assert.expect(3);

  let AdaptableObject = Ember.Object.extend(AdaptableMixin);
  let subject = AdaptableObject.create();

  sandbox.stub(subject, '_lookupAdapter', function() {
    return Starship; // Return a non-instantiated adapter.
  });

  subject.activateAdapters(adapters.starships);

  const stub = sandbox.stub(get(subject, '_adapters.Enterprise'), '_makeItSo');
  const spy = sandbox.spy(get(subject, '_adapters.Enterprise'), 'warp');

  const warpFactor = {
    factor: 8
  };

  subject.invoke('warp', 'Enterprise', warpFactor);

  assert.ok(spy.calledOnce);
  assert.ok(spy.calledWith(warpFactor));
  assert.ok(stub.calledOnce);
});

test('#invoke includes `context` properties', function(assert) {
  assert.expect(3);

  let AdaptableObject = Ember.Object.extend(AdaptableMixin);
  let subject = AdaptableObject.create();

  sandbox.stub(subject, '_lookupAdapter', function() {
    return Starship; // Return a non-instantiated adapter.
  });

  subject.activateAdapters(adapters.starships);

  const stub = sandbox.stub(get(subject, '_adapters.Enterprise'), '_makeItSo');
  const spy = sandbox.spy(get(subject, '_adapters.Enterprise'), 'warp');

  const warpFactor = {
    factor: 8
  };

  set(subject, 'context.warpCapabilities', true);
  subject.invoke('warp', 'Enterprise', warpFactor);

  assert.ok(spy.calledOnce);
  assert.ok(spy.calledWith({ warpCapabilities: true, factor: 8 }));
  assert.ok(stub.calledOnce);
});

test('#invoke does not leak options between calls', function(assert) {
  assert.expect(3);

  let AdaptableObject = Ember.Object.extend(AdaptableMixin);
  let subject = AdaptableObject.create();

  sandbox.stub(subject, '_lookupAdapter', function() {
    return Starship; // Return a non-instantiated adapter.
  });

  subject.activateAdapters(adapters.starships);

  const stub = sandbox.stub(get(subject, '_adapters.Enterprise'), '_makeItSo');
  const spy = sandbox.spy(get(subject, '_adapters.Enterprise'), 'warp');

  set(subject, 'context.warpCapabilities', true);
  subject.invoke('warp', 'Enterprise', { factor: 8, callOne: true });
  subject.invoke('warp', 'Enterprise', { factor: 8, callTwo: true });

  assert.ok(spy.called);
  assert.ok(spy.calledWith({ warpCapabilities: true, factor: 8, callTwo: true }));
  assert.ok(stub.called);
});
