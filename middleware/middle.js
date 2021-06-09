const sql = require('mysql')
const { rows } = require("mssql");
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

module.exports = function(req, res, next) {
    const username = req.headers.username
    const password = req.headers.password

    con.query('SELECT username FROM tbluser WHERE username=? AND password=?', [username, password], function(err, data1){
        if(data1.length > 0 ) {
            next()
        } else {
            res.send(401)
        }
    })
}