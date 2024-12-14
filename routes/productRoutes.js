const express = require('express');
const router = express.Router();
const productOnSale = require('../data/ProductsOnSale.json')

// Prodotti in saldo
router.get('/product-on-sale', (req, res) => {

    res.json({ data: productOnSale })

})


module.exports = router;
