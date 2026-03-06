/**
 * linearSearch.js
 * Implementation of Linear Search step generator
 */

const linearSearchDetails = {
    name: 'Linear Search',
    description: 'Linear search sequentially checks each element of the list until a match is found or the whole list has been searched.',
    time: 'O(n)',
    space: 'O(1)',
    pseudocode: [
        'for i from 0 to N - 1',
        '    if a[i] == target',
        '        return i',
        '    end if',
        'end for',
        'return -1'
    ],
    javaCode: `int linearSearch(int arr[], int x) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        if (arr[i] == x)
            return i;
    }
    return -1;
}`
};

function generateLinearSearchSteps(initialArray) {
    const steps = [];
    let arr = [...initialArray];
    const n = arr.length;

    // Choose a target: randomly pick an existing element 70% of the time, or a missing one 30% of the time.
    let target;
    if (Math.random() < 0.7) {
        target = arr[Math.floor(Math.random() * n)];
    } else {
        target = Math.floor(Math.random() * 100) + 1;
    }

    // Update the control panel so user knows what is being searched
    const operationPrefix = `Searching for Target: ${target}. `;

    const pushStep = (colors, line, operation) => {
        steps.push({ array: [...arr], colors: [...colors], line, operation: operationPrefix + operation });
    };

    pushStep(Array(n).fill('default'), 1, 'Starting Linear Search');

    let found = false;
    for (let i = 0; i < n; i++) {
        let colors = Array(n).fill('default');
        // Elements already checked could be slightly faded, but let's just use default for simplicity
        colors[i] = 'compare';

        pushStep(colors, 2, `Checking if ${arr[i]} == ${target}`);

        if (arr[i] === target) {
            colors[i] = 'sorted'; // Use green for found
            pushStep(colors, 3, `Found target ${target} at index ${i}!`);
            found = true;
            break;
        }
    }

    if (!found) {
        pushStep(Array(n).fill('default'), 6, `Target ${target} not found in the array.`);
    }

    return steps;
}

window.addEventListener('algorithmChanged', (e) => {
    if (e.detail.algoId === 'linearSearch') {
        window.appPseudocode.setCode(linearSearchDetails);
        const steps = generateLinearSearchSteps(e.detail.array);
        window.appControls.setSteps(steps);
    }
});
