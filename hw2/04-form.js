const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 5001;

// http://localhost:5001/form should return a form with input elements for username, email, and submit button

// http://localhost:5001/submit should return all the data the user entered

const routes = [
    'form',
    'submit'
];

app.use(express.urlencoded({ extended: true }));

app.get('/form', (req, res) => {
    res.status(200).type('html').sendFile(path.join(__dirname, "form", 'index.html'));
});

app.post('/submit', (req, res) => {
    res.status(200).type('html').send(
        [
            '<p>Name: ' + `${req.body.name}` + '</p>',
            '<p>Email: ' + `${req.body.email}` + '</p>',
        ].join("")
    );
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});