const sql = require('mysql')
const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const { rows } = require('mssql');
const cors = require('cors')
const auth = require('./middleware/middle.js')
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
app.get('/',auth ,(req, res) => {
    res.send(`<html>
    <div><form method="post" action="/todo"><input type="text" name="kode"/><button type="submit">Add</button></div></form></html>`)
})
app.post('/todo', (req, res) => {
    var data = req.body.desk
    var sqll = "INSERT INTO tblKode (desk) VALUES ('"+data+"')"
    con.query(sqll, data, function(err, data1){
        if(err) throw err;
        console.log("Data has inserted!")
    })
    res.end()
})
app.get('/todo',auth , (req, res) => {
    con.query("SELECT * from tblKode", (err, rows, field) => {
        if(!err){
            res.send(rows)
        }
        else{
            console.log(err)
        }
    })
})
app.delete('/todo/:Id',auth , (req, res) => {
    con.query("DELETE from tblKode WHERE Id='"+req.params.Id+"'")
    res.end()
})

app.get('/user',auth ,(req, res) => {
    con.query("SELECT id, username FROM tbluser", (err, rows, field) => {
        if(!err){
            res.send(rows)
        }
        else{
            console.log(err)
        }
    })
})
app.post('/user', (req, res, next) => {
    con.query('SELECT COUNT(*) as jumlahuser FROM tbluser', function(err, data1) {
        var convert = Object.values(data1)
        if(convert[0].jumlahuser > 0){
            auth(req,res,next)
        } else {
            next()
        }
    })
}, (req, res) => {
    const user = req.body.username
    const pass = req.body.password
    con.query('SELECT username FROM tbluser WHERE username=?',[user], function(err, rows, field) {
        if(rows.length > 1){
            res.send(401)
        } else {
            con.query('INSERT INTO tbluser (username, password) VALUES (?,?)',[user,pass], function(err, data1){
                if(err) {
                    res.end(500)
                    return
                }
            })
            con.query('SELECT id, username FROM tbluser ORDER BY id DESC LIMIT 1', (err, rows, field) => {
                res.send(rows)
            })
        }
    })
})
app.delete('/user/:id', (req, res) => {
    con.query('SELECT COUNT(*) as jumlahuser FROM tbluser', function(err, data1) {
        var convert = Object.values(data1)
        if(convert[0].jumlahuser > 1){
            con.query("DELETE from tbluser WHERE id='"+req.params.id+"'")
            res.end("Deleted")
        }else {
            res.send(401)
        }
    })
})
app.listen(3000);