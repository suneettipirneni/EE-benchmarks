"use strict";

var benchmark = require("benchmark");

var EventEmitter1 = require("events").EventEmitter,
  EventEmitter3 = require("@vladfrangu/async_event_emitter").AsyncEventEmitter;

function handle() {
  if (arguments.length > 100) console.log("damn");
}

var ee1 = new EventEmitter1(),
  ee3 = new EventEmitter3();

[(ee1, ee3)].forEach(function ohai(emitter) {
  emitter.on("foo", handle);

  //
  // We add and remove a listener to see if the event emitter implementation is
  // de-optimized because it deletes items from an object etc.
  //
  emitter.on("ohai", ohai);
  if (emitter.removeListener) emitter.removeListener("ohai", ohai);
  else if (emitter.off) emitter.off("ohai", ohai);
  else throw new Error("No proper remove implementation");
});

//
// FastEmitter is omitted as it throws an error.
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
