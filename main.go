// Sets up web server and registers routes
package main

import (
	"flag"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/monquixote/gosudoku/sudoku"
)

func main() {
	sudokuPath := flag.String("file", "sudoku.txt", "Path to the file containing sudokus")
	port := flag.Int("port", 9090, "Server port")
	flag.Parse()

	file, err := os.Open(*sudokuPath)

	if err != nil {
		log.Fatal("Could not open file")
	}
	defer file.Close()

	puzzles, err := sudoku.ReadSudokus(file)

	if err != nil {
		log.Fatal(err)
	}

	for i, puzzle := range puzzles {
		if !sudoku.ValidatePuzzle(puzzle) {
			log.Fatalf("Puzzle import failed puzzle %d invalid ", i)
		}
	}

	http.Handle("/", http.FileServer(http.Dir("./static")))

	listHandler, err := ListFactory(puzzles)
	if err != nil {
		log.Fatal(err)
	}

	http.HandleFunc("/sudoku/list", listHandler)
	http.HandleFunc("/sudoku/solve", SudokuFactory(true))
	http.HandleFunc("/sudoku/validate", SudokuFactory(false))
	log.Print("Server starting on port: " + strconv.Itoa(*port))
	err = http.ListenAndServe(":"+strconv.Itoa(*port), nil)
	if err != nil {
		log.Fatal("Could not start server: ", err)
	}

}
