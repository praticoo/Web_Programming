const terminal = document.querySelector(".terminal");
const header = document.querySelector(".header");
const exitButton = document.querySelector(".bar__button--exit");
const maxButton = document.querySelector(".bar__button--maximize");
const hideButton = document.querySelector(".bar__button--hide");
const outputDiv = document.querySelector('.output');
const promptText = document.querySelector('.prompt-text');

dragElement(header);

//mousedown : quando un utente preme un pulsante del mouse mentre si trova sopra un elemento
//mouseup : quando un utente rilascia un tasto del mouse

function dragElement(elem) {
    //utilizzate per memorizzare le coordinate del mouse e calcolare lo spostamento
    let pos1, pos2, pos3, pos4 = 0;
    //pos3 e pos4 memorizzo le coordinate iniziali del mouse quando viene cliccato

    elem.onmousedown = dragMouseDown;

    // eseguita quando si preme il pulsante del mouse sull'elemento
    function dragMouseDown(event) {
        //.preventDefault() : impedisce che il browser esegue azioni predefinite 
        //che potrebbe interferire con la funzionalità di trascinamento, come la selezione del testo
        event.preventDefault();
        pos3 = event.clientX;
        pos4 = event.clientY;
        
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    //eseguita ogni volta che il mouse si muove mentre il pulsante è premuto
    function elementDrag(event) {
        event.preventDefault();
        //pos2 e pos1 memorizzo la differenza tra la posizione precedente e la posizione del mouse 
        pos1 = pos3 - event.clientX;
        pos2 = pos4 - event.clientY;
        pos3 = event.clientX;
        pos4 = event.clientY;
        terminal.style.top = (terminal.offsetTop - pos2) + "px";
        terminal.style.left = (terminal.offsetLeft - pos1) + "px";
    }

    //eseguita quando il pulsante del mouse viene rilasciato
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

promptText.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault(); //evita di andare a capo
        let output = "";
        const command = this.innerText;
        if (command.trim() === 'date') {
            let currentDate = new Date();
            let date = currentDate.toDateString();
            let time = currentDate.toLocaleTimeString();
            output = 'date<br>' + date + ' ' + time;
        } else if (command.trim() === 'clear') {
            outputDiv.innerText = "";
            //inserisco spazio vuoto successivamente per non creare una riga vuota
            this.innerHTML = '&nbsp;'
            return;
        } else if (command.startsWith('echo') && !(command.trim() === 'echo')) {
            output = command.substring(6, command.length - 2);
        } else if (command.trim() === 'echo') {
            output = 'echo';
        }
        else if (command.trim() === '') {
            output = '';
        } else if (command.trim() == 'help') {
            output = 'elenco comandi' + '<br>' +
                'help : stampa elenco comandi' + '<br>' + "echo 'stringa' : stampa testo" + '<br>' +
                'date : stampa data e ora attuali' + '<br>' + "clear : cancella output visualizzato<br> random min max : genera un valore casuale compreso tra min e max<br> cat : stampa contenuto file<br> ls : elenca file presenti<br> fetch : stampa ingredienti cocktail casuale<br> fetch name : stampa ingredienti cocktail scelto dall'utente<br> palindrome stringa : verifica stringa palindroma";
        }
        else if (command.startsWith("fetch")) {
            const cocktailName = command.substring(6).trim(); // Estrai il nome del cocktail dalla stringa di comando
            if (cocktailName) {
                // Chiamata alla funzione per ottenere gli ingredienti del cocktail richiesto
                getCocktailIngredients(cocktailName);
            } else {
                // Se non viene specificato il nome del cocktail, ottenere un cocktail casuale
                getRandomCocktail();
            }
        } else if (command.startsWith("random")) {
            const args = command.split(" ").slice(1); // Estrai gli argomenti dal comando
            if (args.length !== 2) {
                output = "Usage: random min max";
            } else {
                const min = parseInt(args[0]);
                const max = parseInt(args[1]);

                if (isNaN(min) || isNaN(max)) {
                    output = "Error: Both min and max must be valid numbers.";
                } else {
                    output = 'random ' + min + '&nbsp;' + max + '<br>' + (Math.floor(Math.random() * (max - min + 1)) + min);
                }
            }
        } else if (command.trim() === 'ls') {
            output = 'ls <br> file.txt <br> prova.cpp <br> appunti.txt';
        } else if (command.trim() === 'cat file.txt') {
            output = "cat file.txt<br>Lorem ipsum dolor sit amet, consectetur adipiscing elit.Duis accumsan ullamcorper tempus. Fusce porttitor rhoncus diam, at vestibulum justo maximus eu. Curabitur at lorem vel erat tempus aliquam aliquam non quam. Praesent sollicitudin, lectus vitae rhoncus efficitur, magna tortor tincidunt nisi, non finibus ante quam eget eros. Sed ligula sapien, malesuada quis urna a, pharetra consectetur urna. Pellentesque a pharetra mauris, non iaculis ipsum. Sed consectetur turpis sit amet sodales scelerisque. Aenean sit amet lectus non elit consectetur mollis sed nec dui. Aliquam sodales, velit vitae pharetra varius, mi tortor commodo mauris, sed dictum tortor tellus sit amet lectus. Fusce volutpat bibendum est sed suscipit.";
        } else if (command.trim() === 'cat prova.cpp') {
            output = 'cat prova.cpp<br>#include &lt;iostream&gt;<br>using namespace std;<br><br>int main() {<br>cout << "Hello World" << endl;<br> }';
        } else if (command.trim() === 'cat appunti.txt') {
            output = 'cat appunti.txt<br>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere';
        } else if (command.startsWith("palindrome")) {
            const parola = command;
            //split divido la stringa in un array di sottostringhe, inserisco " " per non considerare spazi  
            //slice estrae elementi dall'array cominciando dal secondo elemento 
            //join concatena le sottostringhe
            const args = command.split(" ").slice(1).join("").toLowerCase();
            //[^a-z0-9]: Questo è un set di caratteri negato. Significa "qualsiasi carattere che non è una lettera minuscola da a a z o un numero da 0 a 9".
            //g: è un flag che indica di eseguire la sostituzione in tutta la stringa anziché fermarsi alla prima occorrenza.
            const cleaned = args.replace(/[^a-z0-9]/g, '');
            const reversed = cleaned.split("").reverse().join("");
            const risultato = cleaned === reversed ? "true" : "false";
            output = parola + ' : ' + risultato;
        }
        else {
            output = command + " : " + "command not found ! :(";
        }
        if (command.trim() !== 'clear' && !(command.startsWith("fetch"))) {
            output = '<span>patri@MSI:~$</span>' + '&nbsp;' + output;
            outputDiv.innerHTML += output + '<br>';
        }
        //per svuotare nel caso di nuovo input
        this.innerHTML = '&nbsp;'
    }
});

