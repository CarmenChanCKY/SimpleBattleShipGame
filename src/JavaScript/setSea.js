// global variable
var playerSea = new Array();
var enemySea = new Array();
var setShipCount;
var playerShipClass;

// function variable
var setShipMouseOver;
var setShipMouseOut;
var setShipClick;
var deleteHandler;



function setSea(name, shipSize) {
    initializeSea();
    setShipCount = new Array();
    playerShipClass = new Array();

    // display sea
    document.getElementById("sea-player").appendChild(getSea(true, false));

    for (var j = 1; j <= name.length; j++) {
        var shipName = name[j - 1];
        var size = shipSize[j - 1];

        // store the used class name for each ship
        playerShipClass.push(new Array(parseInt(sessionStorage.getItem(shipName)) + 1));
        playerShipClass[j - 1][0] = shipName;
        for (var i = 1; i < playerShipClass[j - 1].length; i++) {
            playerShipClass[j - 1][i] = false;
        }

        // store the remaining number of ships for each type of ship
        setShipCount.push(new Array(2));
        setShipCount[j - 1][0] = shipName;
        setShipCount[j - 1][1] = parseInt(sessionStorage.getItem(shipName));

        var para = document.createElement("p").appendChild(document.createTextNode(shipName));

        var tempTable = document.createElement("table");
        tempTable.setAttribute("class", "seaTable");
        var tempTR = document.createElement("tr");
        tempTR.setAttribute("class", "seaTableRow");
        for (var i = 1; i <= size; i++) {
            var tempTD = document.createElement("td");
            tempTD.setAttribute("class", "seaTableCell");
            tempTD.appendChild(document.createTextNode(shipName.substr(0, 1)));
            tempTR.appendChild(tempTD);
        }
        tempTable.appendChild(tempTR);
        var para2 = document.createElement("p").appendChild(tempTable);

        var para3 = document.createElement("p");
        para3.setAttribute("id", shipName + "P");
        para3.innerHTML = "Remaining: " + setShipCount[j - 1][1];

        // add radio button
        var para4 = document.createElement("p");
        for (k = 0; k < 2; k++) {
            var p = document.createElement("p");
            var radio = document.createElement("input");
            radio.setAttribute("type", "radio");
            radio.setAttribute("name", shipName + "Direction");
            var text = "Horizontal";
            if (k == 0) {
                radio.checked = true;
            }
            if (k == 1) {
                text = "Vertical";
            }
            radio.setAttribute("id", shipName + text);
            radio.setAttribute("value", text);
            var label = document.createElement("label");
            label.appendChild(radio);
            label.appendChild(document.createTextNode(text));
            p.appendChild(label);
            para4.appendChild(p);
        }

        // add button
        var button = document.createElement("button");
        button.setAttribute("class", "button-confirm");
        button.setAttribute("id", shipName);
        button.setAttribute("value", size);

        // add the event handler to "Add" button
        button.addEventListener("click", addHandler);
        button.appendChild(document.createTextNode("Add"));
        var para5 = document.createElement("p").appendChild(button);

        // add the control panel
        document.getElementById("shipPlayTD" + j.toString()).appendChild(para);
        document.getElementById("shipPlayTD" + j.toString()).appendChild(para2);
        document.getElementById("shipPlayTD" + j.toString()).appendChild(para3);
        document.getElementById("shipPlayTD" + j.toString()).appendChild(para4);
        document.getElementById("shipPlayTD" + j.toString()).appendChild(para5);

    }
}

function initializeSea() {
    for (var i = 0; i < parseInt(sessionStorage.getItem("seaSize")); i++) {
        playerSea.push(new Array(parseInt(sessionStorage.getItem("seaSize"))));
        enemySea.push(new Array(parseInt(sessionStorage.getItem("seaSize"))));
        for (var j = 0; j < parseInt(sessionStorage.getItem("seaSize")); j++) {
            playerSea[i][j] = false;
            enemySea[i][j] = false;
        }
    }
}


