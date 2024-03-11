"use strict";

const Heap = require("./heap");

// Print all entries, across all of the *async* sources, in chronological order.

const PRELOAD_COUNT = 25;
const logCounts = [];

async function populateHeap(heap, logSources) {
  const promises = [];
  for (let i = 0; i < logSources.length; i++) {
    if (!logSources[i].drained) {
      promises.push(addNextLogToHeap(heap, logSources[i], i));
    }
  }

  return Promise.all(promises);
}

async function addNextLogToHeap(heap, logSource, logSourceIndex) {
  if (logSource.drained) return;

  const log = await logSource.popAsync();

  if (log) {
    logCounts[logSourceIndex] += 1;
    heap.add(log, logSourceIndex);
  }
}

module.exports = async (logSources, printer) => {
  const heap = new Heap();
  for (let i = 0; i < logSources.length; i++) {
    logCounts[i] = 0;
  }

  // Populate the initial heap
  await populateHeap(heap, logSources);

  while (!heap.isEmpty()) {
    const logNode = heap.pop();
    logCounts[logNode.logSourceIndex] -= 1;
    printer.print(logNode.log);

    if (logCounts[logNode.logSourceIndex] < PRELOAD_COUNT) {
      await populateHeap(heap, logSources);
    }
  }

  printer.done();
  console.log("Async sort complete.");
};