function getRandomCocktail() {
    // Effettua la richiesta per ottenere un cocktail casuale
    fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
        //JSON : è un formato comune per lo scambio di dati tra client e server
        .then(response => response.json())
        .then(data => {
            // Estrai il nome del cocktail casuale dalla risposta JSON
            //in strDrink nel db è contenuto il nome del cocktail 
            const cocktailName = data.drinks[0].strDrink;

            // Estrai gli ingredienti del cocktail casuale
            getCocktailIngredients(cocktailName);
        })
        .catch(error => {
            outputDiv.innerHTML += '<span>patri@MSI:~$</span> ' + 'Errore durante la richiesta di un cocktail casuale: ' + error + '<br>';
        });
}

function getCocktailIngredients(cocktailName) {
    // Costruisci l'URL della richiesta in base al nome del cocktail
    const url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + cocktailName;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const cocktail = data.drinks ? data.drinks[0] : null; // Verifica se il cocktail richiesto è stato trovato
            if (cocktail) {
                //array per contenere gli ingredienti 
                const ingredients = [];
                //scorro fino a <= 15 perchè nel db ci sono massimo 15 ingredienti 
                for (let i = 1; i <= 15; i++) {
                    const ingredient = cocktail['strIngredient' + i];
                    if (ingredient) {
                        ingredients.push(ingredient);
                    } else {
                        break; // Interrompo il ciclo se non ci sono più ingredienti
                    }
                }
                outputDiv.innerHTML += '<span>patri@MSI:~$</span> ' + 'Ingredienti del cocktail ' + cocktailName + ' : ' + ingredients + '<br>';
            } else {
                outputDiv.innerHTML += '<span>patri@MSI:~$</span> ' + 'Nessun cocktail trovato con il nome: ' + cocktailName + '<br>';
            }
        })
        .catch(error => {
            outputDiv.innerHTML += '<span>patri@MSI:~$</span> ' + 'Errore durante la richiesta degli ingredienti del cocktail: ' + error + '<br>';
        });
}

