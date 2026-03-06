/**
 * binarySearch.js
 * Implementation of Binary Search step generator
 */

const binarySearchDetails = {
    name: 'Binary Search',
    description: 'Binary search is a fast search algorithm with run-time complexity of O(log n). This search algorithm works on the principle of divide and conquer. For this algorithm to work properly, the data collection should be in a sorted form.',
    time: 'O(log n)',
    space: 'O(1)',
    pseudocode: [
        'low = 0, high = N - 1',
        'while low <= high',
        '    mid = (low + high) / 2',
        '    if a[mid] == target',
        '        return mid',
        '    if a[mid] < target',
        '        low = mid + 1',
        '    else',
        '        high = mid - 1',
        'end while',
        'return -1'
    ],
    javaCode: `int binarySearch(int arr[], int x) {
    int l = 0, r = arr.length - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x)
            return m;
        if (arr[m] < x)
            l = m + 1;
        else
            r = m - 1;
    }
    return -1;
}`
};

function generateBinarySearchSteps(initialArray) {
    const steps = [];

    // Binary Search requires sorted array!
    let arr = [...initialArray];
    arr.sort((a, b) => a - b);

    const n = arr.length;

    // Target logic
    let target;
    if (Math.random() < 0.7) target = arr[Math.floor(Math.random() * n)];
    else target = Math.floor(Math.random() * 100) + 1;

    const opPrefix = `Searching for Target: ${target}. `;

    const pushStep = (colors, line, operation) => {
        steps.push({ array: [...arr], colors: [...colors], line, operation: opPrefix + operation });
    };

    pushStep(Array(n).fill('default'), 1, 'Array must be sorted. Initializing low and high pointers.');

    let low = 0;
    let high = n - 1;
    let found = false;

    while (low <= high) {
        let colors = Array(n).fill('default');
        // Gray out elements outside search space
        for (let i = 0; i < n; i++) {
            if (i < low || i > high) colors[i] = '#334155'; // Darker gray
        }

        let mid = Math.floor((low + high) / 2);
        colors[mid] = 'pivot';

        pushStep(colors, 3, `Calculated mid index = ${mid} (value: ${arr[mid]})`);

        colors[mid] = 'compare';
        pushStep(colors, 4, `Comparing middle element ${arr[mid]} with target ${target}`);

        if (arr[mid] === target) {
            colors[mid] = 'sorted'; // Green for found
            pushStep(colors, 5, `Found target ${target} at index ${mid}!`);
            found = true;
            break;
        }

        if (arr[mid] < target) {
            pushStep(colors, 6, `${arr[mid]} is less than target, searching right half.`);
            low = mid + 1;
            pushStep(colors, 7, `Updated low = ${low}`);
        } else {
            pushStep(colors, 8, `${arr[mid]} is greater than target, searching left half.`);
            high = mid - 1;
            pushStep(colors, 9, `Updated high = ${high}`);
        }
    }

    if (!found) {
        pushStep(Array(n).fill('#334155'), 11, `Target ${target} not found in array.`);
    }

    return steps;
}

window.addEventListener('algorithmChanged', (e) => {
    if (e.detail.algoId === 'binarySearch') {
        // We might want to sort the input box physically to avoid confusion, 
        // but it's okay, we'll sort in memory and display sorted on the visualizer.
        window.appPseudocode.setCode(binarySearchDetails);
        const steps = generateBinarySearchSteps(e.detail.array);
        window.appControls.setSteps(steps);
    }
});
