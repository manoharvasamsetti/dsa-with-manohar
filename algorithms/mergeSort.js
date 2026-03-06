/**
 * mergeSort.js
 * Implementation of Merge Sort step generator
 */

const mergeSortDetails = {
    name: 'Merge Sort',
    description: 'Merge Sort is a Divide and Conquer algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.',
    time: 'O(n log n)',
    space: 'O(n)',
    pseudocode: [
        'MergeSort(arr, left, right):',
        '    if left >= right',
        '        return',
        '    mid = (left + right) / 2',
        '    MergeSort(arr, left, mid)',
        '    MergeSort(arr, mid + 1, right)',
        '    Merge(arr, left, mid, right)'
    ],
    javaCode: `void sort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        sort(arr, l, m);
        sort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`
};

function generateMergeSortSteps(initialArray) {
    const steps = [];
    let arr = [...initialArray];
    const n = arr.length;

    const pushStep = (colors, line, operation) => {
        steps.push({ array: [...arr], colors: [...colors], line, operation });
    };

    pushStep(Array(n).fill('default'), 1, 'Starting Merge Sort');

    function merge(l, m, r) {
        let n1 = m - l + 1;
        let n2 = r - m;
        let L = new Array(n1);
        let R = new Array(n2);

        for (let i = 0; i < n1; i++) L[i] = arr[l + i];
        for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

        let i = 0, j = 0, k = l;

        while (i < n1 && j < n2) {
            let colors = Array(n).fill('default');
            colors[l + i] = 'compare';
            colors[m + 1 + j] = 'compare';
            pushStep(colors, 7, `Merging: Comparing ${L[i]} and ${R[j]}`);

            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            colors[k] = 'swap';
            pushStep(colors, 7, `Merged element ${arr[k]} into position ${k}`);
            k++;
        }

        while (i < n1) {
            arr[k] = L[i];
            let colors = Array(n).fill('default');
            colors[k] = 'swap';
            pushStep(colors, 7, `Copying remaining element ${L[i]} from left half`);
            i++; k++;
        }

        while (j < n2) {
            arr[k] = R[j];
            let colors = Array(n).fill('default');
            colors[k] = 'swap';
            pushStep(colors, 7, `Copying remaining element ${R[j]} from right half`);
            j++; k++;
        }

        // Show sorted section
        let sortedColors = Array(n).fill('default');
        for (let x = l; x <= r; x++) sortedColors[x] = 'sorted';
        pushStep(sortedColors, 7, `Sub-array from index ${l} to ${r} is merged and sorted`);
    }

    function mergeSort(l, r) {
        if (l >= r) return;

        let m = l + Math.floor((r - l) / 2);

        let colors = Array(n).fill('default');
        colors[m] = 'pivot';
        pushStep(colors, 4, `Dividing array at mid = ${m}`);

        mergeSort(l, m);
        mergeSort(m + 1, r);
        merge(l, m, r);
    }

    mergeSort(0, n - 1);

    pushStep(Array(n).fill('sorted'), -1, 'Array is fully sorted.');
    return steps;
}

window.addEventListener('algorithmChanged', (e) => {
    if (e.detail.algoId === 'mergeSort') {
        window.appPseudocode.setCode(mergeSortDetails);
        const steps = generateMergeSortSteps(e.detail.array);
        window.appControls.setSteps(steps);
    }
});
