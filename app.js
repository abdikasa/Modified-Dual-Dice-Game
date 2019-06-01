/*

MODIFIED GAME RULES: MY VERSION (JS DONE BY ME, CSS and HTML ARE BOILERPLATE/SAMPLE CODE) - DIFFERENT THAN THE ORIGINAL DOM

-A player loses his entire score (main score) when he rolls two 6's in a row. After that it's the next player's turn.
-Add an input field for users to pick the winning score.
-Lastly, add another dice, player loses his current score (round score) if either dice rolls a 1.

*/

/**********************************************
*** DECLARED VARIABLES
**********************************************/

let activePlayer, scores, roundScore, stillPlaying, dice, dice2, diceRoll, winningScore;
let hold, roll, newGame, diceImg, p0_score, p0_curr, p1_curr, p1_score, scoreLimit, scoreForm, hideError, hideError_content, pig_icon, pig_icon_link;

/**********************************************
*** DEFINED VARIABLES
**********************************************/

activePlayer = 0;
scores = [0, 0];
roundScore = 0;
stillPlaying = true;

/**********************************************
*** DOM HANDLERS
**********************************************/

hold = document.querySelector(".btn-hold");
roll = document.querySelector(".btn-roll");
newGame = document.querySelector(".btn-new");
diceImg = document.querySelectorAll(".dice");
p0_score = document.getElementById("score-0");
p1_score = document.getElementById("score-1");
p0_curr = document.getElementById("current-0");
p1_curr = document.getElementById("current-1");
modal = document.querySelector(".modal");
modal_btn = document.querySelector(".btn-white");
scoreLimit = document.querySelector("#score_limit");
scoreForm = document.querySelector("#score_form");
hideError = document.querySelector(".hidden");
hideError_content = document.querySelector(".hidden_content");
pig_icon = document.querySelector(".pig-icon");
pig_icon_link = document.querySelector(".pig_link");

/**********************************************
*** STARTS A NEW GAME/ RESETS SCORES TO ZERO
**********************************************/

function start() {
    scoreReset();
    handleButtonAction();
    removeAdditionalClasses();
}

function removeAdditionalClasses() {
    document.querySelector(`.player-0-panel`).classList.add(`active`);
    document.querySelector(`.player-0-panel`).classList.remove(`winner`);
    document.querySelector(`.player-1-panel`).classList.remove(`winner`);
    document.querySelector(`.player-1-panel`).classList.remove(`active`);
}

function scoreReset() {
    p0_score.textContent = 0;
    p1_score.textContent = 0;
    p0_curr.textContent = 0;
    p1_curr.textContent = 0;
}

function handleButtonAction() {

    diceImg.forEach(function (item) {
        item.style.display = "none";
    })

    hold.style.display = "block";
    roll.style.display = "block";
}

/**********************************************
*** CHANGES TURNS
**********************************************/

//When user rolls a 1, this function is called.
//It will look at the global activePlayer variable and check to see if it's 0 or 1; player 1 or player 2.
//I used the toggle class to remove/add the active class from one player and add it to another.
//Finally it will return the value of activePlayer; which will be stored in another variable for later use.

let changeTurns = function () {
    if (activePlayer === 0) {
        document.querySelector(`.player-${activePlayer}-panel`).classList.remove(`active`);
        activePlayer = 1;
        document.querySelector(`.player-${activePlayer}-panel`).classList.add(`active`);
    } else {
        document.querySelector(`.player-${activePlayer}-panel`).classList.remove(`active`);
        activePlayer = 0;
        document.querySelector(`.player-${activePlayer}-panel`).classList.add(`active`);
    }
    diceImg.forEach(function (item) {
        item.style.display = "none";
    })
    return activePlayer;
}

/**********************************************
*** HOLD BUTTON FUNCTION
**********************************************/

//When user clicks the hold button, this function is called.
//It will look at the global activePlayer variable and check to see if it's 0 or 1; player 1 or player 2.
//I used the toggle class to remove/add the 'active' class from one player and add it to another.
//I used a variable  to store the active player's turn, then used the already created array to store the results.
//This task involved using typeof to learn that the score variable returns a string which is converted to a number for calc.
//If player does not hit at least 100 points after pressing hold, the changeTurn function is called. 
//If player does hit at least 100 points, the active class is removed and the special 'winner' class is added.

let holding = function () {
    let score = document.getElementById(`score-${activePlayer}`);
    scores[activePlayer] = Number(score.textContent) + roundScore;
    score.textContent = scores[activePlayer];
    //   console.log(scores[activePlayer]);
    roundScore = 0;
    document.getElementById(`current-${activePlayer}`).textContent = 0;
    if (scores[activePlayer] > winningScore) {
        document.querySelector(`.player-${activePlayer}-panel`).classList.remove("active");
        document.querySelector(`.player-${activePlayer}-panel`).classList.add("winner")
        hold.style.display = "none";
        roll.style.display = "none";
        pig_icon.style.zIndex = "16"
    } else {
        activePlayer = changeTurns();
    }
}


