
var numSelected = null;
var tileSelected = null;
let selectedTiles = []; 
const delay = 2000;
let timerInterval;
let time;
class CoOrd {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    toString() {
        return `${this.x} ${this.y}`;
    }
}

class Mapp {
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    mapping(k) {
        let list = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                list.push(new CoOrd(i, j));
            }
        }
        this.shuffleArray(list);
        let finalList = list.slice(0, k);
        return finalList;
    }

    filling(k) {
        let numbers = [];
        for (let i = 0; i < 9; i++) {
            numbers.push(i + 1);
        }
        this.shuffleArray(numbers);
        let finalNumbers = numbers.slice(0, k);
        return finalNumbers;
    }
}

class Solver {
    isSafe(arr, r, c, digit) {
        for (let i = 0; i < 9; i++) {
            if (arr[i][c] === digit) {
                return false;
            }
        }
        for (let j = 0; j < 9; j++) {
            if (arr[r][j] === digit) {
                return false;
            }
        }
        let sr = Math.floor(r / 3) * 3;
        let sc = Math.floor(c / 3) * 3;
        for (let i = sr; i < sr + 3; i++) {
            for (let j = sc; j < sc + 3; j++) {
                if (arr[i][j] === digit) {
                    return false;
                }
            }
        }
        return true;
    }

    sudokuSolver(arr, r, c) {
        if (r === 9 && c === 0) {
            return true;
        }
        let nextRow = r,
            nextCol = c + 1;
        if (nextCol === 9) {
            nextRow = r + 1;
            nextCol = 0;
        }
        if (arr[r][c] !== 0) {
            return this.sudokuSolver(arr, nextRow, nextCol);
        }
        for (let digit = 1; digit <= 9; digit++) {
            if (this.isSafe(arr, r, c, digit)) {
                arr[r][c] = digit;
                if (this.sudokuSolver(arr, nextRow, nextCol)) {
                    return true;
                }
                arr[r][c] = 0;
            }
        }
        return false;
    }

    copyArray(originalArray) {
        // Assuming originalArray is a 9x9 array
        let copiedArray = [];
        for (let i = 0; i < 9; i++) {
            copiedArray.push(originalArray[i].slice());
        }
        return copiedArray;
    }
}

class SudokuPuzzle {
    constructor() {
        this.m = new Mapp();
        this.sl = new Solver();
    }

    generate(arr, xidx, yidx) {
        let sudoku = Array.from({ length: 3 }, () => Array(3).fill(0));
        let x = Math.floor(Math.random() * 5) + 1;
        let ac = this.m.mapping(x);
        let ai = this.m.filling(x);
        for (let i = 0; i < x; i++) {
            sudoku[ac[i].x][ac[i].y] = ai[i];
        }
        for (let i = xidx; i < xidx + 3; i++) {
            for (let j = yidx; j < yidx + 3; j++) {
                arr[i][j] = sudoku[i % 3][j % 3];
            }
        }
        return arr;
    }

    safe(arr, r, c) {
        for (let i = 0; i < 9 && i !== r; i++) {
            if (arr[i][c] === arr[r][c] && arr[r][c] !== 0) {
                return false;
            }
        }
        for (let j = 0; j < 9 && j !== c; j++) {
            if (arr[r][j] === arr[r][c] && arr[r][c] !== 0) {
                return false;
            }
        }
        let sr = Math.floor(r / 3) * 3;
        let sc = Math.floor(c / 3) * 3;
    
        for (let i = sr; i < sr + 3; i++) {
            for (let j = sc; j < sc + 3; j++) {
                if (i !== r && j !== c && arr[r][c] !== 0 && arr[i][j] === arr[r][c]) {
                    return false;
                }
            }
        }
        return true;        
    }

    completeGenerate() {
        let sudokuFull = Array.from({ length: 9 }, () => Array(9).fill(0));
        let puzzle = Array.from({ length: 9 }, () => Array(9).fill(0));
        do {
            for (let i = 0; i < 9; i += 3) {
                for (let j = 0; j < 9; j += 3) {
                    sudokuFull = this.generate(sudokuFull, i, j);
                }
            }
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    while (!this.safe(sudokuFull, i, j)) {
                        let rn = Math.floor(Math.random() * 9) + 1;
                        sudokuFull[i][j] = rn;
                    }
                }
            }
            for (let i = 0; i < 9; i++) {
                puzzle[i] = [...sudokuFull[i]];
            }
        } while (!this.sl.sudokuSolver(sudokuFull, 0, 0));
        return puzzle;
    }
}

let s = new SudokuPuzzle();
let slv = new Solver();
var sudoku = s.completeGenerate();
var board = slv.copyArray(sudoku);
let clearBoard = slv.copyArray(sudoku);
slv.sudokuSolver(sudoku, 0, 0);
var solution = sudoku;

window.onload = function() {
    setGame();
}

document.addEventListener("DOMContentLoaded", function () {
    const sudokuGrid = document.getElementById("sudokuGrid");
    sudokuGrid.style.display = "block";
    startTimer();
  });

document.getElementById('submit').addEventListener('click', () => {
    resultDisplay(); 
});

document.getElementById("close-dialog-button").addEventListener("click", function() {
    window.location.href="./index.html";
  });
