raddec-relay
============


Relay raddecs to and from remote servers
----------------------------------------

Interface for specific raddec-relay instances which relay [raddec](https://github.com/reelyactive/raddec)s to and from remote servers, with optional load balancing (see [raddec-balancer](https://github.com/reelyactive/raddec-balancer)).  Currently supports the following raddec-relay-x instances:

- [raddec-relay-udp](https://github.com/reelyactive/raddec-relay-udp)


Installation
------------

    npm install raddec-relay


Hello raddec-relay!
-------------------

The following code will configure the relaying of raddecs over UDP from the local instance to port 55555 on the localhost.

```javascript
const RaddecRelay = require('raddec-relay');
const RaddecRelayUdp = require('raddec-relay-udp');

const sources = [ { address: "0.0.0.0" } ];
const targets = [ { address: "127.0.0.1", port: 55555 } ];

let relay = new RaddecRelay();

relay.addChannel(RaddecRelayUdp, { sources: sources, targets: targets });
```


Configuration Examples
----------------------

__raddec-relay__ supports a variety of configurations for receiving and/or relaying raddecs, as described in the following examples.

### Example: relay raddecs to remote server(s)

```javascript
const RaddecRelay = require('raddec-relay');
const RaddecRelayUdp = require('raddec-relay-udp');

const targets = [
    { address: "12.34.56.78", port: 50001 },
    { address: "98.76.54.32", port: 50001 }
];

let relay = new RaddecRelay();
relay.addChannel(RaddecRelayUdp, { targets: targets });

let raddec = ...;  // Typically locally decoded radio packets in this case

relay.relayRaddec(raddec);  // Relay the raddec to the remote servers
```

### Example: listen for and handle inbound raddecs

```javascript
const RaddecRelay = require('raddec-relay');
const RaddecRelayUdp = require('raddec-relay-udp');

const sources = [ { address: "0.0.0.0", port: 50001 } ];

let relay = new RaddecRelay({ raddecHandler: handleRaddec });
relay.addChannel(RaddecRelayUdp, { sources: sources });

function handleRaddec(raddec) {
  // Do something with the received raddec
}
```

### Example: relay raddecs from source(s) to target(s)

```javascript
const RaddecRelay = require('raddec-relay');
const RaddecRelayUdp = require('raddec-relay-udp')

const sources = [ { address: "0.0.0.0", port: 50001 } ];
const targets = [ { address: "12.34.56.78", port: 50001 } ];

let relay = new RaddecRelay();
relay.addChannel(RaddecRelayUdp, { sources: sources,
                                   targets: targets });
``` 

### Example: balance raddecs from source(s) across targets

```javascript
const RaddecRelay = require('raddec-relay');
const RaddecBalancer = require('raddec-balancer');
const RaddecRelayUdp = require('raddec-relay-udp')

const sources = [ { address: "0.0.0.0", port: 50001 } ];
const targets = [ { address: "127.0.0.1", port: 55550 },
                  { address: "127.0.0.1", port: 55551 },
                  { address: "127.0.0.1", port: 55552 },
                  { address: "127.0.0.1", port: 55553 } ];

let balancer = new RaddecBalancer({ numberOfTargets: targets.length });
let relay = new RaddecRelay({ balancer: balancer });
relay.addChannel(RaddecRelayUdp, { sources: sources,
                                   targets: targets });
```


Options
-------

__raddec-relay__ supports the following options:

| Property              | Default | Description                            | 
|:----------------------|:--------|:---------------------------------------|
| enableForwarding      | true    | Forward raddecs from sources to targets (if both are present) through the balancer (if present) |
| balancer              | null    | A raddec-balancer instance             |
| raddecHandler         | null    | Function to call when source raddec received |


License
-------

MIT License

Copyright (c) 2019 [reelyActive](https://www.reelyactive.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.
