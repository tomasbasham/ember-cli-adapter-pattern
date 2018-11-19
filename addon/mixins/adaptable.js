import Mixin from '@ember/object/mixin';

import requiredMethod from 'ember-cli-adapter-pattern/utils/required-method';

import { assert } from '@ember/debug';
import { get, set } from '@ember/object';
import { on } from '@ember/object/evented';
import { merge } from '@ember/polyfills';
import { hash, resolve } from 'rsvp';
import { copy } from 'ember-copy';

export default Mixin.create({

  /*
   * A cache of active adapters to save
   * time on expensive container lookups.
   *
   * @type {Object}
   */
  _adapters: null,

  /*
   * Extra information you can attach to
   * every adapter call. This can be handy
   * when there is a value that needs to
   * be present with every aapter call,
   * reducing the need to pass the value
   * each time.
   *
   * @type {Object}
   */
  context: null,

  /*
   * Instantiates a series of adapters as
   * defined in the application config and
   * caches them to save on expensive future
   * lookups.
   *
   * @method activateAdapters
   *
   * @param {Array} adapterOptions
   *   Adapter configuration options.
   */
  activateAdapters(adapterOptions) {
    const cachedAdapters = get(this, '_adapters');
    const activatedAdapters = {};

    adapterOptions.forEach((adapterOption) => {
      const { name } = adapterOption;
      const adapter = cachedAdapters[name] ? cachedAdapters[name] : this.activateAdapter(adapterOption);

      set(activatedAdapters, name, adapter);
    });

    set(this, '_adapters', activatedAdapters);
  },

  /*
   * Instantiates a single adapter from a
   * configuration object.
   *
   * @method activateAdapter
   *
   * @params {Object} adapterOptions
   *   Adapter configuration options. Must have a name property, and optioanlly a config property.
   *
   * @return {Object}
   *   An instantiated adpater.
   */
  activateAdapter({ name, config } = {}) {
    const adapter = this._lookupAdapter(name);
    assert(`Could not find adapter ${name}`, adapter);

    return adapter.create({ adaptable: this, config });
  },

  /*
   * Invoke a method on a registered
   * adpater. If a specific adapter
   * name is supplied then the method
   * will only be invoked on that
   * adapter, providing it exists.
   *
   * @method invoke
   *
   * @param {String} methodName
   *   The name of the method to invoke.
   *
   * @param {Rest} args
   *   Any other supplied arguments.
   *
   * @return {Ember.RSVP}
   *   A hash of promise objects.
   */
  invoke(methodName, ...args) {
    const cachedAdapters = get(this, '_adapters');
    const adapterNames = Object.keys(cachedAdapters);
    const [selectedAdapterNames, options] = args.length > 1 ? [[args[0]], args[1]] : [adapterNames, args[0]];
    const context = copy(get(this, 'context'));
    const mergedOptions = merge(context, options);

    // Store a promise for each adapter response.
    const promises = {};

    selectedAdapterNames.map((adapterName) => {
      const adapter = get(cachedAdapters, adapterName);
      promises[adapterName] = resolve(adapter[methodName].call(adapter, mergedOptions));
    });

    return hash(promises);
  },

  /*
   * Ensure that we have a clean cache
   * of adapters. It may be beneficial
   * to override this method in a
   * consuming application or addon so
   * the adapters can be activated
   * here also.
   *
   * @method createAdapters
   * @on init
   */
  createAdapters: on('init', function() {
    set(this, '_adapters', {});
    set(this, 'context', {});
  }),

  /*
   * Tear down any cached adapters.
   *
   * @method destroyAdapters
   * @on willDestroy
   */
  destroyAdapters: on('willDestroy', function() {
    const cachedAdapters = get(this, '_adapters');

    for(let adapterName in cachedAdapters) {
      get(cachedAdapters, adapterName).destroy();
    }
  }),

  /*
   * An abstract method that needs to
   * be defined on the consuming
   * application or addon responsible
   * for the lookup of adapter objects
   * from the container.
   *
   * @method lookupAdapter
   * @private
   */
  _lookupAdapter: requiredMethod('_lookupAdapter')
});
