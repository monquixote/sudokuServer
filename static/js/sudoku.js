"use strict"

// Module to manage and update the page state  
const sudoku = (() => {
    let sudokus = [];

    // Gets the list of sudokus and does the initial page setup 
    function init() {
        sudokuAPI
            .listSudokus()
            .then(sudokuResult => {
                sudokus = sudokuResult;
                const select = document.getElementById('sudokuselect');
                select.onchange = event => updateTable(sudokus[event.target.value]);

                for (let i = 0; i < sudokus.length; i++) {
                    const opt = document.createElement('option');
                    opt.value = i;
                    opt.innerHTML = i;
                    select.appendChild(opt);
                }

                updateTable(sudokus[0]);
            });
    }

    // Takes an array of integers representing a puzzle and replaces the table on the page
    function updateTable(puzzle) {
        const table = createTable(puzzle);
        const sudokudiv = document.getElementById("sudokudiv");
        sudokudiv.innerHTML = '';
        sudokudiv.appendChild(table);
    }

    // Requests the selected puzzle to be solved and triggers and update of the table
    function solve() {
        const select = document.getElementById('sudokuselect');
        sudokuAPI.solveSudoku(sudokus[select.value])
            .then(result => updateTable(result.puzzle));
    }

    // Creates and returns the table elements for a puzzle from an array of integers
    function createTable(puzzle) {
        const table = document.createElement("table");
        let tr = document.createElement("tr");

        for (let i = 0; i < puzzle.length; i++) {
            const td = document.createElement("td");
            td.innerHTML = puzzle[i];
            tr.appendChild(td);
            if ((i + 1) % 9 == 0) {
                table.appendChild(tr);
                tr = document.createElement("tr");
            }
        }
        return table;
    }

    // Public API
    return {
        init,
        solve
    }

})();

