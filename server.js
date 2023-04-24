var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
 
 
// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});
// connection configurations
var dbConn = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'web_db'
});
 
// connect to database
dbConn.connect(); 


// all users 
app.get('/fournisseurs', function (req, res) {
    dbConn.query('SELECT * FROM fournisseur', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'fournisseur list.' });
    });
});




// fournisseur with id 
app.get('/fournisseur/:id', function (req, res) {
 
    let fournisseur_id = req.params.id;
 
    if (! fournisseur_id) {
        return res.status(400).send({ error: true, message: 'Please provide fournisseur_id' });
    }
 
    dbConn.query('SELECT * FROM fournisseur where idFrns=?', fournisseur_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'fournisseur list by id' });
    });
 
});


// Add a new fournisseur
app.post('/add-fournisseur', function (req, res) {
 
    let fournisseur = [req.body];

    if (!fournisseur) {
        return res.status(400).send({ error:true, message: 'Please provide fournisseur' });
    }
 
    dbConn.query("INSERT INTO fournisseur SET ? ", fournisseur , function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New fournisseur has been created successfully.' });
    });
});


//  Update fournisseur with id
app.put('/update-fournisseur/:id', function (req, res) {
 
    let fournisseur_id = req.params.id;
    let fournisseur  = {
      "nomFrns": req.body.nomFrns , 
      "telFrns": req.body.telFrns  
    }
 
    if (!fournisseur_id || !fournisseur) {
        return res.send({ error: fournisseur, message: 'Please provide fournisseur and fournisseur_id' });
    }
 
    dbConn.query("UPDATE fournisseur SET nomFrns = ? , telFrns = ? WHERE idFrns = ?", [fournisseur.nomFrns , fournisseur.telFrns , fournisseur_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'fournisseur has been updated successfully.' });
    });
});


//  Delete Fourniseur
app.delete('/delete-fournisseur/:id', function (req, res) {
 
    let fournisseur_id = req.params.id;
 
    if (!fournisseur_id) {
        return res.status(400).send({ error: true, message: 'Please provide fournisseur_id' });
    }
    dbConn.query('DELETE FROM fournisseur  WHERE idFrns = ?', [fournisseur_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Fournisseur has been updated successfully.' });
    });
}); 


// set port
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
module.exports = app;