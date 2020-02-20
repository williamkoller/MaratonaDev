const express = require('express');
const server = express();
const morgan = require('morgan');
const Pool = require('pg').Pool;

const db = new Pool({
    user: 'william',
    password: 'wk12',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

server.use(express.static('../frontend/public'));
server.use(express.urlencoded({ extended: true }));

const nunjucks = require('nunjucks');
nunjucks.configure('../frontend', {
    express: server,
    noCache: true
});

server.use(morgan('dev'));
server.get('/', function(req, res) {
    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return res.send("erro no banco de dados")
        const donors = result.rows;
        return res.render('index.html', { donors });

    })
});
server.post('/', function(req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios");
    }

    const query = `
    INSERT INTO donors ("name", "email", "blood") 
    VALUES ($1, $2, $3) 
    `
    const values = [name, email, blood];

    db.query(query, values,
        function(err) {
            if (err) return res.send("erro no banco de dados")
            return res.redirect('/')
        });

});

server.listen(3000, function() {
    console.log('Init Server');
});