const socket = io();
const app = document.querySelector(".container");

app.querySelector("#form-input").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = app.querySelector("#input-email").value;
    const password = app.querySelector("#input-password").value;

    if (email.length === 0 || password.length === 0) {
        return;
    }

    try {
        const response = await axios.post("/api/login", { email, password });
        if (response.status === 200) {
            alert(response.data.message);
            app.querySelector(".join-screen").classList.add("noActive");
            app.querySelector(".shop-screen").classList.remove("noActive");
        } else {
            alert(response.data.error);
        }
    } catch (err) {
        alert(err.response.data.error);
    }
});

app.querySelector("#toRegister").addEventListener("click", () => {
    app.querySelector(".join-screen").classList.add("noActive");
    app.querySelector(".register-screen").classList.remove("noActive");
});

app.querySelector("#toLogin").addEventListener("click", () => {
    app.querySelector(".join-screen").classList.remove("noActive");
    app.querySelector(".register-screen").classList.add("noActive");
});

app.querySelector("#form-register").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = app.querySelector("#reg-email").value;
    const password = app.querySelector("#reg-password").value;

    if (email.length === 0 || password.length === 0) {
        return;
    }

    try {
        const response = await axios.post("/api/register", { email, password });
        if (response.status === 201) {
            alert(response.data.message);
        } else {
            alert(response.data.error);
        }
    } catch (err) {
        alert(err.response.data.error);
    }
});

app.querySelector("#form-sensore").addEventListener("submit", (e) => {
    e.preventDefault();

    const sensor = {
        name: app.querySelector("#nome").value,
        type: app.querySelector("#tipo").value,
        number: app.querySelector("#numero").value,
        id: Date.now() // Genera un ID unico per ogni sensore
    };

    socket.emit("addSensor", sensor);

    // app.querySelector("#form-sensore").reset();
});

// Event Listener per la rimozione dei sensori
app.querySelector("#sensors-container").addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-sensor")) {
        const sensorId = e.target.dataset.id;
        socket.emit("removeSensor", sensorId);
    }
});

// Gestione dei sensori ricevuti dal server
socket.on("sensors", (sensors) => {
    const sensorsContainer = app.querySelector("#sensors-container");
    sensorsContainer.innerHTML = ""; // Pulisce il contenitore esistente

    sensors.forEach(sensor => {
        const el = document.createElement("div");
        el.setAttribute("class", "sensor");
        el.innerHTML = `
            <div class="name">${sensor.name}</div>
            <div class="type">${sensor.type}</div>
            <div class="time">${sensor.number} ms</div>
            <button class="remove-sensor" data-id="${sensor.id}">x</button>
        `;
        sensorsContainer.appendChild(el);
    });
});
