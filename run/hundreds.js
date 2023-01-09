"use strict";

var benchmark = require("benchmark");

var EventEmitter1 = require("events").EventEmitter,
  {
    AsyncEventEmitter: EventEmitter3,
  } = require("@vladfrangu/async_event_emitter");

function foo() {
  if (arguments.length > 100) console.log("damn");

  return 1;
}

var ee1 = new EventEmitter1(),
  ee3 = new EventEmitter3(),
  j,
  i;

for (i = 0; i < 10; i++) {
  for (j = 0; j < 10; j++) {
    ee1.on("event:" + i, foo);
    ee3.on("event:" + i, foo);
  }
}

new benchmark.Suite()
  .add("Node-events", function () {
    for (i = 0; i < 10; i++) {
      ee1.emit("event:" + i);
    }
  })
  .add("@vladfrangu/async_event_emitter", function () {
    for (i = 0; i < 10; i++) {
      ee3.emit("event:" + i);
    }
  })
  .on("cycle", function cycle(e) {
    console.log(e.target.toString());
  })
  .on("complete", function completed() {
    console.log("Fastest is %s", this.filter("fastest").map("name"));
  })
  .run({ async: true });
