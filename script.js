const mainMenu = document.getElementById("main-menu");
const characterSelection = document.getElementById("character-selection");
const game = document.getElementById("game");
const result = document.getElementById("result");
const resultText = document.getElementById("resultText");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let playerCharacter = null;
let opponentCharacter = null;
let latestPlayerChoice = null;
let latestOpponentChoice = null;

const choices = ["Attack", "Defend", "Charge", "Skill"];
const symbols = {
  Attack: "▲",
  Defend: "■",
  Charge: "●",
  Skill: "⬡",
};

const skills = {
  1: "⬟", // Pentagon
  2: "⬡", // Hexagon
  3: "★", // Star
};

// HP and charge power initialization
let playerHP = 5;
let opponentHP = 5;
let playerCharge = 0;
let opponentCharge = 0;

// Assume playerHP and opponentHP are variables holding the current HP values (0-5)

function updateHP(elementId, hp) {
  const hpContainer = document.getElementById(elementId);
  const hearts = hpContainer.querySelectorAll("span");
  hearts.forEach((heart, index) => {
    if (index < hp) {
      heart.classList.add("full");
      heart.classList.remove("empty");
    } else {
      heart.classList.add("empty");
      heart.classList.remove("full");
    }
  });
}

function updateStatus() {
  // Update player HP display
  updateHP("playerHP", playerHP);
  // Update player charge display
  document.querySelectorAll(".charge-circle").forEach((circle, index) => {
    if (index < playerCharge) {
      circle.classList.add("blue");
    } else {
      circle.classList.remove("blue");
    }
  });

  // Update opponent HP display
  updateHP("opponentHP", opponentHP);
  // Update opponent charge display
  document
    .querySelectorAll(".opponent-charge-circle")
    .forEach((circle, index) => {
      if (index < opponentCharge) {
        circle.classList.add("red");
      } else {
        circle.classList.remove("red");
      }
    });

  updateSkillButton();
}

function updateSkillButton() {
  const skillButton = document.getElementById("skillButton");
  let requiredCharge = 0;
  if (playerCharacter === 1) {
    requiredCharge = 2;
  } else if (playerCharacter === 2) {
    requiredCharge = 3;
  } else if (playerCharacter === 3) {
    requiredCharge = 4;
  }
  skillButton.disabled = playerCharge < requiredCharge;
}

function showSection(section) {
  mainMenu.classList.add("hidden");
  characterSelection.classList.add("hidden");
  game.classList.add("hidden");
  result.classList.add("hidden");

  section.classList.remove("hidden");

  // Resetting styles to default
  mainMenu.style.display = "";
  characterSelection.style.display = "";
  game.style.display = "";
  result.style.display = "";
}

function showCharacterSelection() {
  showSection(characterSelection);
}

function selectCharacter(character) {
  playerCharacter = character;
  document
    .querySelectorAll(".character button")
    .forEach((button) => button.classList.remove("selected"));
  document.getElementById(`character${character}`).classList.add("selected");
  if (playerCharacter === 1) {
    document.getElementById("character1-img").src = "heroaura.png";
    document.getElementById("playerCharacterImg").src = "hero.png";
    document.getElementById("character2-img").src = "devil.png";
    document.getElementById("character3-img").src = "sage.png";
  } else if (playerCharacter === 2) {
    document.getElementById("character2-img").src = "devilaura.png";
    document.getElementById("playerCharacterImg").src = "devil.png";
    document.getElementById("character1-img").src = "hero.png";
    document.getElementById("character3-img").src = "sage.png";
  } else if (playerCharacter === 3) {
    document.getElementById("character3-img").src = "sageaura.png";
    document.getElementById("playerCharacterImg").src = "sage.png";
    document.getElementById("character1-img").src = "hero.png";
    document.getElementById("character2-img").src = "devil.png";
  }
}

function confirmCharacter() {
  if (!playerCharacter) {
    alert("Please select a character.");
    return;
  }

  opponentCharacter = Math.floor(Math.random() * 3) + 1;
  if (opponentCharacter === 1) {
    document.getElementById("opponentCharacterImg").src = "hero.png";
  } else if (opponentCharacter === 2) {
    document.getElementById("opponentCharacterImg").src = "devil.png";
  } else if (opponentCharacter === 3) {
    document.getElementById("opponentCharacterImg").src = "sage.png";
  }
  symbols.Skill = skills[playerCharacter];
  document.getElementById("skillButton").innerText = symbols.Skill;
  showSection(game);
  result.classList.add("hidden");
  updateSkillButton();
}

document
  .getElementById("attackButton")
  .addEventListener("click", () => playerChoice("Attack"));
document
  .getElementById("defendButton")
  .addEventListener("click", () => playerChoice("Defend"));
document
  .getElementById("chargeButton")
  .addEventListener("click", () => playerChoice("Charge"));
document
  .getElementById("skillButton")
  .addEventListener("click", () => playerChoice("Skill"));

document.getElementById("mainMenuButton").addEventListener("click", () => {
  resetGame();
  showSection(mainMenu);
});

function playerChoice(choice) {
  latestPlayerChoice = choice;
  let opponentChoice;
  if (canUseOpponentSkill()) {
    opponentChoice = choices[Math.floor(Math.random() * choices.length)];
  } else {
    opponentChoice = choices.filter((c) => c !== "Skill")[
      Math.floor(Math.random() * 3)
    ]; // Exclude Skill from choices
  }
  latestOpponentChoice = opponentChoice;
  resolveChoices(opponentChoice, choice);
}

