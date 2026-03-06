/**
 * pseudocode.js - Code & Complexity Manager
 * Displays pseudocode/Java code, highlights active lines, and sets complexities.
 */

class PseudocodeManager {
    constructor() {
        this.pseudocodeContainer = document.getElementById('pseudocode-content');
        this.javaCodeContainer = document.getElementById('javacode-content');
        this.timeComplexityEl = document.getElementById('time-complexity');
        this.spaceComplexityEl = document.getElementById('space-complexity');
        this.explanationEl = document.getElementById('explanation-text');
    }

    setCode(algoDetails) {
        // Set Complexity
        this.timeComplexityEl.textContent = algoDetails.time || 'O(?)';
        this.spaceComplexityEl.textContent = algoDetails.space || 'O(?)';

        // Set Explanation Title & Text
        let expHtml = `<h3>${algoDetails.name}</h3>`;
        if (algoDetails.description) {
            expHtml += `<p>${algoDetails.description}</p>`;
        }
        this.explanationEl.innerHTML = expHtml;

        // Render Pseudocode
        if (algoDetails.pseudocode) {
            this.pseudocodeContainer.innerHTML = '';
            algoDetails.pseudocode.forEach((line, index) => {
                const lineDiv = document.createElement('span');
                lineDiv.className = 'code-line';
                lineDiv.id = `pseudo-line-${index + 1}`;

                // Add indentation based on tabs/spaces in the string
                const indentLevel = (line.match(/^\s+/) || [''])[0].length;
                lineDiv.style.paddingLeft = `${indentLevel * 10 + 5}px`;
                lineDiv.textContent = line.trim();

                this.pseudocodeContainer.appendChild(lineDiv);
                this.pseudocodeContainer.appendChild(document.createTextNode('\n'));
            });
        }

        // Render Java Code
        if (algoDetails.javaCode) {
            this.javaCodeContainer.textContent = algoDetails.javaCode;
            // Simple string assignment for Java code. We don't always animate line-by-line of Java
        }
    }

    highlightLine(lineNumber) {
        // Remove highlight from all lines
        const allLines = document.querySelectorAll('.code-line');
        allLines.forEach(l => l.classList.remove('highlight'));

        // Add highlight to current line
        const targetLine = document.getElementById(`pseudo-line-${lineNumber}`);
        if (targetLine) {
            targetLine.classList.add('highlight');
            // Auto scroll to line
            targetLine.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
}

window.appPseudocode = new PseudocodeManager();
