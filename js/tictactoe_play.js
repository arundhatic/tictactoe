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


