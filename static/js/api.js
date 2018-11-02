"use strict"

// HTTP Sudoku API client
const sudokuAPI = (() => {
    const baseURL = window.location.origin + "/sudoku/";

    // Gets a 2D array of sudokus
    function listSudokus() {
        return fetch(baseURL + 'list').then(r => r.json());
    }

    /*
    Valid and Solve return results in the form
    {
        valid:true, // Is the puzzle valid
        solved:true, // Has the puzzle been solved
        puzzle:[1,2,3...] // The current puzzle state
    }
    */

    // Utility function used by validate and solve
    function sudokuRequest(puzzle, url) {
        url.search = new URLSearchParams({ sudoku: JSON.stringify(puzzle)});
        return fetch(url).then(r => r.json());
    }

    // Validates a puzzle 
    function validateSudoku(puzzle) {
        return sudokuRequest(puzzle, new URL(baseURL + 'validate'));
    }

    // Solves a puzzle 
    function solveSudoku(puzzle) {
        return sudokuRequest(puzzle, new URL(baseURL + 'solve'));
    }

    // Public API
    return {
        listSudokus,
        validateSudoku,
        solveSudoku
    }

})();