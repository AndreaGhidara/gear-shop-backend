const express = require('express')
const cors = require('cors');
var cookieParser = require('cookie-parser')
const path = require("path");

require('dotenv').config();

const app = express()
const port = 3000

const authRoutes = require('./routes/auth');
const productRoute = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const messageRoutes = require('./routes/messageRoutes');

// const messagesFilePath = path.join(__dirname, "data", "messages.json");
// const reviewsFilePath = path.join(__dirname, "data", "review.json");

app.use(express.json());
app.use(cookieParser())

// Configura il middleware CORS
app.use(cors({
    origin: 'http://localhost:5173', // Specifica l'origine consentita
    credentials: true, // Permette l'uso dei cookie
}));

app.use('/auth', authRoutes);
app.use('/products', productRoute);
app.use('/reviews', reviewRoutes);
app.use('/messages', messageRoutes);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