exitButton.addEventListener("click", () => {
    terminal.remove();
});

hideButton.addEventListener("click", () => {
    terminal.style.setProperty("display", "none");
});

maxButton.addEventListener("click", () => {
    //se diverso dalle misure massime raggiungibili mi conservo i valori 
    if (terminal.style.width != window.innerWidth + "px" || terminal.style.height != window.innerHeight + "px") {
        wprec = terminal.style.width;
        hprec = terminal.style.height;
    }
    //se entrambi o uno dei valore è minore o maggiore del valore massimo massimizzo il terminale
    if (terminal.style.width < window.innerWidth + "px" || terminal.style.height < window.innerHeight + "px" ||
        terminal.style.width > window.innerWidth + "px" || terminal.style.height > window.innerHeight + "px") {
        terminal.style.width = window.innerWidth + "px";
        terminal.style.height = window.innerHeight + "px";
    } else { //senno lo riporto alla lunghezza e altezza precedente
        terminal.style.width = wprec;
        terminal.style.height = hprec;
    }
});

const icon = document.querySelector(".icon > img");
icon.addEventListener("dblclick", scelta);
let count = 1;

//rendere visibile il terminale originale o crearne uno nuovo 
function scelta() {
    if (count == 1) {
        terminal.style.setProperty("display", "block");
        promptText.focus();

        icon.addEventListener("contextmenu", function (event) {
            event.preventDefault();
            mostra();
        });

        function mostra() {
            terminal.style.setProperty("display", "block");
            promptText.focus();
        }
        count++; //incremento il count solo dopo aver mostrato il primo terminale
    } else {
        createTerminal();
    }
}

terminal.addEventListener("click", () => {
    terminal.style.zIndex = count;
    count++;
});

