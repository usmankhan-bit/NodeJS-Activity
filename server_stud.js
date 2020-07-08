const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('student');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static('static'));

app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/student_html/"+"home.html");
});

app.get('/create',(req,res)=>{
    res.sendFile(__dirname+"/student_html/"+"create.html");
});

app.post('/create',(req,res)=>{
    console.log("Create Form");
    let sql = `insert into student values("${req.body.name}","${req.body.usn}","${req.body.attendance}","${req.body.cie}","${req.body.dept}")`;
    console.log(req.body);
    console.log(sql);
	db.all(sql, [], (err, rows) => {
	  if (err) {
		throw err;
	  }
      res.sendStatus(200);
    });
});

app.get('/hallticket',(req,res)=>{
    var sql = `select name,USN,branch from student where attendance>=80 and CIE>8`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.sendFile(__dirname+"/student_html/"+"error.html");
        }
        res.send(rows);
    });
});

app.get('/eligible',(req,res)=>{
    var sql = `select name,USN from student where attendance>=80 and CIE>8`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.sendFile(__dirname+"/student_html/"+"error.html");
        }
        res.send(rows);
    });
});



app.listen(3000);