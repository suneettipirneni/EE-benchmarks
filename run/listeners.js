"use strict";

var benchmark = require("benchmark");

var EventEmitter1 = require("events").EventEmitter,
  EventEmitter3 = require("@vladfrangu/async_event_emitter").AsyncEventEmitter;

var MAX_LISTENERS = Math.pow(2, 32) - 1;

function handle() {
  if (arguments.length > 100) console.log("damn");
}

var ee1 = new EventEmitter1(),
  ee3 = new EventEmitter3();

ee1.setMaxListeners(MAX_LISTENERS);
ee3.setMaxListeners(MAX_LISTENERS);
for (var i = 0; i < 25; i++) {
  ee1.on("event", handle);
  ee3.on("event", handle);
}

//
// eventemitter2 doesn't correctly handle listeners as they can be removed by
// doing `ee2.listeners('event').length = 0;`. Same counts for Drip.
//
// event-emitter and contra/emitter do not implement `listeners`.
//

new benchmark.Suite()
  .add("Node-events", function () {
    ee1.listeners("event");
  })
  .add("@vladfrangu/async_event_emitter", function () {
    ee3.listeners("event");
  })
  .on("cycle", function cycle(e) {
    console.log(e.target.toString());
  })
  .on("complete", function completed() {
    console.log("Fastest is %s", this.filter("fastest").map("name"));
  })
  .run({ async: true });
