const playerFactory = (name, symbol) => {
  const makeMove = (move, array) => {
    if (array[move] !== "") return false;
    array[move] = symbol;
    return array;
  };
  return {
    name,
    symbol,
    makeMove
  };
};

const gameFactory = (name1, name2) => {
  if (name1 == "") name1 = "Player one";
  if (name2 == "") name2 = "Player two";
  let gameArray = ["", "", "", "", "", "", "", "", ""];
  let player1 = playerFactory(name1, "x");
  let player2 = playerFactory(name2, "o");
  let undoStack = new Array();
  let gameOver = false;

  const FrontenddevlandiaX = "url('images/square.svg') no-repeat";
  const FrontenddevlandiaO = "url('images/connery.svg') no-repeat";

  const gameboard = document.querySelector(".gameboard");

  const gridSquares = gameboard.querySelectorAll(".grid");

  const undoButton = document.querySelector("#undostack");

  function drawBoard(gameArray, currentPlayer) {

    if(document.getElementById("input2").checked === true){

        gridSquares.forEach((x, i) => {

          x.innerHTML= "";
          if(gameArray[i]== "x") {
            x.style.background = FrontenddevlandiaX;
          }
          else if (gameArray[i]== "o") {
            x.style.background = FrontenddevlandiaO;
          }
          else {
            x.style.background = 'white';
          }
        });

    }else{

        gridSquares.forEach((x, i) => {
          x.style.background = 'white';
          x.innerHTML = gameArray[i]});

    }


    const currentPlayerDiv = document.querySelector("#current-player");
    currentPlayerDiv.textContent = `current player: ${currentPlayer.name}`;
  }

  function showGameboard() {
    const gameboardDiv = document.querySelector(".gameboard");
    gameboardDiv.classList.add("visible");
  }

  function renderGameOver(winner) {
    const currentPlayerDiv = document.querySelector("#current-player");
    currentPlayerDiv.textContent = ``;

    const gameOverModal = document.querySelector(".game-over-modal");
    const messageSpan = gameOverModal.querySelector("#message");
    if (winner.name) {
      messageSpan.textContent = `${winner.name} is the winner!`;
    } else {
      messageSpan.textContent = `it was a tie`;
    }
    gameOverModal.classList.toggle("visible");
    gameOverModal.querySelector("button").onclick = () => {
       restart();
       gameOverModal.classList.toggle("visible");
    };
  }

  function checkGameOver(gameArray) {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    if (!gameArray.includes("")) return { win: true, winner: "tie" };
    return winConditions.reduce(
      (win, c) => {
        if (gameArray[c[0]] == "") return win;
        if (
          gameArray[c[0]] === gameArray[c[1]] &&
          gameArray[c[0]] === gameArray[c[2]]
        ) {
          return { win: true, winner: gameArray[c[0]] };
        }
        return win;
      },
      { win: false, winner: null }
    );
  }

  let currentPlayer = player1;
  function takeOneTurn(s, i) {
    if (currentPlayer.makeMove(i, gameArray) && !gameOver) {

      let turnPlay = {
        position : i,
        player : currentPlayer
      };
      undoStack.push(turnPlay);
      console.log(undoStack);

      currentPlayer = currentPlayer == player1 ? player2 : player1;
      drawBoard(gameArray, currentPlayer);
      if (checkGameOver(gameArray).win) {
        gameOver = true;
        const winnerMarker = checkGameOver(gameArray).winner;
        let winner = "tie";
        if (winnerMarker == "x" ) {
          winner = player1;
        } else if (winnerMarker == "o") {
          winner = player2;
        }
        renderGameOver(winner);

      }
    }
  }


  function undo(){
    if(undoStack.length > 0){
      let currentPopped = undoStack.pop();
      currentPlayer = currentPopped.player;
      let curretPostion = currentPopped.position;
      gameArray[curretPostion]= "";
      console.log(undoStack);
      drawBoard(gameArray, currentPlayer);
    }

    else{
        window.alert('cannot undo further, the tic tac toe board is empty !');
    }
  }

  function restart() {
    gameOver = false;
    gameArray = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = player1;
    while(undoStack.length > 0){
      undoStack.pop();
    }
    drawBoard(gameArray, currentPlayer);
  }

  function play() {
    showGameboard();
    drawBoard(gameArray, currentPlayer);
    gridSquares.forEach((s, i) => {
      s.onclick = () => takeOneTurn(s, i);
    });

    console.log(undoButton);

    undoButton.onclick = () => {
      undo();
    };

  }
  return {
    play
  };
};

const startGameForm = document.querySelector("#start-game");
startGameForm.onsubmit = function(e) {
  e.preventDefault();
  startGame(startGameForm.player1.value, startGameForm.player2.value);
  const startDialog = document.querySelector(".game-start-dialog");
  Object.assign(startDialog.style, {
    opacity: "0",
    transform: "translate(-50%, -500px)"
  });
};

function startGame(player1, player2) {
    let game;
    game = gameFactory(startGameForm.player1.value, startGameForm.player2.value);
    game.play();
}


