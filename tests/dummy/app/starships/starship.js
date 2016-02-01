import Ember from 'ember';

export default Ember.Object.extend({

  /*
   * The main interface to the
   * warp drive. This allows the
   * starship to attain faster
   * than light (FTL) speeds.
   *
   * @method warp
   *
   * @param {Object} options
   *   Warp parameters.
   *
   * @return {Number}
   *   The warp factor.
   */
  warp(options = {}) {
    const { factor } = options;

    this._makeItSo(factor); // Stub this, number one.
    return factor;
  },

  /*
   * Set the state of the shileds.
   * This can be used to bring up
   * or take down shileds in with
   * a series of options.
   *
   * @method shield
   *
   * @param {Object} options
   *   Shield parameters.
   *
   * @return {Object}
   *   The power of the shields (e.g. full) and where to position the shields (e.g. front)
   */
  shields(options = {}) {
    const { power, position } = options;

    this._makeItSo(power, position); // Stub this, number one.
    return options;
  },

  /*
   * Beam down a number of crew
   * members.
   *
   * @method beamDown
   *
   * @param {Object} options
   *   Transporter parameters.
   *
   * @return {Object}
   *   The number of crew members to beam down and their coordinates.
   */
  beamDown(options = {}) {
    const { howMany, coordinates } = options;

    this._makeItSo(howMany, coordinates); // Stub this, number one.
    return options;
  },

  /*
   * Beam up a number of crew
   * members.
   *
   * @method beamUp
   *
   * @param {Object} options
   *   Transporter parameters.
   *
   * @return {Object}
   *   The number of crew memeber to beam up and their coordinates.
   */
  beamUp(options = {}) {
    const { howMany, coordinates } = options;

    this._makeItSo(howMany, coordinates); // Stub this, number one.
    return options;
  },

  /*
   * This is where the captain
   * assets their authority.
   *
   * @method makeItSo
   * @private
   */
  _makeItSo: Ember.K
});
