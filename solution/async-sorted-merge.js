"use strict";

const Heap = require("./heap");

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = async (logSources, printer) => {
  const heap = new Heap();

  // Populate the initial heap
  for (let i = 0; i < logSources.length; i++) {
    const log = await logSources[i].popAsync();
    heap.add(log, i);
  }

  let topLog, newLog;

  while (!heap.isEmpty()) {
    const logNode = heap.pop();
    printer.print(logNode.log);

    topLog = heap.peek();

    // Shortcut the heap if the same log source is the best option
    while (true) {
      newLog = await logSources[logNode.logSourceIndex].popAsync();
      if (newLog && topLog && newLog.date < topLog.log.date) {
        printer.print(newLog);
      } else {
        break;
      }
    }

    heap.add(newLog, logNode.logSourceIndex);
  }

  printer.done();
  console.log("Async sort complete.");
};
