const express = require('express');
const router = express.Router();

// Prendo i Messaggi per l'owner
router.get('/message-for-owner', (req, res) => {
    console.log(req.body);

})

// Aggiungo i messagi per l'owner
router.post('/message-for-owner', (req, res) => {

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

module.exports = router;
