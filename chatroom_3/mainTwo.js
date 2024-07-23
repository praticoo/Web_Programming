const express = require("express");
const app = express();

const http = require("http").Server(app);
const io = require("socket.io")(http);

let Users = [];

app.use(express.static("./www"));

io.on("connection", (socket) => {
    socket.on("newuser", (username, callback) => {
        if (Users.some(user => user.username === username)) {
            callback('Username is already taken');
            return;
        }
        Users.push({ id: socket.id, username });
        io.emit("newuser", username);
        callback(null);
    });

    socket.on("exituser", (username) => {
        Users = Users.filter(user => user.id !== socket.id);
        io.emit("exituser", username);
    });

    socket.on("disconnect", () => {
        const user = Users.find(user => user.id === socket.id);
        if (user) {
            Users = Users.filter(u => u.id !== socket.id);
            io.emit("exituser", user.username);
        }
    });

    socket.on("chat", (message) => {
        socket.broadcast.emit("chat", message);
    });
});

http.listen(8080);
