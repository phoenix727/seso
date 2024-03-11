class Node {
  constructor(log, logSourceIndex) {
    this.log = log;
    this.logSourceIndex = logSourceIndex;
  }
}

module.exports = class Heap {
  constructor() {
    this.values = [];
  }

  #swap(index1, index2) {
    const temp = this.values[index1];
    this.values[index1] = this.values[index2];
    this.values[index2] = temp;
  }

  add(log, logSourceIndex) {
    if (!log) return;

    this.values.push(new Node(log, logSourceIndex));

    let childIndex = this.values.length - 1;

    while (childIndex > 0) {
      let parentIndex = Math.floor((childIndex - 1) / 2);
      let parentValue = this.values[parentIndex];
      let childValue = this.values[childIndex];

      if (parentValue.log.date > childValue.log.date) {
        this.#swap(childIndex, parentIndex);
        childIndex = parentIndex;
      } else {
        break;
      }
    }
  }

  pop() {
    this.#swap(0, this.values.length - 1);

    const poppedNode = this.values.pop();

    if (this.values.length > 1) {
      let parentIndex = 0;
      const valuesLength = this.values.length;
      const topValue = this.values[0];

      while (true) {
        let leftChildIndex = 2 * parentIndex + 1;
        let rightChildIndex = 2 * parentIndex + 2;
        let indexToSwap;

        if (leftChildIndex < valuesLength) {
          if (this.values[leftChildIndex].log.date < topValue.log.date) {
            indexToSwap = leftChildIndex;
          }
        }

        if (rightChildIndex < valuesLength) {
          if (
            (this.values[rightChildIndex].log.date < topValue.log.date &&
              indexToSwap === undefined) ||
            (this.values[rightChildIndex].log.date <
              this.values[leftChildIndex].log.date &&
              indexToSwap !== undefined)
          ) {
            indexToSwap = rightChildIndex;
          }
        }

        if (indexToSwap === undefined) {
          break;
        }

        this.#swap(parentIndex, indexToSwap);
        parentIndex = indexToSwap;
      }
    }

    return poppedNode;
  }

  peek() {
    return this.values[0];
  }

  isEmpty() {
    return this.values.length === 0;
  }
};
