/**
 * queue.js
 * Queue implementation and visualization sequence
 */

const queueDetails = {
    name: 'Queue (FIFO)',
    description: 'A Queue is a linear data structure that follows the First-In-First-Out (FIFO) principle. Elements can be added (enqueue) at the "Rear" and removed (dequeue) from the "Front".',
    time: 'Enqueue: O(1), Dequeue: O(1)',
    space: 'O(n)',
    pseudocode: [
        'Enqueue(value):',
        '    if rear == MAX_SIZE - 1',
        '        return "Queue Overflow"',
        '    if front == -1',
        '        front = 0',
        '    rear = rear + 1',
        '    queue[rear] = value',
        '',
        'Dequeue():',
        '    if front == -1 or front > rear',
        '        return "Queue Underflow"',
        '    value = queue[front]',
        '    front = front + 1',
        '    return value'
    ],
    javaCode: `class Queue {
    int front, rear, size;
    int capacity;
    int array[];
    
    public Queue(int capacity) {
        this.capacity = capacity;
        front = this.size = 0;
        rear = capacity - 1;
        array = new int[this.capacity];
    }
    
    // ... enqueue and dequeue methods following standard array logic ...
}`
};

function generateQueueSteps(initialArray) {
    const steps = [];
    const queue = [];
    let rear = -1;
    let front = -1;

    let sourceArr = [...initialArray].slice(0, 5);

    const pushStep = (colors, frontIdx, rearIdx, line, operation) => {
        let pointers = {};
        if (frontIdx !== -1 && frontIdx < queue.length) pointers[frontIdx] = (pointers[frontIdx] ? pointers[frontIdx] + ', Front' : 'Front');
        if (rearIdx !== -1 && rearIdx < queue.length) pointers[rearIdx] = (pointers[rearIdx] ? pointers[rearIdx] + ', Rear' : 'Rear');

        steps.push({
            type: 'boxes',
            array: [...queue],
            colors: [...colors],
            pointers,
            line,
            operation
        });
    };

    pushStep([], front, rear, 1, 'Initializing empty Queue, Front = -1, Rear = -1');

    // Simulate Enqueue
    for (let i = 0; i < sourceArr.length; i++) {
        let val = sourceArr[i];

        if (front === -1) front = 0;
        rear++;
        queue.push(val);

        let colors = Array(queue.length).fill('default');
        colors[rear] = 'pivot';
        pushStep(colors, 6, `Enqueued ${val} at Rear.`);
    }

    // Simulate Dequeue
    for (let i = 0; i < 3; i++) {
        let colors = Array(queue.length).fill('default');
        colors[front] = 'swap'; // Highlight to dequeue
        pushStep(colors, 12, `Preparing to dequeue element ${queue[front]} from Front`);

        // Abstract shifting because removing from start changes indices
        // In array representation of queue, usually front increments. We'll physically shift for visual clarity.
        let dequeued = queue.shift();
        rear--; // adjusting since we shifted visually
        if (queue.length === 0) { front = -1; rear = -1; }

        let afterColors = Array(queue.length).fill('default');
        pushStep(afterColors, 13, `Dequeued ${dequeued}.`);
    }

    pushStep(Array(queue.length).fill('default'), front, rear, -1, `Simulation Complete. Queue size: ${queue.length}`);
    return steps;
}

window.addEventListener('algorithmChanged', (e) => {
    if (e.detail.algoId === 'queue') {
        window.appPseudocode.setCode(queueDetails);
        const steps = generateQueueSteps(e.detail.array);
        window.appControls.setSteps(steps);
    }
});
