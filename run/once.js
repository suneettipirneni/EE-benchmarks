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
  .add("Node-Events", function () {
    ee1.once("foo", handle).emit("foo");
  })
  .add("EventEmitter2", function () {
    ee2.once("foo", handle).emit("foo");
  })
  .add("@vladfrangu/async_event_emitter", function () {
    ee3.once("foo", handle).emit("foo");
  })
  .on("complete", function completed() {
    console.log("Fastest is %s", this.filter("fastest").map("name"));
  })
  .run({ async: true });