function createTerminal() {
    let terminale = document.createElement("div");
    terminale.classList.add("terminal", "resizable");
    terminale.style.setProperty("display", "block");

    let head = document.createElement("div");
    head.classList.add("header");

    let bar_buttons = document.createElement("div");
    bar_buttons.classList.add("bar__buttons");

    let esci = document.createElement("button");
    esci.classList.add("bar__button", "bar__button--exit");
    esci.innerHTML = "&#10005;";
    esci.style.marginRight = "7px";

    let nascondi = document.createElement("button");
    nascondi.classList.add("bar__button", "bar__button--hide");
    nascondi.innerHTML = "&#9472;";
    nascondi.style.marginRight = "7px";

    let massimo = document.createElement("button");
    massimo.classList.add("bar__button", "bar__button--maximize");
    massimo.innerHTML = "&#9723;"
    massimo.style.marginRight = "7px";

    let bar_utente = document.createElement("div");
    bar_utente.classList.add("bar__user");
    bar_utente.innerHTML = "patri@MSI: ~";

    let risultato = document.createElement("div");
    risultato.classList.add("output");

    let rigaComandi = document.createElement("div");
    rigaComandi.classList.add("prompt-text");
    rigaComandi.contentEditable = "true";
    rigaComandi.innerHTML = "&nbsp;";
    rigaComandi.setAttribute("autofocus", true);
    rigaComandi.setAttribute("spellcheck", false);

    //ritardare l'impostazione del focus dopo aver creato e aggiunto il nuovo terminale al documento
    setTimeout(function () {
        rigaComandi.focus();
    }, 100); //100 millisecondi 

    bar_buttons.appendChild(esci);
    bar_buttons.appendChild(nascondi);
    bar_buttons.appendChild(massimo);

    esci.addEventListener("click", () => {
        terminale.remove();
    });

    head.appendChild(bar_buttons);
    head.appendChild(bar_utente);

    terminale.appendChild(head);
    terminale.appendChild(risultato);
    terminale.appendChild(rigaComandi);

    document.body.appendChild(terminale);

    dragElement(head);

    terminale.style.zIndex = count;
    count++;

    function dragElement(elem) {
        let pos1, pos2, pos3, pos4 = 0;

        elem.onmousedown = dragMouseDown;

        function dragMouseDown(event) {
            event.preventDefault();
            pos3 = event.clientX;
            pos4 = event.clientY;

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(event) {
            event.preventDefault();
            pos1 = pos3 - event.clientX;
            pos2 = pos4 - event.clientY;
            pos3 = event.clientX;
            pos4 = event.clientY;
            terminale.style.top = (terminale.offsetTop - pos2) + "px";
            terminale.style.left = (terminale.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    terminale.addEventListener("click", () => {
        terminale.style.zIndex = count;
        count++;
    });

    rigaComandi.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            let output = "";
            const command = this.innerText;
            if (command.trim() === 'date') {
                let currentDate = new Date();
                let date = currentDate.toDateString();
                let time = currentDate.toLocaleTimeString();
                output = 'date<br>' + date + ' ' + time;
            } else if (command.trim() === 'clear') {
                risultato.innerText = "";
                this.innerHTML = '&nbsp;'
                return;
            } else if (command.startsWith('echo') && !(command.trim() === 'echo')) {
                output = command.substring(6, command.length - 2);
            } else if (command.trim() === 'echo') {
                output = 'echo';
            } else if (command.trim() == 'help') {
                output = 'elenco comandi' + '<br>' +
                    'help : stampa elenco comandi' + '<br>' + "echo 'stringa' : stampa testo" + '<br>' +
                    'date : stampa data e ora attuali' + '<br>' + "clear : cancella output visualizzato<br> random min max : genera un valore casuale compreso tra min e max<br> cat : stampa contenuto file<br> ls : elenca file presenti<br> fetch : stampa ingredienti cocktail casuale<br> fetch name : stampa ingredienti cocktail scelto dall'utente<br> palindrome stringa : verifica stringa palindroma";
            } else if (command.trim() === '') {
                output = '';
            } else if (command.startsWith("fetch")) {
                const cocktailName = command.substring(6).trim();
                if (cocktailName) {
                    getCocktailIngredients(cocktailName);
                } else {
                    getRandomCocktail();
                }
            } else if (command.startsWith("random")) {
                const args = command.split(" ").slice(1);
                if (args.length !== 2) {
                    output = "Usage: random min max";
                } else {
                    const min = parseInt(args[0]);
                    const max = parseInt(args[1]);

                    if (isNaN(min) || isNaN(max)) {
                        output = "Error: Both min and max must be valid numbers.";
                    } else {
                        output = 'random ' + min + '&nbsp;' + max + '<br>' + (Math.floor(Math.random() * (max - min + 1)) + min);
                    }
                }
            } else if (command.trim() === 'ls') {
                output = 'ls <br> file.txt <br> prova.cpp <br> appunti.txt';
            } else if (command.trim() === 'cat file.txt') {
                output = "cat file.txt<br>Lorem ipsum dolor sit amet, consectetur adipiscing elit.Duis accumsan ullamcorper tempus. Fusce porttitor rhoncus diam, at vestibulum justo maximus eu. Curabitur at lorem vel erat tempus aliquam aliquam non quam. Praesent sollicitudin, lectus vitae rhoncus efficitur, magna tortor tincidunt nisi, non finibus ante quam eget eros. Sed ligula sapien, malesuada quis urna a, pharetra consectetur urna. Pellentesque a pharetra mauris, non iaculis ipsum. Sed consectetur turpis sit amet sodales scelerisque. Aenean sit amet lectus non elit consectetur mollis sed nec dui. Aliquam sodales, velit vitae pharetra varius, mi tortor commodo mauris, sed dictum tortor tellus sit amet lectus. Fusce volutpat bibendum est sed suscipit.";
            } else if (command.trim() === 'cat prova.cpp') {
                output = 'cat prova.cpp<br>#include &lt;iostream&gt;<br>using namespace std;<br><br>int main() {<br>cout << "Hello World" << endl;<br> }';
            } else if (command.trim() === 'cat appunti.txt') {
                output = 'cat appunti.txt<br>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere';
            } else if (command.startsWith("palindrome")) {
                const parola = command;
                const args = command.split(" ").slice(1).join("").toLowerCase();
                const cleaned = args.replace(/[^a-z0-9]/g, '');
                const reversed = cleaned.split("").reverse().join("");
                const risultato = cleaned === reversed ? "true" : "false";
                output = parola + ' : ' + risultato;
            } else {
                output = command + " : " + "command not found ! :(";
            }
            if (command.trim() !== 'clear' && !(command.startsWith('fetch'))) {
                output = '<span>patri@MSI:~$</span>' + '&nbsp;' + output;
                risultato.innerHTML += output + '<br>';
            }
            this.innerHTML = "&nbsp;";
        }
    });

    function getCocktailIngredients(cocktailName) {
        const url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + cocktailName;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const cocktail = data.drinks ? data.drinks[0] : null;
                if (cocktail) {
                    const ingredients = [];
                    for (let i = 1; i <= 15; i++) {
                        const ingredient = cocktail['strIngredient' + i];
                        if (ingredient) {
                            ingredients.push(ingredient);
                        } else {
                            break;
                        }
                    }
                    risultato.innerHTML += '<span>patri@MSI:~$</span> ' + 'Ingredienti del cocktail ' + cocktailName + ' : ' + ingredients + '<br>';
                } else {
                    risultato.innerHTML += '<span>patri@MSI:~$</span> ' + 'Nessun cocktail trovato con il nome: ' + cocktailName + '<br>';
                }
            })
            .catch(error => {
                risultato.innerHTML += '<span>patri@MSI:~$</span> ' + 'Errore durante la richiesta degli ingredienti del cocktail: ' + error + '<br>';
            });
    }

    function getRandomCocktail() {
        fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
            .then(response => response.json())
            .then(data => {
                const cocktailName = data.drinks[0].strDrink;
                getCocktailIngredients(cocktailName);
            })
            .catch(error => {
                risultato.innerHTML += '<span>patri@MSI:~$</span> ' + 'Errore durante la richiesta di un cocktail casuale: ' + error + '<br>';
            });
    }


    nascondi.addEventListener("click", () => {
        terminale.style.setProperty("display", "none");
    });


    icon.addEventListener("contextmenu", function (event) {
        event.preventDefault();
        mostra();
    });

    function mostra() {
        terminale.style.setProperty("display", "block");
        setTimeout(function () {
            rigaComandi.focus();
        }, 100);
    }

    massimo.addEventListener("click", () => {
        if (terminale.style.width != window.innerWidth + "px" || terminale.style.height != window.innerHeight + "px") {
            wprec = terminale.style.width;
            hprec = terminale.style.height;
        }
        if (terminale.style.width < window.innerWidth + "px" || terminale.style.height < window.innerHeight + "px" ||
            terminale.style.width > window.innerWidth + "px" || terminale.style.height > window.innerHeight + "px") {
            terminale.style.width = window.innerWidth + "px";
            terminale.style.height = window.innerHeight + "px";
        } else {
            terminale.style.width = wprec;
            terminale.style.height = hprec;
        }
    });

}