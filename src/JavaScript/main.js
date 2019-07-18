
// for button in home page and back button]
function openLink(val) {
    var link = "";
    if (val == "Back") {
        link = "../../index.html";
    }
    else if (val == "Play") {
        link = "src/HTML/play.html";
    }
    else if (val == "Setting") {
        link = "src/HTML/setting.html";
    }
    else if (val == "Rule") {
        link = "src/HTML/rule.html";
    }
    window.open(link, "_self");
}

// check whether the content inside data.json has been read before
function isStorageNull() {
    if (sessionStorage.length == 0) {
        return true;
    }
    return false;
}

// for sea size setting inside setting.html
function seaSettingLayout(min, max, name, de, shipSize) {
    // create a drop-down list
    var list = document.createElement("select");
    list.setAttribute("id", "seaSizeList");
    list.setAttribute("class", "list");

    // add handler
    list.addEventListener("change", function () {
        seaSizeHandler(name, de, shipSize);
    });

    for (var i = min; i <= max; i++) {
        var temp = document.createElement("option");
        temp.setAttribute("value", i.toString());
        temp.appendChild(document.createTextNode(i.toString()));
        if (i == sessionStorage.getItem("seaSize")) {
            temp.selected = true;
        } else {
            temp.selected = false;
        }
        list.appendChild(temp);
    }
    document.getElementById("sizeTD2").appendChild(list);

    // create a sea
    var sea = document.getElementById("sizeTD1");
    sea.appendChild(getSea(false, false));
}

// handler for seaSettingLayout()
function seaSizeHandler(name, de, shipSize) {
    var list = document.getElementById("seaSizeList");
    var sea = document.getElementById("sizeTD1");
    sea.innerHTML = "";
    // change the default sea size
    sessionStorage.setItem("seaSize", list.options[list.selectedIndex].value);
    sea.appendChild(getSea(false, false));

    // change the default number of ships according to sea size
    var position = de[parseInt(sessionStorage.getItem("seaSize")) - 5];
    for (var i = 0; i < position.length; i++) {
        sessionStorage.setItem(name[i], position[i]);
        var list2 = document.getElementById(name[i]);
        list2.selectedIndex = position[i] - 1;
    }

    // count the Total Sea space and Remaining Sea space
    countShip(name, shipSize);

}

function shipSettingLayout(min, max, name, shipSize) {
    for (var j = 1; j <= name.length; j++) {
        // show the name of ships
        var para = document.createElement("p").appendChild(document.createTextNode(name[j - 1]));

        // show the size of ships
        var para2 = document.createElement("p");
        var tempTable = document.createElement("table");
        tempTable.setAttribute("class", "seaTable");
        var tempTR = document.createElement("tr");
        tempTR.setAttribute("class", "seaTableRow");
        for (var i = 1; i <= shipSize[j - 1]; i++) {
            var tempTD = document.createElement("td");
            tempTD.setAttribute("class", "seaTableCell");
            tempTD.appendChild(document.createTextNode(name[j - 1].substr(0, 1)));
            tempTR.appendChild(tempTD);
        }
        tempTable.appendChild(tempTR);
        para2.appendChild(tempTable);

        // create a drop-down list
        var list = document.createElement("select");
        list.setAttribute("id", name[j - 1]);
        list.setAttribute("class", "list");
        // add handler
        list.addEventListener("change", function () {
            shipSettingHandler(name, shipSize);
        });
        for (var i = min; i <= max; i++) {
            var temp = document.createElement("option");
            temp.setAttribute("value", i.toString());
            temp.appendChild(document.createTextNode(i.toString()));
            // select the default number of ship according to sea size
            if (i == sessionStorage.getItem(name[j - 1])) {
                temp.selected = true;
            } else {
                temp.selected = false;
            }
            list.appendChild(temp);
        }

        document.getElementById("shipTD" + j.toString()).appendChild(para);
        document.getElementById("shipTD" + j.toString()).appendChild(para2);
        document.getElementById("shipTD" + j.toString()).appendChild(list);
    }

    // count the Total Sea space and Remaining Sea space
    countShip(name, shipSize);

}

// handler for shipSettingLayout()
function shipSettingHandler(name, shipSize) {
    var list = document.getElementById(event.target.id);
    // check whether the total amount of ships exceed the limit
    if (checkSeaIsFull(event.target.id, parseInt(list.options[list.selectedIndex].value), name, shipSize)) {
        // display instruction
        document.getElementById("instruction-disappear").style.display = "block";
        return;
    } else {
        document.getElementById("instruction-disappear").style.display = "none";
    }
    sessionStorage.setItem(event.target.id, list.options[list.selectedIndex].value);

    // count the Total Sea space and Remaining Sea space
    countShip(name, shipSize);
}


// check whether the total ship size exceed the limit
function checkSeaIsFull(newName, newNum, name, shipSize) {
    var seaSize = parseInt(sessionStorage.getItem("seaSize")) ** 2;
    var limit = Math.ceil(seaSize * 0.4);
    var check = 0;
    for (var i = 0; i < name.length; i++) {
        if (newName == name[i]) {
            check += newNum * shipSize[i];
        } else {
            check += parseInt(sessionStorage.getItem(name[i])) * shipSize[i];
        }

    }

    // total ship size inside the sea exceed the limit
    if (seaSize - limit < check) {
        return true;
    }
    return false;

}

// count the Total Sea space and Remaining Sea space
function countShip(name, shipSize) {
    var seaSize = parseInt(sessionStorage.getItem("seaSize")) ** 2;
    var limit = Math.ceil(seaSize * 0.4);
    var check = 0;
    for (var i = 0; i < name.length; i++) {
        check += parseInt(sessionStorage.getItem(name[i])) * shipSize[i];
    }

    document.getElementById("shipP1").innerHTML = "Total Sea space: " + seaSize;
    document.getElementById("shipP2").innerHTML = "Remaining usable Sea space: " + (seaSize - check - limit);
}

//draw a sea
function getSea(isPlay, isEnemy) {
    var table = document.createElement("table");
    table.setAttribute("class", "seaTable");
    for (var i = 0; i < parseInt(sessionStorage.getItem("seaSize")); i++) {
        var tr = document.createElement("tr");
        tr.setAttribute("class", "seaTableRow");
        for (var j = 0; j < parseInt(sessionStorage.getItem("seaSize")); j++) {
            var td = document.createElement("td");
            td.setAttribute("class", "seaTableCell");
            if (isPlay) {
                if (isEnemy) {
                    table.setAttribute("id", "EnemySeaTable");
                    td.setAttribute("id", "E" + i.toString() + j.toString());
                } else {
                    table.setAttribute("id", "PlayerSeaTable");
                    td.setAttribute("id", i.toString() + j.toString());
                }
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    return table;
}






