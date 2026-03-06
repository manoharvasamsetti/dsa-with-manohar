/**
 * visualizer.js - DOM Visualizer
 * Manages rendering the state onto the canvas area using DOM elements.
 */

class Visualizer {
    constructor() {
        this.container = document.getElementById('visualization-area');
    }

    clear() {
        this.container.innerHTML = '';
    }

    /**
     * Renders a visualization step
     * step object can have type: 'histogram' (default), 'boxes', or 'graph'
     */
    draw(step) {
        if (!step) return;

        this.clear();

        const type = step.type || 'histogram';

        if (type === 'histogram') {
            this.drawHistogram(step);
        } else if (type === 'boxes') {
            this.drawBoxes(step);
        } else if (type === 'graph') {
            this.drawGraph(step);
        }
    }

    drawHistogram(step) {
        if (!step.array) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'array-container';

        const maxVal = Math.max(...step.array, 1);

        step.array.forEach((val, idx) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';

            // Calculate height percentage based on max value
            const heightPct = (val / maxVal) * 90; // max 90% of container height
            bar.style.height = `${Math.max(5, heightPct)}%`;

            // Width based on number of elements
            bar.style.width = `calc(${100 / step.array.length}% - 2px)`;

            // Colors
            if (step.colors && step.colors[idx]) {
                const type = step.colors[idx];
                switch (type) {
                    case 'compare':
                        bar.style.backgroundColor = 'var(--vis-compare)';
                        break;
                    case 'swap':
                        bar.style.backgroundColor = 'var(--vis-swap)';
                        break;
                    case 'sorted':
                        bar.style.backgroundColor = 'var(--vis-sorted)';
                        break;
                    case 'pivot':
                        bar.style.backgroundColor = 'var(--vis-pivot)';
                        break;
                    default:
                        bar.style.backgroundColor = 'var(--vis-default)';
                }
            }

            // Label
            const label = document.createElement('div');
            label.className = 'array-bar-value';
            label.textContent = val;

            // Index Label (added below the bar)
            const indexLabel = document.createElement('div');
            indexLabel.className = 'array-bar-index';
            indexLabel.textContent = idx;
            indexLabel.style.position = 'absolute';
            indexLabel.style.bottom = '-25px';
            indexLabel.style.fontSize = '0.75rem';
            indexLabel.style.color = 'var(--text-secondary)';
            indexLabel.style.fontWeight = 'bold';

            // Container for bar to allow absolute positioning of index
            const barWrapper = document.createElement('div');
            barWrapper.style.position = 'relative';
            barWrapper.style.height = '100%';
            barWrapper.style.width = `calc(${100 / step.array.length}% - 2px)`;
            barWrapper.style.display = 'flex';
            barWrapper.style.flexDirection = 'column';
            barWrapper.style.justifyContent = 'flex-end';
            barWrapper.style.alignItems = 'center';

            bar.style.width = '100%';

            // Don't show labels if too many elements
            if (step.array.length <= 30) {
                bar.appendChild(label);
                barWrapper.appendChild(indexLabel); // Only show indices if not too crowded
            }

            barWrapper.appendChild(bar);
            wrapper.appendChild(barWrapper);
        });

