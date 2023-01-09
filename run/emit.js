"use strict";

var benchmark = require("benchmark");

var EventEmitter1 = require("events").EventEmitter,
  EventEmitter3 = require("@vladfrangu/async_event_emitter").AsyncEventEmitter;

function handle() {
  if (arguments.length > 100) console.log("damn");
}

var ee1 = new EventEmitter1(),
  ee3 = new EventEmitter3();

ee3.on("foo", handle);
ee1.on("foo", handle);

new benchmark.Suite()
  .add("Node-events", function () {
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
