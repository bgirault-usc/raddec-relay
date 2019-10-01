/**
 * Copyright reelyActive 2019
 * We believe in an open Internet of Things
 */


const DEFAULT_BALANCER = null;
const DEFAULT_ENABLE_FORWARDING = true;


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

    this.handleRaddec = options.raddecHandler;
    this.enableHandling = (typeof this.handleRaddec === 'function');
    this.enableForwarding = DEFAULT_ENABLE_FORWARDING;
    if(options.hasOwnProperty('enableForwarding')) {
      this.enableForwarding = options.enableForwarding;
    }
    this.balancer = options.balancer || DEFAULT_BALANCER;
    this.channels = [];
  }

  /**
   * Relay the given raddec, first balancing if required.
   * @param {Raddec} raddec The given Raddec instance.
   * @param {Array} targetIndices The optional indices of targets to relay to.
   */
  relayRaddec(raddec, targetIndices) {
    let self = this;
    let useBalancer = this.balancer && !Array.isArray(targetIndices);

    if(useBalancer) {
      self.balancer.balanceRaddec(raddec, function(raddec, targetIndex) {
        relayAcrossChannels(self.channels, raddec, [ targetIndex ]);
      });
    }
    else {
      relayAcrossChannels(self.channels, raddec, targetIndices);
    }
  }

  /**
   * Create an instance of the given channel with the given options.
   * @param {Class} channelClass The (uninstantiated) raddec-relay-x class.
   * @param {Object} channelOptions The channel options as a JSON object.
   */
  addChannel(channelClass, channelOptions) {
    let self = this;

    channelOptions = channelOptions || {};
    channelOptions.enableForwarding = false;
    channelOptions.raddecHandler = function(raddec, rinfo) {
      if(self.enableForwarding) {
        self.relayRaddec(raddec);
      }
      if(self.enableHandling) {
        self.handleRaddec(raddec, rinfo);
      }
    };

    let channelInstance = new channelClass(channelOptions);

    this.channels.push(channelInstance);
  }
}


/**
 * Relay the given raddec across the given channels.
 * @param {Array} channels The channels.
 * @param {Raddec} raddec The given Raddec instance.
 * @param {Array} targetIndices The optional indices of targets to relay to.
 */
function relayAcrossChannels(channels, raddec, targetIndices) {
  channels.forEach(function(channel) {
    channel.relayRaddec(raddec, targetIndices);
  });
}


module.exports = RaddecRelay;
