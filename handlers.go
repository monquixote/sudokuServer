package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/monquixote/gosudoku/sudoku"
)

type sudokuResult struct {
	Valid  bool  `json:"valid"`
	Solved *bool `json:"solved,omitempty"`
	Puzzle []int `json:"puzzle"`
}

// ListFactory Handler to return a list of JSON formatted sudokus
// Factory function allows dependency injection of sudoku listing
func ListFactory(puzzles [][]int) (func(w http.ResponseWriter, r *http.Request), error) {
	j, err := json.Marshal(puzzles)
	if err != nil {
		return nil, errors.New("Could not marshall JSON")
	}
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "%v", string(j))
	}, nil
}

// SudokuFactory returns a handler to handles sudoku requests
// Solve parameter determines if the sudoku should be solved or just validated
func SudokuFactory(solve bool) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		sudokuHandler(w, r, solve)
	}
}

// Reads a sudoku from HTTP request validates and optionally solves
func sudokuHandler(w http.ResponseWriter, r *http.Request, solve bool) {
	sudokuString := r.URL.Query()["sudoku"]
	if len(sudokuString) == 0 {
		log.Print("No param supplied")
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	puzzle := []int{}
	err := json.Unmarshal([]byte(sudokuString[0]), &puzzle)
	if err != nil {
		log.Printf("Invalid JSON %v, %v", sudokuString[0], err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	valid := sudoku.ValidatePuzzle(puzzle)

	result := sudokuResult{valid, nil, puzzle}

	if valid && solve {
		var solved bool
		result.Puzzle, solved = sudoku.SolvePuzzle(result.Puzzle)
		result.Solved = &solved
	}

	j, err := json.Marshal(result)

	if err != nil {
		log.Printf("JSON Marshal failed %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "%v", string(j))
}
