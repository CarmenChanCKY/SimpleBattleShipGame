// global variable
var enemyShipClass = new Array();
var playShipCount;
var round = 1;

// function variable
var enemyHandler;

function setPlayPanel(name, shipSize) {
    initializeRemainingShip(name);
    document.getElementById("sea-enemy").setAttribute("class", "sea");
    document.getElementById("sea-enemy").appendChild(getSea(true, true));

    setEnemySea(name, shipSize);
    setInfo(name);
    addEnemyHandler(name);
}



// initialize the number of ships need to attack by enemy and player
function initializeRemainingShip(name) {
    // count the number of ship inside enemy ea and player sea
    playShipCount = new Array();
    for (var i = 0; i < 2; i++) {
        playShipCount.push(new Array(name.length));
        for (var j = 0; j < name.length; j++) {
            if (i == 0) {
                // initialize the class number of enemy ship
                enemyShipClass[j] = 1;
                if (setShipCount[j][0] == name[j]) {
                    // setShipCount is the variable inside setSea.js
                    playShipCount[i][j] = parseInt(sessionStorage.getItem(name[j])) - setShipCount[j][1];
                }
            } else {
                // it is used to mark the number of ship for each type is set inside the enemy sea 
                playShipCount[i][j] = 0;
            }
        }
    }
}

function setEnemySea(name, shipSize) {

    do {
        // random variable for enemy ship
        var randRowPosition = Math.floor(Math.random() * parseInt(sessionStorage.getItem("seaSize")));
        var randColPosition = Math.floor(Math.random() * parseInt(sessionStorage.getItem("seaSize")));
        var randDirection = Math.floor(Math.random() * 2);
        var randomShipType = Math.floor(Math.random() * 4);

        // enemy sea and player sea have the same amount of ships with same type
        if (playShipCount[0][randomShipType] == playShipCount[1][randomShipType]) {
            continue;
        }

        // horizontal
        if (randDirection == 0) {
            if (randColPosition + shipSize[randomShipType] - 1 <= parseInt(sessionStorage.getItem("seaSize") - 1)) {
                if (checkOverlap(randRowPosition, randColPosition, shipSize[randomShipType], true, false)) {
                    continue;
                }
                for (var i = randColPosition; i < randColPosition + shipSize[randomShipType]; i++) {
                    if (!enemySea[randRowPosition][i]) {
                        document.getElementById("E" + randRowPosition.toString() + i.toString()).classList.add("E" + name[randomShipType] + enemyShipClass[randomShipType].toString());
                        enemySea[randRowPosition][i] = true;
                    }
                }
                enemyShipClass[randomShipType]++;
                playShipCount[1][randomShipType]++;
            }
            // vertical
        } else if (randDirection == 1) {
            if (randRowPosition + shipSize[randomShipType] - 1 <= parseInt(sessionStorage.getItem("seaSize") - 1)) {
                if (checkOverlap(randColPosition, randRowPosition, shipSize[randomShipType], false, false)) {
                    continue;
                }
                for (var i = randRowPosition; i < randRowPosition + shipSize[randomShipType]; i++) {
                    if (!enemySea[i][randColPosition]) {
                        document.getElementById("E" + i.toString() + randColPosition.toString()).classList.add("E" + name[randomShipType] + enemyShipClass[randomShipType].toString());
                        enemySea[i][randColPosition] = true;
                    }
                }
                enemyShipClass[randomShipType]++;
                playShipCount[1][randomShipType]++;
            }
        }
    } while (checkEqualNumOfShip());

}

// set the information board
function setInfo(name) {
    document.getElementById("playInfo1").innerHTML = "Round " + round;
    if (round % 2 != 0) {
        document.getElementById("playInfo2").innerHTML = "Your turn!";
    } else {
        document.getElementById("playInfo2").innerHTML = "Enemy turn!";
    }


    for (var i = 3; i <= 4; i++) {
        document.getElementById("playInfo" + i.toString()).innerHTML = "";
        var temp = document.createElement("p");
        if (i == 3) {
            temp.appendChild(document.createTextNode("Player"));
        } else {
            temp.appendChild(document.createTextNode("Enemy"));
        }
        document.getElementById("playInfo" + i.toString()).appendChild(temp);
        for (var j = 0; j < name.length; j++) {
            temp = document.createElement("p");
            if (i == 3) {
                temp.setAttribute("id", "player" + j.toString());
            } else {
                temp.setAttribute("id", "enemy" + j.toString());
            }
            temp.appendChild(document.createTextNode("Remaining ship - " + name[j] + ": " + playShipCount[i - 3][j]));
            document.getElementById("playInfo" + i.toString()).appendChild(temp);
        }
    }

    document.getElementById("play-info").style.display = "block";

}

