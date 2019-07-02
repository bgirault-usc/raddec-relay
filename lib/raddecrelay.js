/**
 * Copyright reelyActive 2019
 * We believe in an open Internet of Things
 */


/**
 * RaddecRelay Class
 * Interface for relaying raddecs to/from remote servers.
 */
class RaddecRelay {

  /**
   * RaddecRelay constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    options = options || {};

    this.channels = [];
  }

  /**
   * Relay the given raddec.
   * @param {Raddec} raddec The given Raddec instance.
   */
  relayRaddec(raddec) {
    this.channels.forEach(function(channel) {
      channel.relayRaddec(raddec);
    });
  }

  /**
   * Create an instance of the given channel with the given options.
   * @param {Class} channelClass The (uninstantiated) raddec-relay-x class.
   * @param {Object} channelOptions The channel options as a JSON object.
   */
  addChannel(channelClass, channelOptions) {
    let channelInstance = new channelClass(channelOptions);

    this.channels.push(channelInstance);
  }
}


module.exports = RaddecRelay;
