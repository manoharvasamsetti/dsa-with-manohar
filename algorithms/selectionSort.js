/**
 * selectionSort.js
 * Implementation of Selection Sort step generator
 */

const selectionSortDetails = {
    name: 'Selection Sort',
    description: 'The selection sort algorithm sorts an array by repeatedly finding the minimum element from unsorted part and putting it at the beginning.',
    time: 'O(n²)',
    space: 'O(1)',
    pseudocode: [
        'for i from 0 to N - 1',
        '    minIndex = i',
        '    for j from i + 1 to N',
        '        if a[j] < a[minIndex]',
        '            minIndex = j',
        '        end if',
        '    end for',
        '    swap(a[i], a[minIndex])',
        'end for'
    ],
    javaCode: `void selectionSort(int arr[]) {
    int n = arr.length;
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;
                
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`
};

function generateSelectionSortSteps(initialArray) {
    const steps = [];
    let arr = [...initialArray];
    const n = arr.length;

    const pushStep = (colors, line, operation) => {
        steps.push({ array: [...arr], colors: [...colors], line, operation });
    };

    pushStep(Array(n).fill('default'), 1, 'Starting Selection Sort');

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;

        let colors = Array(n).fill('default');
        for (let k = 0; k < i; k++) colors[k] = 'sorted';
        colors[minIndex] = 'pivot';

        pushStep(colors, 2, `Current minimum set to index ${minIndex} (value: ${arr[minIndex]})`);

        for (let j = i + 1; j < n; j++) {
            colors[j] = 'compare';
            pushStep(colors, 4, `Comparing ${arr[j]} with current min ${arr[minIndex]}`);

            if (arr[j] < arr[minIndex]) {
                minIndex = j;
                pushStep(colors, 5, `Found new minimum at index ${minIndex}`);
            }
            // Reset color of looked at element unless it is the new min
            colors[j] = 'default';
        }

        if (minIndex !== i) {
            let temp = arr[minIndex];
            arr[minIndex] = arr[i];
            arr[i] = temp;

            colors[i] = 'swap';
            colors[minIndex] = 'swap';
            pushStep(colors, 8, `Swapping element at index ${i} with min element at index ${minIndex}`);
        }
    }

    pushStep(Array(n).fill('sorted'), 9, 'Array is fully sorted.');
    return steps;
}

window.addEventListener('algorithmChanged', (e) => {
    if (e.detail.algoId === 'selectionSort') {
        window.appPseudocode.setCode(selectionSortDetails);
        const steps = generateSelectionSortSteps(e.detail.array);
        window.appControls.setSteps(steps);
    }
});