// check whether there are same number of ships for each type inside enemy sea and player sea
function checkEqualNumOfShip() {
    for (var j = 0; j < playShipCount[0].length; j++) {
        if (playShipCount[0][j] != playShipCount[1][j]) {
            return true;
        }
    }
    return false;
}

// handler for player to attack enemy
function addEnemyHandler(name) {

    enemyHandler = function () {
        var notFinish = false;
        var num = event.target.id.substr(1, event.target.id.length);
        var className = event.target.classList.item(1);
        var col = parseInt(num) % 10;
        var row = parseInt(parseInt(num) / 10);

        // hit
        if (enemySea[row][col] == true) {
            enemySea[row][col] = "H";
            event.target.innerHTML = "H";
            document.getElementById("playInfo2").innerHTML = "Player: Hit!";
            document.getElementById("E" + row.toString() + col.toString()).classList.remove(className);

            var list = document.getElementsByClassName(className);

            // a ship has been destroyed
            if (list.length <= 0) {
                var temp = document.createElement("p");
                temp.appendChild(document.createTextNode("Player: Congraduation! A " + className.substr(1, className.length - 2) + " has been removed!"))
                document.getElementById("playInfo2").appendChild(temp);
                for (var i = 0; i < name.length; i++) {
                    if (name[i] == className.substr(1, className.length - 2)) {
                        playShipCount[1][i]--;
                        document.getElementById("enemy" + i.toString()).innerHTML = "Remaining ship - " + name[i] + ": " + playShipCount[1][i];
                        break;
                    }
                }
            }
        }
        // miss
        else {
            enemySea[row][col] = "M";
            event.target.innerHTML = "M";
            document.getElementById("playInfo2").innerHTML = "Player: Miss!";
        }

        // user cannot attack the enemy sea now
        removeEnemyHandler();

        // check whether all the ship inside the enemy sea has been destroyed
        for (var i = 0; i < parseInt(sessionStorage.getItem("seaSize")); i++) {
            for (var j = 0; j < parseInt(sessionStorage.getItem("seaSize")); j++) {
                if (enemySea[i][j] == true) {
                    notFinish = true;
                    break;
                }
            }
        }

        if (notFinish) {
            // repeat every 2 second
            setTimeout(function () {
                // enemy attack the player
                if (enemyAttack(name)) {
                    addConstraintEnemyHandler();
                    round++;
                    document.getElementById("playInfo1").innerHTML = "Round " + round;
                }
            }, 2000);
        } else {
            // alert box
            // player wins 
            swal({
                title: "Congraduation!",
                text: "You win this game!"
            });
        }

    }

    addConstraintEnemyHandler();
}

// add handler to the position that has not been clicked inside enemy sea
function addConstraintEnemyHandler() {
    for (var i = 0; i < parseInt(sessionStorage.getItem("seaSize")); i++) {
        for (var j = 0; j < parseInt(sessionStorage.getItem("seaSize")); j++) {
            if (enemySea[i][j] != "H" && enemySea[i][j] != "M") {
                document.getElementById("E" + i.toString() + j.toString()).addEventListener("click", enemyHandler);
                document.getElementById("E" + i.toString() + j.toString()).style.cursor = "pointer";
            }
        }
    }
}

// remove all the handler inside the enemy sea
function removeEnemyHandler() {
    for (var i = 0; i < parseInt(sessionStorage.getItem("seaSize")); i++) {
        for (var j = 0; j < parseInt(sessionStorage.getItem("seaSize")); j++) {
            document.getElementById("E" + i.toString() + j.toString()).removeEventListener("click", enemyHandler);
            document.getElementById("E" + i.toString() + j.toString()).style.cursor = "auto";
        }
    }
}

// store the first position that ennemy hit a ship inside the player sea
var firstRowHit = -1;
var firstColHit = -1;

// store the first position that ennemy hit a ship inside the player sea
var previousRow = -1;
var previousCol = -1;

// control the direction that enemy should hit
// left right up down
var AIDirection = [true, true, true, true];

var position = -1;

