/**
 * bubbleSort.js
 * Implementation of Bubble Sort step generator
 */

const bubbleSortDetails = {
    name: 'Bubble Sort',
    description: 'Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in the wrong order.',
    time: 'O(n²)',
    space: 'O(1)',
    pseudocode: [
        'for i from 0 to N - 1',
        '    for j from 0 to N - i - 1',
        '        if a[j] > a[j+1]',
        '            swap(a[j], a[j+1])',
        '        end if',
        '    end for',
        'end for'
    ],
    javaCode: `void bubbleSort(int arr[]) {
    int n = arr.length;
    for (int i = 0; i < n-1; i++)
        for (int j = 0; j < n-i-1; j++)
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
}`
};

function generateBubbleSortSteps(initialArray) {
    const steps = [];
    let arr = [...initialArray];
    const n = arr.length;

    // Helper to push state
    const pushStep = (colors, line, operation) => {
        steps.push({
            array: [...arr],
            colors: [...colors],
            line,
            operation
        });
    };

    // Initial state
    pushStep(Array(n).fill('default'), 1, 'Starting Bubble Sort');

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {

            // Build current colors map
            let colors = Array(n).fill('default');
            // Mark previously sorted elements at the end
            for (let k = n - 1; k > n - 1 - i; k--) {
                colors[k] = 'sorted';
            }
            colors[j] = 'compare';
            colors[j + 1] = 'compare';

            pushStep(colors, 3, `Comparing ${arr[j]} and ${arr[j + 1]}`);

            if (arr[j] > arr[j + 1]) {
                // Swap
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;

                colors[j] = 'swap';
                colors[j + 1] = 'swap';
                pushStep(colors, 4, `Swapped ${arr[j + 1]} and ${arr[j]} because ${arr[j + 1]} > ${arr[j]}`);
            }
        }
    }

    // Final sorted state
    pushStep(Array(n).fill('sorted'), 7, 'Array is fully sorted.');
    return steps;
}

// Hook into app event
window.addEventListener('algorithmChanged', (e) => {
    if (e.detail.algoId === 'bubbleSort') {
        window.appPseudocode.setCode(bubbleSortDetails);
        const steps = generateBubbleSortSteps(e.detail.array);
        window.appControls.setSteps(steps);
    }
});
