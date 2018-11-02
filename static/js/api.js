"use strict"
const sudokuAPI = (() => {
    const baseURL = window.location.origin + "/sudoku/";

    function listSudokus() {
        return fetch(baseURL + 'list').then(r => r.json());
    }

    function sudokuRequest(puzzle, url) {
        url.search = new URLSearchParams({ sudoku: JSON.stringify(puzzle)});
        return fetch(url).then(r => r.json());
    }

    function validateSudoku(puzzle) {
        return sudokuRequest(puzzle, new URL(baseURL + 'validate'));
    }

    function solveSudoku(puzzle) {
        return sudokuRequest(puzzle, new URL(baseURL + 'solve'));
    }

    return {
        listSudokus,
        validateSudoku,
        solveSudoku
    }

})();