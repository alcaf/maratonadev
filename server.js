/* Configurarando o servidor */
const express = require("express");
const server =  express();

/* Configurar servidor para apresentar arquivos estáticos */
server.use(express.static('public'));

/* Habilitar body do formulário */
server.use(express.urlencoded({ extended: true }))

/* Configurarando a conexão com o banco de dados */
const Pool = require('pg').Pool
const db = new Pool({
    user: "postgres",
    password: "123",
    host: "localhost",
    port: 5432,
    database: 'doe'
})

/* Configurarando a Template Engine */
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

/* Lista de doadores: Array*/
/*
const donors = [
    {
        name: "Diego Fernandes",
        blood: "AB+"
    },
    {
        name: "Cleiton Souza",
        blood: "B+"
    },
    {
        name: "Rpbson Marques",
        blood: "O+"
    },
    {
        name: "Mayk Brito",
        blood: "A-"
    },
]
*/
/* Configurar a apresentação da página */
server.get("/", function(req, res) {
    
    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return res.send("Erro de banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })
    
});

server.post("/", function(req, res) {
    /* Pegar dados do formulário */
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "") {
        return res.send("Campo nome obrigatório.")
    }

    if (email == "") {
        return res.send("Campo e-mail obrigatório.")
    }

    if (blood == "") {
        return res.send("Campo Tipo Sanguíneo obrigatório")
    }

    /* Adicionar valores no Banco de Dados */
    const query = `INSERT INTO donors ("name", "email", "blood") 
                   VALUES ($1, $2, $3)`
    
    const values = [name, email, blood]

    db.query(query, values, function(err) {
        if (err) return res.send("Erro no banco de dados.")

        return res.redirect("/")
    })

    /* Adicionar valores no Array */
    /*
    donors.push({
        name: name,
        blood: blood,
    })
    */
    
})

/* Ligar o servidor e permitir o acesso na porta 3000 */
server.listen(3000, function() {
    console.log("Iniciei o servidor");
});