const sudokugrid = document.getElementById('sudokugrid');
function setGame() {
    // Digits 1-9
    for (let i = 1; i <= 9; i++) {
        //<div id="1" class="number">1</div>
        let number = document.createElement("button");
        number.id = i
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    // Board 9x9
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        var r = Math.floor(i/9);
        var c = i%9;
        cell.id = r.toString() + "-" + c.toString();
        if (board[r][c] != 0) {
            cell.innerText = String(board[r][c]);
            cell.classList.add("cell-start");
        }
        else if(board[r][c] == 0){
            cell.innerText = "";
        }
        if(r==2 || r==5 ){
            cell.classList.add("horizontal-line");
        }
        if(r==3 || r==6 ){
            cell.classList.add("horizontal-lineOne");
        }
        if(c==2 || c==5 ){
            cell.classList.add("vertical-line");
        }
        if(c==3 || c==6 ){
            cell.classList.add("vertical-lineOne");
        }
        cell.addEventListener("click", selectTile);
        sudokugrid.appendChild(cell);
    }
    //clear
    document.getElementById("clear").addEventListener("click", function(){
        while(selectedTiles.length>0) {
            let tile = selectedTiles.pop();
            document.getElementById(tile.id).innerText = "";
        }
    })
    
    //check
    document.getElementById("check").addEventListener("click", function(){
        for(let i=0; i<selectedTiles.length; i++) {
            let tile = selectedTiles[i];
            let coords = tile.id.split("-"); //["0", "0"]
            let r = parseInt(coords[0]);
            let c = parseInt(coords[1]);
            let txt = document.getElementById(tile.id).innerText;
            if (txt !== "") {
                if (solution[r][c] === parseInt(txt)) {
                    setColorAndRemove(tile.id, "green");
                } else if (solution[r][c] !== parseInt(txt)) {
                    setColorAndRemove(tile.id, "red");
                }
            }         
        }
    })
}

function selectNumber(){
    numSelected = this;
    setColorAndRemove(this.id, "green");
}

function selectTile() {
    if (numSelected) {
        if (this.id == "tile-start") {
            return;
        }
        const coords = this.id.split("-");
        const row = parseInt(coords[0]);
        const col = parseInt(coords[1]);
        this.innerText = numSelected.id;
        clearBoard[row][col] = parseInt(numSelected.id);
        selectedTiles.push(this);
    }
}

function setColorAndRemove(tileId, color) {
    document.getElementById(tileId).style.backgroundColor = color;
    setTimeout(function() {
        document.getElementById(tileId).style.backgroundColor = "";
    }, delay);
}

function startTimer() {
    let seconds = 0;
    let minutes = 0;
    let hours = 0;

    timerInterval = setInterval(function() {
        seconds++;

        if (seconds === 60) {
            seconds = 0;
            minutes++;

            if (minutes === 60) {
                minutes = 0;
                hours++;
            }
        }

                 
          var formattedTime =
          (hours < 10 ? "0" + hours : hours) + ":" +
          (minutes < 10 ? "0" + minutes : minutes) + ":" +
          (seconds < 10 ? "0" + seconds : seconds);
        document.getElementById("timer").innerText = formattedTime;
    }, 1000); // Update timer every second (1000 milliseconds)
}

function openGame() {
    document.getElementById('mainScreen').style.display = 'block';
}
  
function stopTimer(){
    time = document.getElementById("timer").innerText;
    document.getElementById("timer").innerText = "00:00:00";
    clearInterval(timerInterval);
}

function displayVariable() {
    const displayElement = document.getElementById("display");
    displayElement.innerText = time;
}
 
function resultDisplay(){
    for(let i=0; i<9; i++){
        for(let j=0; j<9; j++){
            if(clearBoard[i][j]==0 || clearBoard[i][j]!=solution[i][j]){
                incorrectComplete();
                return;
            }    
        }
    }
    completeCorrect();
}

function completeCorrect(){
    document.getElementById('sudokuGrid').style.display = 'none'; // Hide the Sudoku grid
    document.getElementById('dialog-box').classList.remove('hidden'); // Show the dialog box
    stopTimer();
    document.getElementById('message').innerText = "Congratulations!, You have completed."
    displayVariable();
}

function incorrectComplete() {
    const dialogBox = document.getElementById("customDialogBox");
    dialogBox.style.display = "block";
    const grid = document.getElementById("sudokuGrid");
    grid.classList.add("blur-background");
    document.getElementById("resumeButton").addEventListener("click", resumeSolving);
    document.getElementById("newG").addEventListener("click", function() {
        window.location.href="index.html";
      });
  }
  
  // Function to hide the dialog box
  function hideDialogBox() {
    const dialogBox = document.getElementById("customDialogBox");
    dialogBox.style.display = "none";
  
    // Remove the class to remove the background blur
    const grid = document.getElementById("sudokuGrid");
    grid.classList.remove("blur-background");
  }
  
  // Function to resume solving the grid
  function resumeSolving() {
    hideDialogBox();
  }

  function newGame(){
    document.getElementById('home').style.display = 'block'; 
    document.getElementById('dialog-box').classList.add('hidden'); 
    document.getElementById('sudokuGrid').style.display = 'none'; 
    stopTimer();
    hideDialogBox();
  }
  
function clearSudokuGrid() {
    const board = document.getElementById("board");
    board.innerHTML = ""; 
  }




  
  
  

