const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");

const reviewsFilePath = path.join(__dirname, "../data", "review.json");

// Prendo le recensioni del sito
router.get('/', (req, res) => {

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
router.post('/', (req, res) => {

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

module.exports = router;
