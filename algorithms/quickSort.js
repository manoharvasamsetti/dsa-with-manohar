/**
 * quickSort.js
 * Implementation of Quick Sort step generator
 */

const quickSortDetails = {
    name: 'Quick Sort',
    description: 'QuickSort is a Divide and Conquer algorithm. It picks an element as a pivot and partitions the given array around the picked pivot.',
    time: 'O(n log n)',
    space: 'O(log n)',
    pseudocode: [
        'QuickSort(arr, low, high):',
        '    if low < high',
        '        pivotIndex = Partition(arr, low, high)',
        '        QuickSort(arr, low, pivotIndex - 1)',
        '        QuickSort(arr, pivotIndex + 1, high)',
        '',
        'Partition(arr, low, high):',
        '    pivot = arr[high]',
        '    i = low - 1',
        '    for j from low to high - 1',
        '        if a[j] < pivot',
        '            i++',
        '            swap(a[i], a[j])',
        '        end if',
        '    swap(a[i + 1], a[high])',
        '    return i + 1'
    ],
    javaCode: `void quickSort(int arr[], int begin, int end) {
    if (begin < end) {
        int partitionIndex = partition(arr, begin, end);
        quickSort(arr, begin, partitionIndex-1);
        quickSort(arr, partitionIndex+1, end);
    }
}
int partition(int arr[], int begin, int end) {
    int pivot = arr[end];
    int i = (begin-1);

    for (int j = begin; j < end; j++) {
        if (arr[j] <= pivot) {
            i++;
            int swapTemp = arr[i];
            arr[i] = arr[j];
            arr[j] = swapTemp;
        }
    }
    int swapTemp = arr[i+1];
    arr[i+1] = arr[end];
    arr[end] = swapTemp;
    return i+1;
}`
};

function generateQuickSortSteps(initialArray) {
    const steps = [];
    let arr = [...initialArray];
    const n = arr.length;

    const pushStep = (colors, line, operation) => {
        steps.push({ array: [...arr], colors: [...colors], line, operation });
    };

    pushStep(Array(n).fill('default'), 1, 'Starting Quick Sort');

    function partition(low, high) {
        let pivot = arr[high];
        let i = low - 1;

        let colors = Array(n).fill('default');
        colors[high] = 'pivot';
        pushStep(colors, 8, `Selected pivot ${pivot} at index ${high}`);

        for (let j = low; j < high; j++) {
            colors = Array(n).fill('default');
            colors[high] = 'pivot';
            colors[j] = 'compare';
            if (i >= low) colors[i] = 'sorted'; // Just to demark region

            pushStep(colors, 11, `Comparing ${arr[j]} with pivot ${pivot}`);

            if (arr[j] < pivot) {
                i++;
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;

                colors[i] = 'swap';
                colors[j] = 'swap';
                pushStep(colors, 13, `Swapped ${arr[i]} and ${arr[j]} since ${arr[i]} < pivot`);
            }
        }

        let temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;

        colors = Array(n).fill('default');
        colors[i + 1] = 'sorted';
        colors[high] = 'swap';
        pushStep(colors, 15, `Moved pivot ${pivot} into correct sorted position ${i + 1}`);

        return i + 1;
    }

    function quickSort(low, high) {
        if (low < high) {
            let pi = partition(low, high);
            quickSort(low, pi - 1);
            quickSort(pi + 1, high);
        }
    }

    quickSort(0, n - 1);

    pushStep(Array(n).fill('sorted'), -1, 'Array is fully sorted.');
    return steps;
}

window.addEventListener('algorithmChanged', (e) => {
    if (e.detail.algoId === 'quickSort') {
        window.appPseudocode.setCode(quickSortDetails);
        const steps = generateQuickSortSteps(e.detail.array);
        window.appControls.setSteps(steps);
    }
});
