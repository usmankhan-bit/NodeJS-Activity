const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('company');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static('static'));

app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/company_html/"+"home.html");
});

app.get('/create',(req,res)=>{
    res.sendFile(__dirname+"/company_html/"+"create.html");
});

app.post('/create',(req,res)=>{
    console.log("Create Form");
    let sql = `insert into employee values("${req.body.name}","${req.body.ssn}","${req.body.gender}","${req.body.dept}","${req.body.salary}","${req.body.designation}")`;
    console.log(req.body);
    console.log(sql);
	db.all(sql, [], (err, rows) => {
	  if (err) {
		return res.sendFile(__dirname+"/company_html/"+"error.html");
	  }
      res.sendStatus(200);
    });
});

app.get('/production',(req,res)=>{
    var sql = `select name,SSN from employee where dept = "production" and gender = "f"`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log(err);
            return res.sendFile(__dirname+"/company_html/"+"error.html");
            
        }
        res.send(rows);
    });
});

app.get('/sales',(req,res)=>{
    var sql = `select name,SSN from employee where dept = "sales" and gender = "f" and salary>10000`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log(err);
            return res.sendFile(__dirname+"/company_html/"+"error.html");
            
        }
        res.send(rows);
    });
});





app.listen(3000);