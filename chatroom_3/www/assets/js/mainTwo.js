const socket = io();
const app = document.querySelector(".container");

let uname;

app.querySelector("#login").addEventListener("click", () => {
    let username = app.querySelector("#input-name").value;

    if (username.length == 0) {
        return;
    }

    socket.emit("newuser", username, (error) => {
        if (error) {
            alert(error); // Mostra l'errore all'utente
        } else {
            uname = username;
            app.querySelector(".join-screen").classList.add("noActive");
            app.querySelector(".chat-screen").classList.remove("noActive");
        }
    });
});


app.querySelector("#exit-user").addEventListener("click", () => {
    socket.emit("exituser", uname);
    window.location.href = window.location.href;
});

app.querySelector(".send-message").addEventListener("click", () => {
    let message = app.querySelector("#input-text").value;

    if (message.length == 0) {
        return;
    }

    renderMessage("my", {
        username: uname,
        text: message
    });

    socket.emit("chat", {
        username: uname,
        text: message
    });

    app.querySelector("#input-text").value = "";
});

function renderMessage(type, message) {
    let messageContainer = app.querySelector(".messages");
    let date = new Date();

    if (type === "my") {
        let el = document.createElement("div");
        el.setAttribute("class", "message my-message");
        el.innerHTML = `<div><div style='text-align: end;' class='name'>You</div><div style='text-align: end;' class='text'>${message.text}</div><div style='text-align: end;' class='hour'>${date.getHours()}:${date.getMinutes()}</div></div>`;
        messageContainer.appendChild(el);
    } else if (type === "other") {
        let el = document.createElement("div");
        el.setAttribute("class", "message other-message");
        el.innerHTML = `<div><div class='name'>${message.username}</div><div class='text'>${message.text}</div><div class='hour'>${date.getHours()}:${date.getMinutes()}</div></div>`;
        messageContainer.appendChild(el);
    } else if (type === "update") {
        let el = document.createElement("div");
        el.setAttribute("class", "message update");
        el.innerHTML = message;
        messageContainer.appendChild(el);
    }

    messageContainer.scrollTop = messageContainer.scrollHeight;
}

socket.on("newuser", (username) => {
    renderMessage("update", `${username} joined the chat`);
});

socket.on("exituser", (username) => {
    renderMessage("update", `${username} left the chat`);
});

socket.on("chat", (message) => {
    renderMessage("other", message);
});
