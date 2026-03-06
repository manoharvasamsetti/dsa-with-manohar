/**
 * linkedList.js
 * Linked List implementation and visualization (Singly Linked List Insertion at End)
 */

const linkedListDetails = {
    name: 'Linked List (Insertion)',
    description: 'A linked list is a linear collection of data elements whose order is not given by their physical placement in memory. Instead, each element points to the next.',
    time: 'Insertion at end: O(n) without tail pointer, O(1) with tail',
    space: 'O(n)',
    pseudocode: [
        'InsertEnding(head, value):',
        '    newNode = Node(value)',
        '    if head == null',
        '        head = newNode',
        '        return head',
        '    temp = head',
        '    while temp.next != null',
        '        temp = temp.next',
        '    temp.next = newNode',
        '    return head'
    ],
    javaCode: `class Node {
    int data;
    Node next;
    Node(int d) { data = d; next = null; }
}

class LinkedList {
    Node head;
    
    public void append(int new_data) {
        Node new_node = new Node(new_data);
        if (head == null) {
            head = new Node(new_data);
            return;
        }
        new_node.next = null;
        Node last = head; 
        while (last.next != null)
            last = last.next;
        last.next = new_node;
        return;
    }
}`
};

function generateLinkedListSteps(initialArray) {
    const steps = [];
    const nodes = [];
    const edges = [];

    let sourceArr = [...initialArray].slice(0, 6); // Max 6 nodes for space reasons

    const pushStep = (nodeColors, line, operation) => {
        // Apply colors
        const styledNodes = nodes.map((n, i) => ({ ...n, color: nodeColors[i] || 'default' }));
        steps.push({ type: 'graph', nodes: styledNodes, edges: [...edges], line, operation });
    };

    pushStep([], 1, 'Initializing empty Linked List');

    for (let i = 0; i < sourceArr.length; i++) {
        let val = sourceArr[i];
        let newNodeIdx = nodes.length;

        let colors = Array(nodes.length).fill('default');
        pushStep(colors, 2, `Creating new node with value ${val}`);

        // Add new node physically, but maybe unconnected
        let expectedX = 10 + (newNodeIdx * 15);
        nodes.push({ id: newNodeIdx, value: val, x: expectedX, y: 50 });
        colors.push('pivot');

        if (newNodeIdx === 0) {
            pushStep(colors, 4, `List is empty. New node becomes Head.`);
        } else {
            pushStep(colors, 6, `Traversing to find the end of the list.`);

            // Highlight traversal
            for (let j = 0; j < newNodeIdx; j++) {
                let travColors = Array(nodes.length).fill('default');
                travColors[newNodeIdx] = 'pivot'; // The new node waiting to be attached
                travColors[j] = 'compare'; // The traversal node
                pushStep(travColors, 8, `Checking node with value ${nodes[j].value}. Has next? ${j < newNodeIdx - 1 ? 'Yes' : 'No'}`);
            }

            // Connect
            edges.push({ from: newNodeIdx - 1, to: newNodeIdx, directed: true, color: 'var(--accent-color)' });
            let connectColors = Array(nodes.length).fill('default');
            connectColors[newNodeIdx] = 'sorted';
            pushStep(connectColors, 9, `Connected previous tail to new node.`);
        }
    }

    pushStep(Array(nodes.length).fill('default'), -1, `Simulation Complete: Linked List constructed.`);
    return steps;
}

window.addEventListener('algorithmChanged', (e) => {
    if (e.detail.algoId === 'linkedList') {
        window.appPseudocode.setCode(linkedListDetails);
        const steps = generateLinkedListSteps(e.detail.array);
        window.appControls.setSteps(steps);
    }
});
