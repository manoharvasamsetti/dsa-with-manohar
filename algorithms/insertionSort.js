/**
 * insertionSort.js
 * Implementation of Insertion Sort step generator
 */

const insertionSortDetails = {
    name: 'Insertion Sort',
    description: 'Insertion sort is a simple sorting algorithm that builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
    time: 'O(n²)',
    space: 'O(1)',
    pseudocode: [
        'for i from 1 to N - 1',
        '    key = a[i]',
        '    j = i - 1',
        '    while j >= 0 and a[j] > key',
        '        a[j+1] = a[j]',
        '        j = j - 1',
        '    end while',
        '    a[j+1] = key',
        'end for'
    ],
    javaCode: `void insertionSort(int arr[]) {
    int n = arr.length;
    for (int i = 1; i < n; ++i) {
        int key = arr[i];
        int j = i - 1;

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`
};

function generateInsertionSortSteps(initialArray) {
    const steps = [];
    let arr = [...initialArray];
    const n = arr.length;

    const pushStep = (colors, line, operation) => {
        steps.push({ array: [...arr], colors: [...colors], line, operation });
    };

    pushStep(Array(n).fill('default'), 1, 'Starting Insertion Sort');

    // First element is trivially sorted
    let sortedCount = 1;

    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;

        let colors = Array(n).fill('default');
        for (let k = 0; k < i; k++) colors[k] = 'sorted';
        colors[i] = 'pivot';

        pushStep(colors, 2, `Selected ${key} as key to insert into sorted portion`);

        while (j >= 0 && arr[j] > key) {
            colors[j] = 'compare';
            pushStep(colors, 4, `Comparing ${arr[j]} with key ${key}`);

            arr[j + 1] = arr[j];

            colors[j] = 'swap';
            colors[j + 1] = 'swap';
            pushStep(colors, 5, `Moved ${arr[j]} to right`);

            colors[j] = 'sorted';
            colors[j + 1] = 'sorted';
            j = j - 1;
        }

        if (j >= 0) {
            colors[j] = 'compare';
            pushStep(colors, 4, `Comparing ${arr[j]} with key ${key} - condition false`);
        }

        arr[j + 1] = key;
        colors[j + 1] = 'pivot';
        pushStep(colors, 8, `Inserted key ${key} at index ${j + 1}`);
    }

    pushStep(Array(n).fill('sorted'), 9, 'Array is fully sorted.');
    return steps;
}

window.addEventListener('algorithmChanged', (e) => {
    if (e.detail.algoId === 'insertionSort') {
        window.appPseudocode.setCode(insertionSortDetails);
        const steps = generateInsertionSortSteps(e.detail.array);
        window.appControls.setSteps(steps);
    }
});