function addHandler() {
    // remove all the handler inside the sea
    removeWholeTableHandler();

    // store the name and the ship size belongs to the clicked "Add" button
    var name = event.target.id;
    var shipSize = parseInt(event.target.value);

    // active when user move the cursor to the sea
    setShipMouseOver = function () {
        var col = parseInt(event.target.id) % 10;
        var row = parseInt(parseInt(event.target.id) / 10);
        var content = name.substr(0, 1);

        // ship direction is horizontal
        if (document.getElementById(name + "Horizontal").checked) {
            // check if the ship exceed the margin of sea
            if (col + shipSize - 1 <= parseInt(sessionStorage.getItem("seaSize") - 1)) {
                // check if there is not a empty position
                if (checkOverlap(row, col, shipSize, true, true)) {
                    // remove handler for this position
                    removeSetSingleHandler(row, col);
                    return;
                } else {
                    // add handler to this position
                    addSetShipHandler(row, col);
                }

                for (var i = col; i < col + shipSize; i++) {
                    if (!playerSea[row][i]) {
                        document.getElementById(row.toString() + i.toString()).innerHTML = content;
                    }
                }

            } else {
                // remove handler for this position
                removeSetSingleHandler(row, col);
                return;
            }
            // ship direction is vertical
        } else if (document.getElementById(name + "Vertical").checked) {
            // check if the ship exceed the margin of sea
            if (row + shipSize - 1 <= parseInt(sessionStorage.getItem("seaSize") - 1)) {
                // check if there is not a empty position
                if (checkOverlap(col, row, shipSize, false, true)) {
                    // remove handler for this position
                    removeSetSingleHandler(row, col);
                    return;
                } else {
                    // add handler to this position
                    addSetShipHandler(row, col);
                }

                for (var i = row; i < row + shipSize; i++) {
                    if (!playerSea[i][col]) {
                        document.getElementById(i.toString() + col.toString()).innerHTML = content;
                    }
                }

            } else {
                // remove handler for this position
                removeSetSingleHandler(row, col);
                return;
            }
        }
    }

    // active when the cursor leaves the sea
    setShipMouseOut = function () {
        var col = parseInt(event.target.id) % 10;
        var row = parseInt(parseInt(event.target.id) / 10);

        // check if the ship exceed the margin of sea
        if (document.getElementById(name + "Horizontal").checked) {
            // check if the ship exceed the margin of sea
            if (col + shipSize - 1 <= parseInt(sessionStorage.getItem("seaSize") - 1)) {
                for (var i = col; i < col + shipSize; i++) {
                    if (!playerSea[row][i]) {
                        document.getElementById(row.toString() + i.toString()).innerHTML = "";
                    }
                }
            }
            // ship direction is vertical
        } else if (document.getElementById(name + "Vertical").checked) {
            // check if the ship exceed the margin of sea
            if (row + shipSize - 1 <= parseInt(sessionStorage.getItem("seaSize") - 1)) {
                for (var i = row; i < row + shipSize; i++) {
                    if (!playerSea[i][col]) {
                        document.getElementById(i.toString() + col.toString()).innerHTML = "";
                    }
                }
            }
        }
    }

    /// active when user click any position inside the sea
    setShipClick = function () {
        var col = parseInt(event.target.id) % 10;
        var row = parseInt(parseInt(event.target.id) / 10);
        var content = name.substr(0, 1);
        var className = "";

        for (var i = 0; i < playerShipClass.length; i++) {
            if (name == playerShipClass[i][0]) {
                for (var j = 0; j < playerShipClass[i].length; j++) {
                    if (playerShipClass[i][j] == false) {
                        // find a class name that is not used before
                        playerShipClass[i][j] = true;
                        className = name + j.toString();
                        break;
                    }
                }
            }
        }

        // set ship
        if (document.getElementById(name + "Horizontal").checked) {
            if (col + shipSize - 1 <= parseInt(sessionStorage.getItem("seaSize") - 1)) {
                for (var i = col; i < col + shipSize; i++) {
                    document.getElementById(row.toString() + i.toString()).innerHTML = content;
                    // add class name
                    document.getElementById(row.toString() + i.toString()).classList.add(className);
                    // indicate that this position has been used
                    playerSea[row][i] = true;
                }
            }
        } else if (document.getElementById(name + "Vertical").checked) {
            if (row + shipSize - 1 <= parseInt(sessionStorage.getItem("seaSize") - 1)) {
                for (var i = row; i < row + shipSize; i++) {
                    document.getElementById(i.toString() + col.toString()).innerHTML = content;
                    // add class name
                    document.getElementById(i.toString() + col.toString()).classList.add(className);
                    // indicate that this position has been used
                    playerSea[i][col] = true;
                }
            }
        }

        // update the remaining ship information
        for (var i = 0; i < setShipCount.length; i++) {
            if (name == setShipCount[i][0]) {
                setShipCount[i][1]--;
                document.getElementById(name + "P").innerHTML = "Remaining: " + setShipCount[i][1].toString();
                if (setShipCount[i][1] <= 0) {
                    document.getElementById(setShipCount[i][0]).disabled = true;
                }
                break;
            }
        }

        // remove all the handler inside the sea
        removeWholeTableHandler();
    }


    // add handler
    for (var i = 0; i < parseInt(sessionStorage.getItem("seaSize")); i++) {
        for (var j = 0; j < parseInt(sessionStorage.getItem("seaSize")); j++) {
            if (!playerSea[i][j]) {
                addSetShipHandler(i, j);
            }
        }
    }
}