/**********************************************
*** ROLL DICE FUNCTION
**********************************************/

//Handles the function when player clicks the ROLL DICE button.
//Adds users score to their round score, resets the round score when switching turns.
//Cleverly manipulated the DOM and the defined names for the images by using javascript dynamic properties.
//Outputs round score.
//Switches turns if user rolls a 1, which results a round score of 0 and a skipped turn.
//Simplified console log duties  with ternary operator that calculates whetehr player scored a 1 or 2 6's.

diceRoll = function () {
    let oldScore = roundScore;
    let lostTurn = false;
    let stmt = "";
    dice = Math.floor(Math.random() * 6) + 1;
    dice2 = Math.floor(Math.random() * 6) + 1;

    diceImg.forEach(function (item) {
        item.style.display = "block";
    })

    if (dice === 1 || dice2 === 1) {
        roundScore = 0;
        document.getElementById(`current-${activePlayer}`).textContent = roundScore;
        activePlayer = changeTurns();
        lostTurn = true;
    } else if (dice === 6 && dice2 === 6) {
        roundScore = 0;
        document.getElementById(`score-${activePlayer}`).textContent = roundScore;
        activePlayer = changeTurns();
        lostTurn = true;
    } else {
        diceImg[0].src = `dice-${dice}.png`
        diceImg[1].src = `dice-${dice2}.png`
        oldScore = roundScore;
        roundScore += (dice + dice2);
        document.getElementById(`current-${activePlayer}`).textContent = roundScore;
        lostTurn = false;
    }
    stmt = lostTurn === true ? `UNLUCKY, Player rolled a 1 or two 6's` : `Player ${activePlayer} D1 [${dice}] + D2 [${dice2}] = ${roundScore} 
    (Last score: ${oldScore})`;
    console.log(stmt);
}

/**********************************************
*** LISTENERS/EVENTS
**********************************************/

//Aside from the timeout method, the rest of the listeners will not run into the website is fully ready when all functions have been executed.
//Listeners are only called and executed in the cycle after the functions have been called.
//Introduced something other than boring click to mouse(down||up), user presses it and holds it down, and when released the modal pops up.
//Pig icon will not be accessible until a winner is declared so users can't just change scores whenever they feel like it.
//8:21 [2019-05-31] Fixed issue where if user decided to click new game instead of clicking the pig icon to chnage the score limit, pig icon remains clickable
//Issue fixed with setting z-index to 0 if user clicks new game button.

roll.addEventListener("click", diceRoll);

hold.addEventListener("click", holding);

newGame.addEventListener("click", function () {
    start();
    pig_icon.style.zIndex = "0";
});

scoreLimit.addEventListener("input", function (e) {
    winningScore = e.target.value;
})

scoreForm.addEventListener("submit", scoreInput);
modal_btn.addEventListener("click", function () {
    if (!scoreInput()) {
        showError()
    }
})

pig_icon.addEventListener("mousedown", function () {
    pig_icon.style.transform = "scale(0.80)"
    pig_icon.style.transition = "transform 0.4s"
})

pig_icon.addEventListener("mouseup", function () {
    pig_icon.style.transform = "scale(1.0)"
    showModal();
})


/**********************************************
*** REUSABLE FUNCTIONS
**********************************************/

//clickModal()
//Hides the Modal, assigns the Z-Index and gets rid of the error div and starts a fresh new game.

function hideModal() {
    modal.style.visibility = "none";
    modal.style.opacity = "0";
    document.querySelector(".dark").style.opacity = "1";
    document.body.style.zIndex = "15";
    modal.style.zIndex = "-1";
    pig_icon.style.zIndex = "0"
    errorGone();
    start();
}

//showError()
//Shows the error section, animates the error to vibrate from left to right.

function showError() {
    hideError.style.display = "block";
    hideError.style.visibility = "visible"
    hideError.classList.toggle("animate");
}

//errorGone()
//Hides the error and sets it to none.

function errorGone() {
    hideError.style.display = "none";
    hideError.style.visibility = "none"
}

//showModal()
//Hides the modal, assigns the z-index properly, sets the scoreLimit input box to blank.

function showModal() {
    modal.style.visibility = "visible";
    modal.style.opacity = "1";
    document.querySelector(".dark").style.opacity = "1";
    document.body.style.zIndex = "-1";
    modal.style.zIndex = "10";
    errorGone();
    scoreLimit.value = "";
}

//scoreInput()
//Uses the HTML5 input min and max values through getAttribute and sees if the user types a number within the range.
//Returns true or false because I want to  reuse it whenever possible; like when the modal button is called, it will see what to do  depending on the result.


function scoreInput() {
    if ((Number(winningScore) >= Number(scoreLimit.getAttribute("min")) && Number(winningScore) <= Number(scoreLimit.getAttribute("max")))) {
        hideModal();
        return true;
    }
    return false;
}










