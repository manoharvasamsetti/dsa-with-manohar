/**
 * bst.js
 * Binary Search Tree Insertion
 */

const bstDetails = {
    name: 'Binary Search Tree (Insertion)',
    description: 'A Binary Search Tree (BST) is a tree data structure in which each node has at most two children, referred to as the left child and the right child. For each node, all elements in the left subtree are less than the node, and all in the right subtree are greater.',
    time: 'Search/Insertion: O(log n) average, O(n) worst',
    space: 'O(n)',
    pseudocode: [
        'Insert(node, key):',
        '    if node == null',
        '        return Node(key)',
        '    if key < node.key',
        '        node.left = Insert(node.left, key)',
        '    else if key > node.key',
        '        node.right = Insert(node.right, key)',
        '    return node'
    ],
    javaCode: `class Node {
    int key;
    Node left, right;
    public Node(int item) {
        key = item;
        left = right = null;
    }
}

class BinarySearchTree {
    Node root;
    
    Node insertRec(Node root, int key) {
        if (root == null) {
            root = new Node(key);
            return root;
        }
        if (key < root.key)
            root.left = insertRec(root.left, key);
        else if (key > root.key)
            root.right = insertRec(root.right, key);
        return root;
    }
}`
};

function generateBSTSteps(initialArray) {
    const steps = [];
    const nodes = [];
    const edges = [];

    let sourceArr = [...initialArray].slice(0, 10); // Keep it small so it fits

    const pushStep = (nodeColors, line, operation) => {
        const styledNodes = nodes.map((n, i) => ({ ...n, color: nodeColors[i] || 'default' }));
        steps.push({ type: 'graph', nodes: styledNodes, edges: [...edges], line, operation });
    };

    pushStep([], 1, 'Initializing empty BST');

    class TreeNode {
        constructor(val, id, x, y, dx) {
            this.val = val;
            this.id = id;
            this.x = x;
            this.y = y;
            this.dx = dx; // distance modifier for children
            this.left = null;
            this.right = null;
        }
    }

    let root = null;

    for (let i = 0; i < sourceArr.length; i++) {
        let val = sourceArr[i];
        let newId = nodes.length;

        pushStep(Array(nodes.length).fill('default'), 2, `Preparing to insert ${val}`);

        if (!root) {
            root = new TreeNode(val, newId, 50, 15, 20);
            nodes.push({ id: newId, value: val, x: root.x, y: root.y });

            let colors = Array(nodes.length).fill('default');
            colors[newId] = 'pivot';
            pushStep(colors, 3, `Tree is empty. Inserted ${val} as Root.`);
            continue;
        }

        let curr = root;
        while (curr) {
            let colors = Array(nodes.length).fill('default');
            colors[curr.id] = 'compare';
            pushStep(colors, 4, `Comparing ${val} with node ${curr.val}`);

            if (val < curr.val) {
                if (!curr.left) {
                    curr.left = new TreeNode(val, newId, curr.x - curr.dx, curr.y + 20, curr.dx / 1.5);
                    nodes.push({ id: newId, value: val, x: curr.left.x, y: curr.left.y });
                    edges.push({ from: curr.id, to: newId, directed: false, color: 'var(--vis-default)' });

                    colors[curr.id] = 'default';
                    colors[newId] = 'sorted';
                    pushStep(colors, 5, `${val} < ${curr.val}, inserted as left child.`);
                    break;
                } else {
                    pushStep(colors, 5, `${val} < ${curr.val}, moving to left child.`);
                    curr = curr.left;
                }
            } else if (val > curr.val) {
                if (!curr.right) {
                    curr.right = new TreeNode(val, newId, curr.x + curr.dx, curr.y + 20, curr.dx / 1.5);
                    nodes.push({ id: newId, value: val, x: curr.right.x, y: curr.right.y });
                    edges.push({ from: curr.id, to: newId, directed: false, color: 'var(--vis-default)' });

                    colors[curr.id] = 'default';
                    colors[newId] = 'sorted';
                    pushStep(colors, 7, `${val} > ${curr.val}, inserted as right child.`);
                    break;
                } else {
                    pushStep(colors, 7, `${val} > ${curr.val}, moving to right child.`);
                    curr = curr.right;
                }
            } else {
                pushStep(colors, 8, `Duplicate value ${val} found, not inserting.`);
                break;
            }
        }
    }

    pushStep(Array(nodes.length).fill('default'), -1, `BST Construction Complete.`);
    return steps;
}

window.addEventListener('algorithmChanged', (e) => {
    if (e.detail.algoId === 'bst') {
        window.appPseudocode.setCode(bstDetails);
        const steps = generateBSTSteps(e.detail.array);
        window.appControls.setSteps(steps);
    }
});