// check whether the position in the sea has been  used before
function checkOverlap(fix, vary, size, isHorizontal, isPlayer) {
    for (var i = vary; i < vary + size; i++) {
        if (isPlayer) {
            if (isHorizontal) {
                if (playerSea[fix][i]) {
                    return true;
                }
            } else {
                if (playerSea[i][fix]) {
                    return true;
                }
            }
        } else {
            if (isHorizontal) {
                if (enemySea[fix][i]) {
                    return true;
                }
            } else {
                if (enemySea[i][fix]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// check is there are any ship inside the sea
function checkSeaIsNull() {
    for (var i = 0; i < parseInt(sessionStorage.getItem("seaSize")); i++) {
        for (var j = 0; j < parseInt(sessionStorage.getItem("seaSize")); j++) {
            if (playerSea[i][j] == true) {
                return true;
            }
        }
    }
    return false;
}

// delete a ship inside the sea
function deleteShipHandler() {
    deleteHandler = function () {

        // get the class name of the ship
        var className = event.target.classList[1];

        var list = document.getElementsByClassName(className);

        // remove all the properties of ship with same class name
        while (list.length > 0) {
            var row = parseInt(parseInt(list[0].id) / 10);
            var col = parseInt(list[0].id) % 10;

            playerSea[row][col] = false;
            document.getElementById(row.toString() + col.toString()).innerHTML = "";
            document.getElementById(row.toString() + col.toString()).classList.remove(className);
        }

        // ship type of the class name
        var i = className.substr(0, className.length - 1);
        // order of the class name
        var j = parseInt(className.substr(className.length - 1, className.length));

        for (var k = 0; k < playerShipClass.length; k++) {
            if (playerShipClass[k][0] == i) {
                // class name is not used
                playerShipClass[k][j] = false;

                if (setShipCount[k][j] == 0) {
                    document.getElementById(setShipCount[k][0].toString()).disabled = false;
                }

                setShipCount[k][1]++;
                document.getElementById(i + "P").innerHTML = "Remaining: " + setShipCount[k][1].toString();
                break;
            }
        }

        for (var i = 0; i < parseInt(sessionStorage.getItem("seaSize")); i++) {
            for (var j = 0; j < parseInt(sessionStorage.getItem("seaSize")); j++) {
                removDeleteShipHandler(i, j);
            }
        }

    }

    // add handler
    for (var i = 0; i < parseInt(sessionStorage.getItem("seaSize")); i++) {
        for (var j = 0; j < parseInt(sessionStorage.getItem("seaSize")); j++) {
            removeSetSingleHandler(i, j);
            if (playerSea[i][j] == true) {
                addDeleteShipHandler(i, j);
            }
        }
    }
}

// function for add handler

function addSetShipHandler(i, j) {
    document.getElementById(+ i.toString() + j.toString()).style.cursor = "pointer";
    document.getElementById(i.toString() + j.toString()).addEventListener("mouseover", setShipMouseOver);
    document.getElementById(i.toString() + j.toString()).addEventListener("mouseout", setShipMouseOut);
    document.getElementById(i.toString() + j.toString()).addEventListener("click", setShipClick);
}

function addDeleteShipHandler(i, j) {
    document.getElementById(+ i.toString() + j.toString()).style.cursor = "pointer";
    document.getElementById(i.toString() + j.toString()).addEventListener("click", deleteHandler);
}

// function for remove handler

function removeSetSingleHandler(i, j) {
    document.getElementById(+ i.toString() + j.toString()).style.cursor = "auto";
    document.getElementById(i.toString() + j.toString()).removeEventListener("mouseover", setShipMouseOver);
    document.getElementById(i.toString() + j.toString()).removeEventListener("mouseout", setShipMouseOut);
    document.getElementById(i.toString() + j.toString()).removeEventListener("click", setShipClick);
}

function removDeleteShipHandler(i, j) {
    document.getElementById(+ i.toString() + j.toString()).style.cursor = "auto";
    document.getElementById(i.toString() + j.toString()).removeEventListener("click", deleteHandler);
}


function removeWholeTableHandler() {

    for (var i = 0; i < parseInt(sessionStorage.getItem("seaSize")); i++) {
        for (var j = 0; j < parseInt(sessionStorage.getItem("seaSize")); j++) {
            document.getElementById(+ i.toString() + j.toString()).style.cursor = "auto";
            document.getElementById(i.toString() + j.toString()).removeEventListener("mouseover", setShipMouseOver);
            document.getElementById(i.toString() + j.toString()).removeEventListener("mouseout", setShipMouseOut);
            document.getElementById(i.toString() + j.toString()).removeEventListener("click", setShipClick);
            document.getElementById(i.toString() + j.toString()).removeEventListener("click", deleteHandler);
        }
    }
}











