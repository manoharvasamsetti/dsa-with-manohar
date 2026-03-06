/**
 * graphAlgorithms.js
 * Contains both BFS and DFS visualization algorithms on a static preset graph.
 */

const graphDetailsBase = {
    space: 'O(V + E)',
};

const bfsDetails = {
    ...graphDetailsBase,
    name: 'Breadth First Search (BFS)',
    description: 'Breadth-First Search (BFS) is an algorithm for traversing or searching tree or graph data structures. It starts at the tree root and explores all nodes at the present depth prior to moving on to the nodes at the next depth level.',
    time: 'O(V + E)',
    pseudocode: [
        'BFS(graph, start_node):',
        '    queue = [start_node]',
        '    visited = set(start_node)',
        '    while queue is not empty:',
        '        node = queue.dequeue()',
        '        for neighbor in graph[node]:',
        '            if neighbor not in visited:',
        '                visited.add(neighbor)',
        '                queue.enqueue(neighbor)'
    ],
    javaCode: `void BFS(int s) {
    boolean visited[] = new boolean[V];
    LinkedList<Integer> queue = new LinkedList<Integer>();
    
    visited[s] = true;
    queue.add(s);
    
    while (queue.size() != 0) {
        s = queue.poll();
        System.out.print(s + " ");
        
        Iterator<Integer> i = adj[s].listIterator();
        while (i.hasNext()) {
            int n = i.next();
            if (!visited[n]) {
                visited[n] = true;
                queue.add(n);
            }
        }
    }
}`
};

const dfsDetails = {
    ...graphDetailsBase,
    name: 'Depth First Search (DFS)',
    description: 'Depth-First Search (DFS) is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node and explores as far as possible along each branch before backtracking.',
    time: 'O(V + E)',
    pseudocode: [
        'DFS(graph, node, visited):',
        '    if node in visited',
        '        return',
        '    visited.add(node)',
        '    for neighbor in graph[node]:',
        '        if neighbor not in visited:',
        '            DFS(graph, neighbor, visited)'
    ],
    javaCode: `void DFSUtil(int v, boolean visited[]) {
    visited[v] = true;
    System.out.print(v + " ");
    
    Iterator<Integer> i = adj[v].listIterator();
    while (i.hasNext()) {
        int n = i.next();
        if (!visited[n])
            DFSUtil(n, visited);
    }
}
void DFS(int v) {
    boolean visited[] = new boolean[V];
    DFSUtil(v, visited);
}`
};

// 6-Node Graph layout
function createBaseGraph() {
    const nodes = [
        { id: 0, value: '0', x: 20, y: 50 },
        { id: 1, value: '1', x: 40, y: 20 },
        { id: 2, value: '2', x: 40, y: 80 },
        { id: 3, value: '3', x: 60, y: 50 },
        { id: 4, value: '4', x: 80, y: 20 },
        { id: 5, value: '5', x: 80, y: 80 }
    ];

    const edges = [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 3 },
        { from: 3, to: 4 },
        { from: 3, to: 5 }
    ];

    const adj = [[1, 2], [0, 2, 3], [0, 1, 3], [1, 2, 4, 5], [3], [3]];
    return { nodes, edges, adj };
}

function generateGraphSteps(algo) {
    const steps = [];
    const { nodes, edges, adj } = createBaseGraph();
    const V = nodes.length;

    const pushStep = (colors, edgeColors, line, operation) => {
        const styledNodes = nodes.map((n, i) => ({ ...n, color: colors[i] || 'default' }));
        const styledEdges = edges.map((e, i) => ({ ...e, color: edgeColors[i] || 'var(--border-color)' }));
        steps.push({ type: 'graph', nodes: styledNodes, edges: styledEdges, line, operation });
    };

    let nodeColors = Array(V).fill('default');
    let edgeColors = Array(edges.length).fill('var(--border-color)');

    if (algo === 'bfs') {
        pushStep(nodeColors, edgeColors, 1, 'Initializing BFS. Starting from node 0.');

        let visited = Array(V).fill(false);
        let queue = [0];
        visited[0] = true;
        nodeColors[0] = 'pivot'; // Mark as in queue
        pushStep(nodeColors, edgeColors, 2, 'Enqueued node 0, marked as visited.');

        while (queue.length > 0) {
            let u = queue.shift();
            nodeColors[u] = 'sorted'; // Fully visited
            pushStep(nodeColors, edgeColors, 5, `Dequeued node ${u}. Exploring neighbors.`);

            for (let v of adj[u]) {
                if (!visited[v]) {
                    visited[v] = true;
                    nodeColors[v] = 'pivot'; // visiting 

                    // highlight edge
                    let edgeIdx = edges.findIndex(e => (e.from === u && e.to === v) || (e.from === v && e.to === u));
                    if (edgeIdx > -1) edgeColors[edgeIdx] = 'var(--accent-color)';

                    pushStep(nodeColors, edgeColors, 8, `Neighbor ${v} not visited. Enqueueing ${v}.`);
                    queue.push(v);
                }
            }
            // Optional: reset edge colors somewhat? We can leave them highlighted to show the BFS tree!
        }
        pushStep(nodeColors, edgeColors, -1, 'BFS Traversal Complete.');
    } else {
        // DFS
        pushStep(nodeColors, edgeColors, 1, 'Initializing DFS. Starting from node 0.');

        let visited = Array(V).fill(false);

        function dfsRec(u) {
            visited[u] = true;
            nodeColors[u] = 'compare'; // Active processing
            pushStep(nodeColors, edgeColors, 4, `Visited node ${u}. Exploring deep.`);

            for (let v of adj[u]) {
                if (!visited[v]) {
                    let edgeIdx = edges.findIndex(e => (e.from === u && e.to === v) || (e.from === v && e.to === u));
                    if (edgeIdx > -1) edgeColors[edgeIdx] = 'var(--accent-color)';

                    pushStep(nodeColors, edgeColors, 7, `Going deep into neighbor ${v} of node ${u}.`);
                    dfsRec(v);
                }
            }
            nodeColors[u] = 'sorted'; // finished
            pushStep(nodeColors, edgeColors, 4, `Backtracking from node ${u}.`);
        }

        dfsRec(0);
        pushStep(nodeColors, edgeColors, -1, 'DFS Traversal Complete.');
    }

    return steps;
}

window.addEventListener('algorithmChanged', (e) => {
    if (e.detail.algoId === 'bfs' || e.detail.algoId === 'dfs') {
        const isBfs = e.detail.algoId === 'bfs';
        window.appPseudocode.setCode(isBfs ? bfsDetails : dfsDetails);
        const steps = generateGraphSteps(e.detail.algoId);
        window.appControls.setSteps(steps);
    }
});
