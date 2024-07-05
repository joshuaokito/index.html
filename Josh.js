const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'reservations_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connecté à la base de données MySQL');
});

app.post('/save-reservation', (req, res) => {
    const { departure, destination, date, price } = req.body;
    const query = 'INSERT INTO reservations (departure, destination, date, price) VALUES (?, ?, ?, ?)';
    db.query(query, [departure, destination, date, price], (err, result) => {
        if (err) {
            console.error('Erreur d\'insertion:', err);
            res.status(500).send('Erreur de sauvegarde de réservation');
        } else {
            res.status(200).send('Réservation sauvegardée');
        }
    });
});

app.listen(3000, () => {
    console.log('Serveur en cours d\'exécution sur le port 3000');
});
