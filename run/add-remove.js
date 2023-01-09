"use strict";

var benchmark = require("benchmark");

var EventEmitter1 = require("events").EventEmitter,
  EventEmitter3 = require("@vladfrangu/async_event_emitter").AsyncEventEmitter;

function handle() {
  if (arguments.length > 100) console.log("damn");
}

var ee1 = new EventEmitter1(),
  ee3 = new EventEmitter3();

new benchmark.Suite()
  .add("node-Events", function () {
    ee1.on("foo", handle);
    ee1.removeListener("foo", handle);
  })
  .add("@vladfrangu/async_event_emitter", function () {
    ee3.on("foo", handle);
    ee3.removeListener("foo", handle);
  })
  .on("cycle", function cycle(e) {
    console.log(e.target.toString());
  })
  .on("complete", function completed() {
    console.log("Fastest is %s", this.filter("fastest").map("name"));
  })
  .run({ async: true });
