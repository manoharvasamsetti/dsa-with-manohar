/**
 * stack.js
 * Stack implementation and visualization sequence
 */

const stackDetails = {
    name: 'Stack (LIFO)',
    description: 'A Stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle. Elements can be added (push) and removed (pop) only from one end called the "Top".',
    time: 'Push: O(1), Pop: O(1)',
    space: 'O(n)',
    pseudocode: [
        'Push(value):',
        '    if top == MAX_SIZE - 1',
        '        return "Stack Overflow"',
        '    top = top + 1',
        '    stack[top] = value',
        '',
        'Pop():',
        '    if top == -1',
        '        return "Stack Underflow"',
        '    value = stack[top]',
        '    top = top - 1',
        '    return value'
    ],
    javaCode: `class Stack {
    int max = 1000;
    int top;
    int a[] = new int[max]; 

    Stack() { top = -1; }

    boolean push(int x) {
        if (top >= (max - 1)) return false;
        a[++top] = x;
        return true;
    }

    int pop() {
        if (top < 0) return 0;
        return a[top--];
    }
}`
};

function generateStackSteps(initialArray) {
    const steps = [];
    const stack = [];

    // We'll simulate pushing 5 elements from the array, then popping 3
    let sourceArr = [...initialArray].slice(0, 5);

    const pushStep = (colors, pointers, line, operation) => {
        steps.push({
            type: 'boxes',
            array: [...stack],
            colors: [...colors],
            pointers: { ...pointers },
            line,
            operation
        });
    };

    pushStep([], {}, 1, 'Initializing empty Stack, Top = -1');

    // Simulate Pushing
    for (let i = 0; i < sourceArr.length; i++) {
        let val = sourceArr[i];
        pushStep(Array(stack.length).fill('default'), { [stack.length - 1]: 'Top' }, 4, `Preparing to push ${val}`);

        stack.push(val);

        let colors = Array(stack.length).fill('default');
        colors[stack.length - 1] = 'pivot'; // Highlight newly pushed
        pushStep(colors, 5, `Pushed ${val} onto the Stack.`);
    }

    // Simulate Popping
    for (let i = 0; i < 3; i++) {
        let colors = Array(stack.length).fill('default');
        colors[stack.length - 1] = 'swap'; // Highlight to pop
        pushStep(colors, 10, `Preparing to pop element ${stack[stack.length - 1]}`);

        let popped = stack.pop();

        let afterColors = Array(stack.length).fill('default');
        let pointers = stack.length > 0 ? { [stack.length - 1]: 'Top' } : {};
        pushStep(afterColors, 11, `Popped ${popped} from the Stack.`);
    }

    pushStep(Array(stack.length).fill('default'), -1, `Simulation Complete. Stack size: ${stack.length}`);
    return steps;
}

window.addEventListener('algorithmChanged', (e) => {
    if (e.detail.algoId === 'stack') {
        window.appPseudocode.setCode(stackDetails);
        const steps = generateStackSteps(e.detail.array);
        window.appControls.setSteps(steps);
    }
});