        // Add extra bottom margin to wrapper to accommodate indices
        wrapper.style.marginBottom = '30px';
        this.container.appendChild(wrapper);
    }

    drawBoxes(step) {
        if (!step.array) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'ds-boxes-container';
        wrapper.style.display = 'flex';
        wrapper.style.gap = '10px';
        wrapper.style.justifyContent = 'center';
        wrapper.style.alignItems = 'center';
        wrapper.style.height = '100%';
        wrapper.style.flexWrap = 'wrap';

        step.array.forEach((val, idx) => {
            const box = document.createElement('div');
            box.className = 'ds-box';
            box.style.width = '60px';
            box.style.height = '60px';
            box.style.display = 'flex';
            box.style.alignItems = 'center';
            box.style.justifyContent = 'center';
            box.style.borderRadius = '8px';
            box.style.fontSize = '1.2rem';
            box.style.fontWeight = 'bold';
            box.style.color = 'white';
            box.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            box.style.transition = 'all 0.3s ease';

            // Colors
            const type = (step.colors && step.colors[idx]) ? step.colors[idx] : 'default';
            switch (type) {
                case 'compare': box.style.backgroundColor = 'var(--vis-compare)'; break;
                case 'swap': box.style.backgroundColor = 'var(--vis-swap)'; break;
                case 'sorted': box.style.backgroundColor = 'var(--vis-sorted)'; break;
                case 'pivot': box.style.backgroundColor = 'var(--vis-pivot)'; break;
                default: box.style.backgroundColor = 'var(--vis-default)';
            }

            box.textContent = val;

            // Index Label below box
            const indexLabel = document.createElement('div');
            indexLabel.textContent = `[${idx}]`;
            indexLabel.style.position = 'absolute';
            indexLabel.style.bottom = '-20px';
            indexLabel.style.fontSize = '0.75rem';
            indexLabel.style.color = 'var(--text-secondary)';
            indexLabel.style.fontWeight = 'bold';
            box.style.position = 'relative'; // Ensure relative positioning for absolute children
            box.appendChild(indexLabel);

            // For Stack/Queue, we might want pointers (e.g., Top, Head, Tail)
            if (step.pointers && step.pointers[idx]) {
                const pointer = document.createElement('div');
                pointer.textContent = step.pointers[idx];
                pointer.style.position = 'absolute';
                pointer.style.top = '-25px';
                pointer.style.fontSize = '0.8rem';
                pointer.style.color = 'var(--text-primary)';
                box.appendChild(pointer);
            }

            wrapper.appendChild(box);
        });

        this.container.appendChild(wrapper);
    }

    drawGraph(step) {
        if (!step.nodes) return;

        // Use a relative container wrapper
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';

        // SVG for edges
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'none'; // so we can hover nodes

        // Draw edges first so they are behind nodes
        if (step.edges) {
            step.edges.forEach(edge => {
                const n1 = step.nodes[edge.from];
                const n2 = step.nodes[edge.to];
                if (n1 && n2) {
                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    // x,y are percentages strictly [0, 100]
                    line.setAttribute('x1', `${n1.x}%`);
                    line.setAttribute('y1', `${n1.y}%`);
                    line.setAttribute('x2', `${n2.x}%`);
                    line.setAttribute('y2', `${n2.y}%`);
                    line.setAttribute('stroke', edge.color || 'var(--border-color)');
                    line.setAttribute('stroke-width', '3');

                    if (edge.directed) {
                        // Very simple hack for arrows: just use marker or don't.
                    }
                    svg.appendChild(line);
                }
            });
        }

        wrapper.appendChild(svg);

        // Draw nodes
        step.nodes.forEach((node) => {
            const div = document.createElement('div');
            div.className = 'ds-node';
            div.style.position = 'absolute';
            // Center the node
            div.style.left = `calc(${node.x}% - 25px)`;
            div.style.top = `calc(${node.y}% - 25px)`;
            div.style.width = '50px';
            div.style.height = '50px';
            div.style.borderRadius = '50%';
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'center';
            div.style.color = 'white';
            div.style.fontWeight = 'bold';
            div.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            div.style.transition = 'all 0.3s ease';

            switch (node.color) {
                case 'compare': div.style.backgroundColor = 'var(--vis-compare)'; break;
                case 'swap': div.style.backgroundColor = 'var(--vis-swap)'; break;
                case 'sorted': div.style.backgroundColor = 'var(--vis-sorted)'; break;
                case 'pivot': div.style.backgroundColor = 'var(--vis-pivot)'; break;
                default: div.style.backgroundColor = 'var(--vis-default)';
            }

            div.textContent = node.value;
            wrapper.appendChild(div);
        });

        this.container.appendChild(wrapper);
    }
}

window.appVisualizer = new Visualizer();
