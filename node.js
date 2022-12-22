/*
Obsługa Api

*Nie uruchamiać strony html w przeglądarce Microsoft edge, nie wszystkie mechanizmy na stronie będą działać poprawnie
*Na stronie znajduje się jedynie mechanizm dodawania wierszy do bazy danych
*Aby dodać wiersz należy podać do inputów następujące: kraj nr 1, kraj nr 2, strzelone bramki kraju nr 1, strzelone bramki kraju nr 2, data wydarzenia
*Aby wyświetlić wszystkie mecze należy wykorzystać curla oraz polecenia curl "http://localhost:8081/all", json z wszystkimi meczami zostanie wyświetlony w kosloli na której jest uruchomiony node wraz z meta danymi jsona
*Aby wyświetlić mecze wybranego kraju należy wykorzystać curla oraz polecenia curl "http://localhost:8081/:kraj", json z wszystkimi meczami zostanie wyświetlony w kosloli na której jest uruchomiony node wraz z meta danymi jsona
*Aby uruchomić stronę html należy użyć kodu url "http://localhost:8081/"
*/
var express = require('express');
const path = require('path');
var app = express();
const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: 'localhost', 
     user:'root', 
     password: 'root',
     database: 'fifa'
});

const router = express.Router(); 

router.get('/', function(req, res) { 
    res.sendFile(path.join(__dirname + '/index.html')); 
});

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/all',function(req,res){
  pool.getConnection()
    .then(conn => {
    let por;
      conn.query("SELECT * from mecze ")
        .then((res) => {
          console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
          por = res;
          conn.end();
        })
        .catch(err => {
          //handle error
          console.log(err); 
          conn.end();
        })
        
    })
    })


    app.post('/add', function (req, res) {
      pool.getConnection()
      .then(conn => {
        conn.query(`insert into mecze value (0,'${req.body.kraj1}','${req.body.kraj2}',${req.body.rbkraj1},${req.body.rbkraj2},'${req.body.data}')`)
        .then((res) => {
          
          console.log(res);
          conn.end();
        })
        .catch(err => {
          
          console.log(err); 
          conn.end();
        })
          
        });
        conn.end();
      })
    
app.get('/:kraj', function (req, res) {
  pool.getConnection()
  .then(conn => {
  
    conn.query(`select * from mecze where kraj1 = '${req.params.kraj}' or kraj2 = '${req.params.kraj}'`)
    .then((res) => {
      console.log(res); 
      conn.end();
    })
    .catch(err => {
      
      console.log(err); 
      conn.end();
    })
    
    conn.end();
  })
})




var server = app.listen(8081, function () {
  console.log("Node uruchomiony.")
})

app.use('/', router);
