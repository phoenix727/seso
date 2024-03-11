"use strict";

const Heap = require("./heap");

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  const heap = new Heap();

  // Populate the initial heap
  for (let i = 0; i < logSources.length; i++) {
    heap.add(logSources[i].pop(), i);
  }

  let topLog, newLog;

  while (!heap.isEmpty()) {
    const logNode = heap.pop();
    printer.print(logNode.log);

    topLog = heap.peek();

    // Shortcut the heap if the same log source is the best option
    while (true) {
      newLog = logSources[logNode.logSourceIndex].pop();
      if (newLog && topLog && newLog.date < topLog.log.date) {
        printer.print(newLog);
      } else {
        break;
      }
    }

    heap.add(newLog, logNode.logSourceIndex);
  }

  printer.done();
  return console.log("Sync sort complete.");
};
