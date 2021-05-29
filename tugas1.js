const sql = require('mysql')
const express = require('express');
const bodyParser = require('body-parser');
const { rows } = require('mssql');
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
const con = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todo'
})
con.connect(function (err){
    if(err) console.log(err);
    else console.log("Connected!")
})
app.get('/', (req, res) => {
    res.send(`<html>
    <div><form method="post" action="/todo"><input type="text" name="kode"/><button type="submit">Add</button></div></form></html>`)
})
app.post('/todo', (req, res) => {
    var data = req.body.desk
    var sqll = "INSERT INTO tblKode (desk) VALUES ('"+data+"')"
    con.query(sqll, data, function(err, data1){
        if(err) throw err;
        console.log("User Data has inserted!")
    })
    res.end()
})
app.get('/todo', (req, res) => {
    con.query("SELECT * from tblKode", (err, rows, field) => {
        if(!err){
            res.send(rows)
        }
        else{
            console.log(err)
        }
    })
})
app.delete('/todo/:Id', (req, res) => {
    con.query("DELETE from tblKode WHERE Id='"+req.params.Id+"'")
    res.end()
})
app.listen(3000);


