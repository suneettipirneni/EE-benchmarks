"use strict";

var benchmark = require("benchmark");

var EventEmitter1 = require("events").EventEmitter,
  EventEmitter3 = require("@vladfrangu/async_event_emitter").AsyncEventEmitter;

//
// This is used to prevent the functions below from being transformed into
// noops.
//
var emitter;

new benchmark.Suite()
  .add("Node-events", function () {
    emitter = new EventEmitter1();
  })
  .add("@vladfrangu/async_event_emitter", function () {
    emitter = new EventEmitter3();
  })
  .on("cycle", function cycle(e) {
    console.log(e.target.toString());
  })
  .on("complete", function completed() {
    console.log("Fastest is %s", this.filter("fastest").map("name"));
  })
  .run({ async: true });
