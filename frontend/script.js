
var socket = io();
let playerid = 0;

socket.on('button clicked', function(msg) {
    console.log(msg);
    let buttonclicked = document.getElementById(msg[0]);
    let infoh2 = document.getElementById("info");
    let turn = msg[1];
    // let win = msg[2];
    //if (win) {
    //    infoh2.innerHTML = "Game already over.";
    //    return;
    //}
    if (turn === 1) {
        buttonclicked.innerHTML = "X"; 
        infoh2.innerHTML = (playerid === 2) ? "Your Turn": "Other Player's Turn";
        
    } if (turn === 2) {
        buttonclicked.innerHTML = "O";
        infoh2.innerHTML = (playerid === 1) ? "Your Turn": "Other Player's Turn";
    }
});

socket.on('too many players', function() {
    let infoh2 = document.getElementById("info");
    infoh2.innerHTML = "Sorry, two players got there ahead of you. Try reloading if you want";
    let board = document.getElementsByClassName("boarditem");
    for (let i of board) i.style.backgroundColor = "white";
});

socket.on('too few players', function(msg) {
    playerid = 1;
    let infoh2 = document.getElementById("info");
    infoh2.innerHTML = "Waiting for second player to join..";
    let board = document.getElementsByClassName("boarditem");
    for (let i of board) i.style.backgroundColor = "white";
    
});


socket.on('ready to play', function(msg) {
    let infoh2 = document.getElementById("info");
    if (playerid != 1) playerid = 2;
    infoh2.innerHTML = (playerid === 1) ? "Your Turn": "Other Player's Turn";
    let board = document.getElementsByClassName("boarditem");
    for (let i of board) {
        i.style.backgroundColor = "black";
        i.innerHTML = '';
    }
});

socket.on('button response', function(msg) {
    let infoh2 = document.getElementById("info");
    if (!infoh2.innerHTML.includes(msg)) infoh2.innerHTML += " - " + msg;
});

socket.on('game status', function(msg) {
    let infoh2 = document.getElementById("info");
    if (msg === 0) infoh2.innerHTML = "Tie!";
    else infoh2.innerHTML = (playerid === msg) ? "You win!" : "You lose!";
});


let turn = 1; 
let win = false;
function makeMove(buttonclicked) {
    socket.emit('button clicked', [buttonclicked.id, playerid]); 

}