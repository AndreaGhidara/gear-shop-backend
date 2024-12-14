const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const productOnSale = require('./data/ProductsOnSale.json')
const reviewSite = require('./data/review.json')

const app = express();
const port = 3000;

const messagesFilePath = path.join(__dirname, "data", "messages.json");
const reviewsFilePath = path.join(__dirname, "data", "review.json");


app.use(cors());
app.use(express.json());

// Middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // Origine consentita
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Header consentiti
    next();
});

// Aggiungo i messagi per l'owner
app.post('/message-for-owner', (req, res) => {

    const newMessage = req.body

    if (!newMessage) {
        res.status(400).json({ error: "non è stato ricevuto nessun messaggio" })
    }

    // Leggi il file JSON esistente o creane uno nuovo
    fs.readFile(messagesFilePath, "utf8", (err, data) => {
        let messages = [];

        if (!err && data) {
            try {
                messages = JSON.parse(data); // Prova a parsare il contenuto del file
            } catch (parseError) {
                console.error("Errore di parsing del file JSON:", parseError);
                return res.status(500).json({ error: "Errore di parsing del file JSON" });
            }
        }

        // Aggiungi la nuova recensione
        messages.push(newMessage);

        // Scrivi l'array aggiornato nel file
        fs.writeFile(messagesFilePath, JSON.stringify(messages, null, 2), (writeError) => {
            if (writeError) {
                console.error("Errore nella scrittura del file JSON:", writeError);
                return res.status(500).json({ error: "Errore nel salvataggio del messaggio" });
            }

            res.status(200).json({ message: "Messaggio salvata con successo!" });
        });
    });
})

// Prodotti in saldo
app.get('/product-on-sale', (req, res) => {
    res.send({ data: productOnSale })
})

// Prendo i Messaggi per l'owner
app.get('/message-for-owner', (req, res) => {
    console.log(req.body);

})


// Prendo le recensioni del sito
app.get('/review-for-site', (req, res) => {

    fs.readFile(reviewsFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Errore nella lettura del file JSON:", err);
            return res.status(500).json({ error: "Errore nella lettura delle recensioni" });
        }

        let reviews = [];
        try {
            reviews = JSON.parse(data); // Parsiamo il contenuto del file
        } catch (parseError) {
            console.error("Errore di parsing del file JSON:", parseError);
            return res.status(500).json({ error: "Errore di parsing del file JSON" });
        }

        res.status(200).json({ data: reviews });
    });
})

// Carico le recensioni del sito
app.post('/review-for-site', (req, res) => {

    const newReview = req.body;

    if (!newReview || !newReview.rating) {
        return res.status(400).json({ error: "La recensione deve contenere almeno un rating" });
    }

    fs.readFile(reviewsFilePath, "utf8", (err, data) => {
        let reviews = [];

        if (!err && data) {
            try {
                reviews = JSON.parse(data); // Prova a parsare il contenuto del file
            } catch (parseError) {
                console.error("Errore di parsing del file JSON:", parseError);
            }
        }

        // Aggiungi la nuova recensione
        reviews.push(newReview);

        // Scrivi l'array aggiornato nel file
        fs.writeFile(reviewsFilePath, JSON.stringify(reviews, null, 2), (writeError) => {
            if (writeError) {
                console.error("Errore nella scrittura del file JSON:", writeError);
                return res.status(500).json({ error: "Errore nel salvataggio della recensione" });
            }

            console.log("Recensione salvata con successo!");
            res.status(200).json({ message: "Recensione salvata con successo!" });
        });
    });

})

// app.get('/', (req, res) => {
//     res.send({ data: productOnSale })
// })

// Avvia il server
app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});
