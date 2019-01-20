# ember-cli-adapter-pattern [![Build Status](https://travis-ci.com/tomasbasham/ember-cli-adapter-pattern.svg?branch=master)](https://travis-ci.com/tomasbasham/ember-cli-adapter-pattern)

An [Ember CLI](https://ember-cli.com/) addon to standardise a common adapter
pattern.

The adapter pattern helps to provide a common interface from which two
incompatible interface may work together. For example you may wish to include
in your applications the ability to authenticate users through a variety of
social platforms (i.e. Facebook and Twitter). Each platform defines its own API
which to interface with it's servers. Using the adapter pattern you can
separate the logic of both APIs into their own adapter objects, using a common
interface to work with both.

This addon implements a common adapter pattern that can be included in any
ember object allowing it to act as a proxy between the application and any
external interface.

## Compatibility

* Ember.js v2.18 or above
* Ember CLI v2.13 or above

## Installation

From within your Ember CLI project directory run:
```
ember install ember-cli-adapter-pattern
```

## Usage

This addon implements a mixin that should be included in any object you wish to
act as the interface between your application and any external platform or API.

### Adaptable Mixin

In order to implement the adapter pattern, it is recommended you include the
`Adaptable` mixin into an ember object that will act as a singleton, i.e. a
service.

##### Adaptable Example

```JavaScript
// app/services/social.js
import Service from '@ember/service';

import Adaptable from 'ember-cli-adapter-pattern/mixins/adaptable';
import proxyToAdapter from 'ember-cli-adapter-pattern/utils/proxy-to-adapter';

import { getOwner } from '@ember/application';
import { A } from '@ember/array';
import { assert } from '@ember/debug';
import { get, getWithDefault } from '@ember/object';
import { on } from '@embber/object/evented';
import { dasherize } from '@ember/string';

export default Service.extend(Adaptable, {
  login: proxyToAdapter('login'), // Provides a safe method to proxy your API to each adapter.

  /**
   * There are potentially many ways
   * to activate adapters, but it is
   * imperative that somewhere the
   * `activateAdapters` method is
   * called.
   */
  createAdapters: on('init', function() {
    const adapters = getWithDefault(this, 'property.with.adapter.configurations', A());

    this.set('_adapters', {});
    this.set('context', {});

    // Activate configured adapter.
    this.activateAdapters(adapters);
  }),

  /**
   * This is the only method that you
   * are required to write and defines
   * how you look up your adapters. It
   * is not limited to using the
   * container.
   */
  _lookupAdapter(adapterName) {
    assert('Could not find adapter without a name', adapterName);

    const owner = getOwner(this);
    const dasherizedAdapterName = dasherize(adapterName);
    const adapter = owner.lookup(`container:${dasherizedAdapterName}`);

    return adapter;
  }
});
```

This creates a service that will act as the common API for each of your
adapters. Here you can see I have defined a single common API method named
`login`.

### Making API Calls

To make calls to your API you must inject the `Adaptable` object into another
ember object (i.e. a controller) and invoke it as normal.

##### All Adapters Example

```JavaScript
// app/controller/application.js
import Controller from '@ember/controller';

import { get } from '@ember/object';
import { inject } from '@ember/service';

export default Controller.extend({
  social: inject(),

  actions: {
    loginWithService() {
      const social = get(this, 'social');
      social.login({ username: 'Jean-Luc Picard', password: 'Enterprise-D' });
    }
  }
});
```

The action defined in the controller will call the `login` method on the
`social` service. This will in turn forward the invocation on to each of the
adapters. Of course in this example it would make little sense to login with
more than one platform at the same time. If you wish to call only one adapter
then you must pass in it's name to the API call.

##### Single Adapter Example

```JavaScript
// app/controller/application.js
import Controller from '@ember/controller';

import { get } from '@ember/object';
import { inject } from '@ember/service';

export default Controller.extend({
  social: inject(),

  actions: {
    loginWithService() {
      get(this, 'social').login('Facebook', { username: 'Jean-Luc Picard', password: 'Enterprise-D' });
    }
  }
});
```

This will only make the API call to the 'Facebook' adapter.

Each API call will be wrapped within a promise that resolves with the returned
result of the adapter mapped to the adapter name.

### ProxyToAdapter Utility

The `proxyToAdapter` utility method simply forwards calls made to each of your
API methods to all defined adapters, or just a single adapter if specified. It
is recommended you use `proxyToAdapter` because it implements guard statements
to prevent the application from throwing errors.

If however you need to extend the functionality of your API methods then
somewhere in its implementation it needs to call the `invoke` method defined
within the `Adaptable` mixin.

```JavaScript
// app/services/social.js
import Service from '@ember/service';
import Adaptable from 'ember-cli-adapter-pattern/mixins/adaptable';

export default Service.extend(Adaptable, {
  login(...args) {
    // Extended operations here.
    this.invoke('login', ...args);
  }
});
```

Here we are passing the name of the API call as the first argument to `invoke`
followed by the arguments that were passed into the API call.

## License

This project is licensed under the [MIT License](LICENSE.md).
