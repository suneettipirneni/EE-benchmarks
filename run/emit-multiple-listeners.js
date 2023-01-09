"use strict";

var benchmark = require("benchmark");

var EventEmitter1 = require("events").EventEmitter,
  EventEmitter3 = require("@vladfrangu/async_event_emitter").AsyncEventEmitter;

function foo() {
  if (arguments.length > 100) console.log("damn");

  return 1;
}

function bar() {
  if (arguments.length > 100) console.log("damn");

  return false;
}

function baz() {
  if (arguments.length > 100) console.log("damn");

  return true;
}

var ee1 = new EventEmitter1(),
  ee3 = new EventEmitter3();

ee3.on("foo", foo).on("foo", bar).on("foo", baz);
ee1.on("foo", foo).on("foo", bar).on("foo", baz);

//
// Drip is omitted as it throws an error.
// Ref: https://github.com/qualiancy/drip/pull/4
//

new benchmark.Suite()
  .add("Node-Events", function () {
    ee1.emit("foo");
    ee1.emit("foo", "bar");
    ee1.emit("foo", "bar", "baz");
    ee1.emit("foo", "bar", "baz", "boom");
  })
  .add("@vladfrangu/async_event_emitter", function () {
    ee3.emit("foo");
    ee3.emit("foo", "bar");
    ee3.emit("foo", "bar", "baz");
    ee3.emit("foo", "bar", "baz", "boom");
  })
  .on("cycle", function cycle(e) {
    console.log(e.target.toString());
  })
  .on("complete", function completed() {
    console.log("Fastest is %s", this.filter("fastest").map("name"));
  })
  .run({ async: true });
