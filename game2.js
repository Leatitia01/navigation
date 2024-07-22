document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const scoreDisplay = document.getElementById('score');
    const levelDisplay = document.getElementById('level');
    const width = 8;
    const squares = [];

    let score = 0;
    let level = 1;

    // Array of candy colors
    const candyColors = [
        'red', 'yellow', 'green', 'blue', 'purple', 'orange'
    ];

    // Create Board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            const randomColor = Math.floor(Math.random() * candyColors.length);
            const candyColor = candyColors[randomColor];
            square.setAttribute('draggable', true);
            square.setAttribute('id', i);
            square.classList.add('candy');
            square.style.backgroundColor = candyColor;
            grid.appendChild(square);
            squares.push(square);
        }
    }

    createBoard();

    // Drag and drop functionality
    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;

    squares.forEach(square => {
        square.addEventListener('dragstart', dragStart);
        square.addEventListener('dragend', dragEnd);
        square.addEventListener('dragover', dragOver);
        square.addEventListener('dragenter', dragEnter);
        square.addEventListener('dragleave', dragLeave);
        square.addEventListener('drop', dragDrop);
    });

    function dragStart() {
        const color = this.style.backgroundColor;
        colorBeingDragged = color;
        squareIdBeingDragged = parseInt(this.id);
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
    }

    function dragLeave() {
        this.classList.remove('over');
    }

    function dragDrop() {
        const color = this.style.backgroundColor;
        colorBeingReplaced = color;
        squareIdBeingReplaced = parseInt(this.id);
        this.style.backgroundColor = colorBeingDragged;
        squares[squareIdBeingDragged].style.backgroundColor = colorBeingReplaced;
    }

    function dragEnd() {
        let validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged + 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + width
        ];
        let validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null;
        } else if (squareIdBeingReplaced && !validMove) {
            const draggedColor = squares[squareIdBeingDragged].style.backgroundColor;
            const replacedColor = squares[squareIdBeingReplaced].style.backgroundColor;
            squares[squareIdBeingDragged].style.backgroundColor = replacedColor;
            squares[squareIdBeingReplaced].style.backgroundColor = draggedColor;
        }

        setTimeout(() => {
            checkRowForThree();
            checkColumnForThree();
        }, 100);
    }

    // Check for matches
    function checkRowForThree() {
        for (let i = 0; i < squares.length - 2; i++) {
            const row = Math.floor(i / width);
            if (row % width < width - 2) {
                const firstColor = squares[i].style.backgroundColor;
                const secondColor = squares[i + 1].style.backgroundColor;
                const thirdColor = squares[i + 2].style.backgroundColor;
                
                if (firstColor && secondColor && thirdColor) {
                    if (firstColor === secondColor && secondColor === thirdColor) {
                        score += 3;
                        updateScore();
                        squares[i].style.backgroundColor = '';
                        squares[i + 1].style.backgroundColor = '';
                        squares[i + 2].style.backgroundColor = '';
                    }
                }
            }
        }
    }

    function checkColumnForThree() {
        for (let i = 0; i < squares.length - 2 * width; i++) {
            const firstColor = squares[i].style.backgroundColor;
            const secondColor = squares[i + width].style.backgroundColor;
            const thirdColor = squares[i + 2 * width].style.backgroundColor;
            
            if (firstColor && secondColor && thirdColor) {
                if (firstColor === secondColor && secondColor === thirdColor) {
                    score += 3;
                    updateScore();
                    squares[i].style.backgroundColor = '';
                    squares[i + width].style.backgroundColor = '';
                    squares[i + 2 * width].style.backgroundColor = '';
                }
            }
        }
    }

    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
        if (score >= level * 50) {
            level++;
            levelDisplay.textContent = `Level: ${level}`;
        }
    }

    // Automatically move candies down and check for matches
    window.setInterval(function() {
        moveDown();
        checkRowForThree();
        checkColumnForThree();
    }, 100);

    // Move candies down when there are empty spaces
    function moveDown() {
        for (let i = squares.length - 1; i >= 0; i--) {
            const currentColor = squares[i].style.backgroundColor;
            const isAtBottom = i + width >= squares.length;

            if (currentColor && !isAtBottom) {
                const nextColor = squares[i + width].style.backgroundColor;
                if (!nextColor) {
                    squares[i + width].style.backgroundColor = currentColor;
                    squares[i].style.backgroundColor = '';
                }
            }
        }
    }
});
