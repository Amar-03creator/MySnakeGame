document.addEventListener("DOMContentLoaded",function (){
    
    const gameArena = document.getElementById('game-arena');

    const arenaSize = 600;
    const cellSize = 20;
    let score = 0;   // lets is used as the score is updateable
    let gameStarted = false;
    let food = { x:300 , y: 200};  //{x:15*20 , y = 10*20}   -> cell coordinates  ->  top left pixels of the food container
    let snake =  [{x: 160 , y: 200},{x: 140 , y: 200}, {x: 120 , y: 200}];
    
    let dx=   cellSize;   //+20px
    let dy=  0 ;
    let intervalId;
    let gameSpeed= 200;

    function moveFood() {
        let newX, newY;

        do {
            newX = Math.floor(Math.random() * 30) * cellSize;
            newY = Math.floor(Math.random() * 30) * cellSize;
        } while(snake.some(snakeCell => snakeCell.x === newX && snakeCell.y === newY));    //Is any cell of snake's body is equal to the food item generated then generate again.

        food = { x: newX, y: newY };
    }

    function updateSnake() {
        const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(newHead); // Add new head to the snake    //The unshift() method in JavaScript adds elements to the beginning of an array and returns the new length of the array

        // check collision with food
        if(newHead.x === food.x && newHead.y === food.y) {
            score += 10;
            moveFood();

            if(gameSpeed > 50) {
                clearInterval(intervalId);
                gameSpeed -= 10;
                gameLoop();
            }

        } else {
            snake.pop(); // Remove tail
        }
    }

    function changeDirection(e){    //e is an event 
        console.log("key pressed", e);    //every event (key press)  has its own key/value
        const isGoingDown = dy === cellSize;
        const isGoingUp = dy === -cellSize;
        const isGoingRight = dx === cellSize;
        const isGoingLeft = dx === -cellSize;
        //The below code is written 1st then all the const is written
        if(e.key === 'ArrowUp' && !isGoingDown ) {    
            dx = 0;
            dy = -cellSize;
        } else if(e.key === 'ArrowDown' && !isGoingUp) {
            dx = 0;
            dy = cellSize;
        } else if(e.key === 'ArrowLeft' && !isGoingRight) {
            dx = -cellSize;
            dy = 0;
        } else if(e.key === 'ArrowRight' && !isGoingLeft) {
            dx = cellSize;
            dy = 0;
        }
    }

    function drawDiv(x , y , className){
        const divElement = document.createElement('div');
        divElement.classList.add(className);
        divElement.style.top = `${y}px`;
        divElement.style.left = `${x}px`;
        return divElement;
    }

    function drawFoodAndSnake(){
        gameArena.innerHTML = '';   //Clear the game Arena
        //wipe out everything and redraw with new coordinates
        snake.forEach((snakeCell)=>{     //go to each element of the snakeCell
            const snakeElement = drawDiv(snakeCell.x ,snakeCell.y,'snake');   //snake label is given to know that its pointing to snake array
            gameArena.appendChild(snakeElement);
        })

        const foodElement = drawDiv(food.x , food.y , 'food');   //food label is passed to know which div is to be drawn
        gameArena.appendChild(foodElement);   //implements the food element inside the game arena
    }

    function isGameOver() {
        // snake collision checks
        for(let i = 1; i < snake.length; i++) {
            if(snake[0].x === snake[i].x && snake[0].y === snake[i].y) {    //head(0.x,0.y) and body(i.x,i.y) collision check
                return true;
            }
        }
        // wall collision checks
        const hitLeftWall = snake[0].x < 0; // snake[0] -> head
        const hitRightWall = snake[0].x > arenaSize - cellSize;
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y > arenaSize - cellSize;
        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
    }

    function gameLoop(){
        intervalId = setInterval(() => {      //setInterval runs the loop again and again
            if(isGameOver()) {
                clearInterval(intervalId);     //The clearInterval() method clears a timer set with the setInterval() method.
                gameStarted = false;
                alert('Game Over' + '\n' + 'Your Score: ' + score);
                return;
            }
            updateSnake();
            drawFoodAndSnake();
            drawScoreBoard();
        }, gameSpeed);
    }

    function runGame(){
        if(!gameStarted){
            gameStarted = true ;
            document.addEventListener('keydown',changeDirection)
            gameLoop() ; 
        }
    }

    function drawScoreBoard() {
        const scoreBoard = document.getElementById('score-board');
        scoreBoard.textContent = `Score: ${score}`;
    }

    function initiateGame(){
        const scoreBoard = document.createElement('div');
        scoreBoard.id = 'score-board';

        document.body.insertBefore(scoreBoard , gameArena)    //Insert Scoreboard before game arena

        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.classList.add('start-button');

        startButton.addEventListener('click', function startGame(){
            startButton.style.display = 'none' ;   //Hide Start Button

            runGame();
        })

        document.body.appendChild(startButton);
        
    }
    initiateGame();
})