// AI for enemy to attack player's ship
function enemyAttack(name) {

    var notFinish = false;

    if (firstRowHit == -1 && firstColHit == -1) {
        // the last attack is miss or it does not hit any position before
        do {
            var randRow = Math.floor(Math.random() * parseInt(sessionStorage.getItem("seaSize")));
            var randCol = Math.floor(Math.random() * parseInt(sessionStorage.getItem("seaSize")));
        } while (playerSea[randRow][randCol] == "H" || playerSea[randRow][randCol] == "M");
    } else {

        for (var i = 0; i < AIDirection.length; i++) {
            if (AIDirection[i] == false) {
                // this direction has been attacked
                continue;
            } else if (AIDirection[i] == true) {
                position = i;

                // decide the position should be attacked
                switch (i) {
                    case 0: randRow = previousRow;
                        randCol = previousCol - 1;
                        break;
                    case 1: randRow = previousRow;
                        randCol = previousCol + 1;
                        break;
                    case 2: randRow = previousRow - 1;
                        randCol = previousCol;
                        break;
                    case 3: randRow = previousRow + 1;
                        randCol = previousCol;
                        break;
                    default:
                        do {
                            var randRow = Math.floor(Math.random() * parseInt(sessionStorage.getItem("seaSize")));
                            var randCol = Math.floor(Math.random() * parseInt(sessionStorage.getItem("seaSize")));
                        } while (playerSea[randRow][randCol] == "H" || playerSea[randRow][randCol] == "M");
                        break;
                }

                // the position cannot be attacked
                if (randRow < 0 || randCol < 0 || randRow >= parseInt(sessionStorage.getItem("seaSize")) || randCol >= parseInt(sessionStorage.getItem("seaSize"))
                    || playerSea[randRow][randCol] == "M" || playerSea[randRow][randCol] == "H") {
                    AIDirection[i] = false;
                    previousRow = firstRowHit;
                    previousCol = firstColHit;
                    continue;
                }
                break;
            }
        }
    }

    var className = document.getElementById(randRow.toString() + randCol.toString()).classList.item(1);
    // hit
    if (playerSea[randRow][randCol] == true) {
        playerSea[randRow][randCol] = "H";
        document.getElementById(randRow.toString() + randCol.toString()).innerHTML = "H";
        document.getElementById("playInfo2").innerHTML = "Enemy: Hit!";
        document.getElementById(randRow.toString() + randCol.toString()).classList.remove(className);

        // set the variable according to the hit position
        if (firstRowHit == -1 && firstColHit == -1) {
            firstRowHit = randRow;
            firstColHit = randCol;
            previousRow = randRow;
            previousCol = randCol;
        } else {
            previousRow = randRow;
            previousCol = randCol;
        }

        var list = document.getElementsByClassName(className);

        // a ship has been destroyed
        if (list.length <= 0) {
            var temp = document.createElement("p");
            temp.appendChild(document.createTextNode("Enemy: Congraduation! A " + className.substr(0, className.length - 1) + " has been removed!"))
            document.getElementById("playInfo2").appendChild(temp);
            for (var i = 0; i < name.length; i++) {
                console.log(className.substr(0, className.length - 1))
                if (name[i] == className.substr(0, className.length - 1)) {
                    playShipCount[0][i]--;
                    document.getElementById("player" + i.toString()).innerHTML = "Remaining ship - " + name[i] + ": " + playShipCount[0][i];
                    break;
                }
            }

            // initialize all the variable again
            AIDirection = [true, true, true, true];
            firstColHit = -1;
            firstRowHit = -1;
            previousRow = -1;
            previousCol = -1;
            position = -1;
        }
    }

    // miss
    else {
        playerSea[randRow][randCol] = "M";
        document.getElementById(randRow.toString() + randCol.toString()).innerHTML = "M";
        document.getElementById("playInfo2").innerHTML = "Enemy: Miss!";
        AIDirection[position] = false;
        previousRow = firstRowHit;
        previousCol = firstColHit;
    }

    // check whether all the ship inside the player sea has been destroyed
    for (var i = 0; i < parseInt(sessionStorage.getItem("seaSize")); i++) {
        for (var j = 0; j < parseInt(sessionStorage.getItem("seaSize")); j++) {
            if (playerSea[i][j] == true) {
                notFinish = true;
                break;
            }
        }
    }

    if (!notFinish) {
        removeEnemyHandler();
        // alert box
        // enemy wins
        swal({
            title: "Oops...",
            text: "You loss this game..."
        });
        return false;
    }

    return true;



}



