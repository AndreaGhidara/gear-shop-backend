const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Percorso del file JSON
const reviewsFilePath = path.join(__dirname, "reviews.json");

// Middleware per parsare il body delle richieste
app.use(express.json());

// Endpoint per ottenere tutte le recensioni
app.get("/reviews", (req, res) => {
    if (!fs.existsSync(reviewsFilePath)) {
        return res.json([]); // Se il file non esiste, ritorna un array vuoto
    }

    const reviews = JSON.parse(fs.readFileSync(reviewsFilePath, "utf-8"));
    res.json(reviews);
});

// Endpoint per aggiungere una nuova recensione
app.post("/reviews", (req, res) => {
    const newReview = req.body;

    // Leggi le recensioni esistenti o inizializza con un array vuoto
    let reviews = [];
    if (fs.existsSync(reviewsFilePath)) {
        reviews = JSON.parse(fs.readFileSync(reviewsFilePath, "utf-8"));
    }

    // Aggiungi la nuova recensione
    reviews.push(newReview);

    // Scrivi il file aggiornato
    fs.writeFileSync(reviewsFilePath, JSON.stringify(reviews, null, 2));

    res.status(201).json({ message: "Recensione aggiunta con successo!" });
});

// Avvia il server
app.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});
