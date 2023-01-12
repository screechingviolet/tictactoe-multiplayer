const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
let turn = 1;
let win = false;
let grid = ["","","","","","","","",""];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/index.html');
});

app.use(express.static(__dirname + '/frontend'));

io.on('connection', (socket) => {
    console.log('a user connected');
    
    if (io.sockets.sockets.size > 2) {
        socket.emit('too many players');
        console.log("Third player joined and promptly yoinked");
        socket.disconnect();
    } else if (io.sockets.sockets.size < 2) {
        socket.emit('too few players',1);
        console.log('One player joined');
    } else {
        io.emit('ready to play',2);
        console.log('Second player joined, ready to play');
        win = false;
        grid = ["","","","","","","","",""];
        turn = 1;
    }
   
    socket.on('disconnect', () => {
        console.log('a user disconnected');
        io.emit('too few players');
  });
     socket.on('button clicked', (msg) => {
    if (io.sockets.sockets.size != 2) socket.emit('button response', "");
    else if (win) socket.emit('button response', "Game already over");
    else if (msg[1] != turn) {
        socket.emit('button response', "Not your turn");
    } else if (grid[parseInt(msg[0])-1] != "") {
        socket.emit('button response', "Square is already filled");
    } else {
        grid[parseInt(msg[0])-1] = (turn === 1) ? "X" : "O";
    console.log(grid);
     io.emit('button clicked', [msg[0],turn]);
    
        
    // is game over
    for (let i = 0; i <= 6; i+=3) {
    if (grid[0+i]===grid[1+i] && grid[1+i]===grid[2+i] && grid[2+i]!="") {
        win = true;
        //io.emit('game status', "Player " + turn + " wins!");
        io.emit('game status', turn);
        }
    }
    for (let i = 0; i < 3; i++) {
        if (grid[0+i]===grid[3+i] && grid[3+i]===grid[6+i] && grid[6+i]!="") {
            win = true;
            io.emit('game status', turn);
        }
    }
    if (grid[0]===grid[4] && grid[4]===grid[8] && grid[8]!="") {
        win = true;
        io.emit('game status', turn);
    }
    if (grid[2]===grid[4] && grid[4]===grid[6] && grid[6]!="") {
        win = true;
        io.emit('game status', turn);
    }
    
    let keeprunning = false; 
    for (let i = 0; i < 9; i++) {
        if (grid[i] === "") {
            keeprunning = true; 
        }
    }
    if (!keeprunning) {
        io.emit('game status', 0);
        win = true; 
        
    } 
        // end of is game over
        turn = (turn === 1) ? 2 : 1;
    }
  });
    
});


server.listen(3000, () => {
    console.log('listening on *:3000');
});

