const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use(express.static("./www"));
app.use(express.json());

let RegisteredUsers = [];
let LoggedUsers = [];
const sensors = [{name : "Sensore", type : "Fumo", number : 35.5, id : 1}];

app.post("/api/register", (req, res) => {
    const { email, password } = req.body;

    if (RegisteredUsers.some(user => user.email === email)) {
        return res.status(400).json({ error: "Email utilizzata!" });
    }

    RegisteredUsers.push({ email, password });
    res.status(201).json({ message: "Registrazione effettuata!" });
});

app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    if (!RegisteredUsers.some(user => user.email === email)) {
        return res.status(401).json({ error: "Utente non registrato!" });
    } else if (RegisteredUsers.some(user => user.email === email) && !RegisteredUsers.some(user => user.password === password)) {
        return res.status(401).json({ error: "Password errata!" });
    }

    LoggedUsers.push({ email, password });
    res.status(200).json({ message: "Login effettuato!" });
});

io.on("connection", (socket) => {
    // Invia i sensori attuali quando un client si connette
    io.emit("sensors", sensors);

    socket.on("addSensor", (sensor) => {
        sensors.push(sensor); // Aggiunge il sensore all'array
        io.emit("sensors", sensors); // Invia l'array aggiornato a tutti i client
    });

    socket.on("removeSensor", (sensorId) => {
        // console.log("Received request to remove sensor ID:", sensorId);
        const index = sensors.findIndex(sensor => sensor.id === parseInt(sensorId)); // Converti ID a int per confronto
        if (index !== -1) {
            sensors.splice(index, 1); // Rimuove il sensore dall'array
            io.emit("sensors", sensors); // Invia l'array aggiornato a tutti i client
        } 
    });

    // socket.on("disconnect", () => {
        // console.log("A user disconnected");
    // });

    setInterval(() => {
        sensors.forEach(sensor =>{
            sensor.number = (Math.random() * 100).toFixed(2);
        });
        io.emit("sensors", sensors);
    }, 3000);
});

http.listen(8080);

// http.listen(8080, () => {
    // console.log("Server listening on port 8080");
// });