function resolveChoices(opponentChoice, playerChoice) {
  // Update HP and charge based on choices
  if (playerChoice === "Attack" && opponentChoice !== "Defend") {
    opponentHP--;
  }
  if (opponentChoice === "Attack" && playerChoice !== "Defend") {
    playerHP--;
  }
  if (playerChoice === "Charge") {
    playerCharge = Math.min(playerCharge + 1, 5);
  }
  if (opponentChoice === "Charge") {
    opponentCharge = Math.min(opponentCharge + 1, 5);
  }
  if (playerChoice === "Skill") {
    usePlayerSkill();
  }
  if (opponentChoice === "Skill" && canUseOpponentSkill()) {
    useOpponentSkill();
  }

  updateStatus();
  displayChoices(playerChoice, opponentChoice);
  checkGameOver();
}

function canUseOpponentSkill() {
  if (opponentCharacter === 1 && opponentCharge >= 2) {
    return true;
  } else if (opponentCharacter === 2 && opponentCharge >= 3) {
    return true;
  } else if (opponentCharacter === 3 && opponentCharge >= 4) {
    return true;
  }
  return false;
}

function getSkillChargeRequirement(character) {
  if (character === 1) return 2;
  if (character === 2) return 3;
  if (character === 3) return 4;
  return 0;
}

function usePlayerSkill() {
  if (playerCharacter === 1 && playerCharge >= 2) {
    playerCharge -= 2;
    playerHP = Math.min(playerHP + 1, 5);
  } else if (playerCharacter === 2 && playerCharge >= 3) {
    playerCharge -= 3;
    opponentHP -= 2;
  } else if (playerCharacter === 3 && playerCharge >= 4) {
    playerCharge -= 4;
    if (latestOpponentChoice !== "Defend") {
      opponentHP -= 5;
    }
  }
}

function useOpponentSkill() {
  if (opponentCharacter === 1 && opponentCharge >= 2) {
    opponentCharge -= 2;
    opponentHP = Math.min(opponentHP + 1, 5);
  } else if (opponentCharacter === 2 && opponentCharge >= 3) {
    opponentCharge -= 3;
    playerHP -= 2;
  } else if (opponentCharacter === 3 && opponentCharge >= 4) {
    opponentCharge -= 4;
    if (latestPlayerChoice !== "Defend") {
      playerHP -= 5; // Unblocked attack
    }
  }
}

function checkGameOver() {
  if (playerHP <= 0 && opponentHP <= 0) {
    drawResult("Draw!");
  } else if (playerHP <= 0) {
    drawResult("You Lost!");
  } else if (opponentHP <= 0) {
    drawResult("You Won!");
  } else {
    return; // No game over
  }
}

function displayChoices(playerChoice, opponentChoice) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "48px Arial";
  ctx.textAlign = "center";

  // Opponent skill
  const opponentSkillSymbol = skills[opponentCharacter];

  // Draw opponent choice
  ctx.fillText(
    opponentChoice === "Skill" ? opponentSkillSymbol : symbols[opponentChoice],
    canvas.width / 2,
    canvas.height / 4
  );
  ctx.font = "24px Arial";
  ctx.fillText("Opponent", canvas.width / 2, canvas.height / 4 + 30);

  // Draw player choice
  ctx.font = "48px Arial";
  ctx.fillText(
    playerChoice === "Skill" ? symbols.Skill : symbols[playerChoice],
    canvas.width / 2,
    (3 * canvas.height) / 4
  );
  ctx.font = "24px Arial";
  ctx.fillText("Player", canvas.width / 2, (3 * canvas.height) / 4 + 30);
}

function drawResult(text) {
  document.getElementById("attackButton").disabled = true;
  document.getElementById("defendButton").disabled = true;
  document.getElementById("chargeButton").disabled = true;
  document.getElementById("skillButton").disabled = true;

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  ctx.font = "48px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  // Draw the main menu button
  ctx.font = "24px Arial";
  ctx.fillText("Main Menu", canvas.width / 2, canvas.height / 2 + 50);

  // Add event listener for main menu button click
  canvas.addEventListener("click", mainMenuButtonClick);
}

function mainMenuButtonClick(event) {
  const x = event.offsetX;
  const y = event.offsetY;

  // Check if the click is within the main menu button area
  const buttonX = canvas.width / 2 - 50;
  const buttonY = canvas.height / 2 + 20;
  const buttonWidth = 100;
  const buttonHeight = 30;

  if (
    x >= buttonX &&
    x <= buttonX + buttonWidth &&
    y >= buttonY &&
    y <= buttonY + buttonHeight
  ) {
    // Remove event listener to prevent multiple calls
    canvas.removeEventListener("click", mainMenuButtonClick);
    // Go back to the main menu
    resetGame();
    showSection(mainMenu);
  }
}

function resetGame() {
  playerHP = 5;
  opponentHP = 5;
  playerCharge = 0;
  opponentCharge = 0;
  updateStatus();
  result.classList.add("hidden"); // Hide result box
  document.getElementById("attackButton").disabled = false;
  document.getElementById("defendButton").disabled = false;
  document.getElementById("chargeButton").disabled = false;
  document.getElementById("skillButton").disabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  showSection(mainMenu);
}

// Initialize the game to show the main menu
showSection(mainMenu);
