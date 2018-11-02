"use strict"
const sudoku = (() => {
    let sudokus = [];

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

    function updateTable(data) {
        const table = createTable(data);
        const sudokudiv = document.getElementById("sudokudiv");
        sudokudiv.innerHTML = '';
        sudokudiv.appendChild(table);
      }

      function solve() {
        const select = document.getElementById('sudokuselect');
        sudokuAPI.solveSudoku(sudokus[select.value])
          .then(result => {
            updateTable(result.puzzle);
          });
      }

    function createTable(elements) {
        const table = document.createElement("table");
        let tr = document.createElement("tr");

        for(let i=0;i<elements.length;i++) {
            const td = document.createElement("td");
            td.innerHTML = elements[i]
            tr.appendChild(td);
            if((i+1) % 9 == 0) {
                table.appendChild(tr);
                tr = document.createElement("tr");
            }
        }
        return table;
    }
    return {
        init,
        solve
    }

})();

