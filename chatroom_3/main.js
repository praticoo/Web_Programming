
const express = require("express");
const app = express();

const http = require("http").Server(app);
const serverIO = require("socket.io")(http);

let Users = [];          //array di utenti 

app.get("/api/users", (req, resp) => {
    resp.json(Users);
});

app.use(express.static("./www"));

serverIO.on("connection", (socket) => {
    socket.on("newuser", (username, callback) => {
        if (Users.some(user => user.username === username)) {
            callback("Username utilizzato!");
            return;
        }
        Users.push({id: socket.id, username});
        socket.broadcast.emit("newuser", username + " joined the chat");
        socket.broadcast.emit("updateUsers", Users);
        callback(null);
    });

    socket.on("exituser", (username) =>{
        Users = Users.filter(user => user.id !== socket.id);
        socket.broadcast.emit("exituser", username + " left the chat");
        socket.broadcast.emit("updateUsers", Users);
    });

    socket.on("disconnect", () => {
        let user = Users.find(user => user.id === socket.id);
        if (user) {
           Users = Users.filter(user => user.id !== socket.id); 
           socket.broadcast.emit("exituser", user.username + " left the chat");
           socket.broadcast.emit("updateUsers", Users);
        }
    });

    socket.on("chat", (message) => {
        socket.broadcast.emit("chat", message)
    });
});

http.listen(8080);



