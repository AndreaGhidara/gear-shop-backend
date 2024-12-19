const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");

const verifyToken = require('../middleware/VerifyToken');

const productsOnSaleFilePath = path.join(__dirname, "../data", "productsOnSale.json");


// Prodotti in saldo
router.get('/product-on-sale', (req, res) => {

    fs.readFile(productsOnSaleFilePath, "utf8", (err, data) => {

        let productsOnSale = []

        if (err && !data) {
            console.error("Error reading file:", err);
            return res.status(500).json({ error: "Errore DATI" });
        }

        productsOnSale = JSON.parse(data);

        if (!productsOnSale && productsOnSale.length <= 0) {
            console.log('vuoto');
            return res.status(500).json({ products: [] });
        }

        res.status(200).json({ data: productsOnSale });


    });

})

// Creazione prodotto 
router.post('/addProduct', verifyToken, (req, res) => {

    const newProductData = req.body

    fs.readFile(productsOnSaleFilePath, "utf8", (err, data) => {

        let products = []

        if (err && !data) {
            console.error("Error reading file:", err);
            return res.status(500).json({ error: "Errore DATI" });
        }

        products = JSON.parse(data);


        if (products && products.length > 0 && newProductData) {

            const newProduct = { id: products[products.length - 1].id + 1, ...newProductData };
            products.push(newProduct);
        }

        // Scrivo all' interno del file
        fs.writeFile(productsOnSaleFilePath, JSON.stringify(products, null, 2), (error) => {
            if (error) {
                console.error("Errore nella scrittura del file JSON:", error);
                return res.status(500).json({ error: "Errore nel salvataggio dei dati" });
            }

            res.status(200).json({ message: "Messaggio salvata con successo!" });
        });


    });

    console.log(req.body);

    // if (!newProduct.name) {
    //     errors.name = "Il nome è obbligatorio"
    // } else {
    //     errors.name = ""
    // }

    // if (!newProduct.description) {
    //     errors.description = "La descrizione è obbligatoria"
    // } else {
    //     errors.description = ""
    // }

    // if (!newProduct.price) {
    //     errors.price = "Il prezzo è obbligatorio"
    // } else if (isNaN(Number(newProduct.price))) {
    //     errors.price = "Il prezzo deve essere come indicato nell' esempio, non deve contenere lettere"
    // } else {
    //     errors.price = ""
    // }

    // if (newProduct.discount > 100 || newProduct.discount < 0) {
    //     errors.discount = "Lo sconto puo essere al massimo del 100%"
    // } else {
    //     errors.discount = ""
    // }
})

router.delete('/delate/:ID', verifyToken,  (req, res) => {

    // console.log(req.body);
    console.log(req.params.ID);

    const id = req.params.ID

    if (!id && isNaN(id)) {
        res.status(404).json({ message: "id non trovato" })
    }

    fs.readFile(productsOnSaleFilePath, "utf8", (err, data) => {

        let products = []

        if (err && !data) {
            console.error("Error reading file:", err);
            return res.status(500).json({ error: "Errore DATI" });
        }

        products = JSON.parse(data);

        if (products && products.length > 0) {
            console.log('prova');
            products = products.filter((product) => product.id.toString() !== id.toString());
        }

        // Scrivo all' interno del file
        fs.writeFile(productsOnSaleFilePath, JSON.stringify(products, null, 2), (error) => {
            if (error) {
                console.error("Errore nella scrittura del file JSON:", error);
                return res.status(500).json({ error: "Errore nel salvataggio dei dati" });
            }

            res.status(200).json({ message: "prodotto cancellato con successo!" });
        });
    });
})


router.put('/editProduct/:ID', verifyToken, (req, res) => {

    const idProduct = req.params.ID;
    const productData = req.body;

    if (!idProduct && !productData) {
        res.status(401).json({ message: "Mancano i dati!" })
    }

    fs.readFile(productsOnSaleFilePath, "utf8", (err, data) => {

        let products = []

        if (err && !data) {
            console.error("Error reading file:", err);
            return res.status(500).json({ error: "Errore DATI" });
        }

        products = JSON.parse(data);

        if (products && products.length > 0) {
            products = products.map((product) => product.id.toString() === idProduct.toString() ? productData : product);
        }

        // Scrivo all' interno del file
        fs.writeFile(productsOnSaleFilePath, JSON.stringify(products, null, 2), (error) => {
            if (error) {
                console.error("Errore nella scrittura del file JSON:", error);
                return res.status(500).json({ error: "Errore nel salvataggio dei dati" });
            }

            res.status(200).json({ message: "prodotto cancellato con successo!" });
        });
    });

    // console.log(idProduct);


})

module.exports = router;
