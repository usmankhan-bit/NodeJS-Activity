const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static('static'));

app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/bank_html/"+"home.html");
});

app.get('/deposit',(req,res)=>{
    res.sendFile(__dirname+"/bank_html/"+"deposit.html");
});
app.get('/create',function(req,res){
    console.log("register page");
    res.sendFile(__dirname+"/bank_html/"+"reg.html");
    
});

app.get('/post_register',function(req,res){
    console.log("post register function");
    let db = new sqlite3.Database('bank');
     let sql = `insert into Account values(${req.query.accno},${req.query.amt})`;
 
	db.all(sql, [], (err, rows) => {
	  if (err) {
		throw err;
	  }
	  rows.forEach((row) => {
		console.log(row.name);
	  });
	});
	
	let sql1 = `select * from Account`;
 
	db.all(sql1, [], (err, rows) => {
	  if (err) {
	    throw err;
	  }
	  rows.forEach((row) => {
	    console.log(row.AccNo+"\t\t"+row.Amount);
	    
	  });
	});	
	db.close()
	res.status(200).send("Registration Successful");
	
     //console.log(response);
});

app.post('/deposit',(req,res)=>{
	let db = new sqlite3.Database('bank');
    let sql1 = `select Amount from Account where AccNo = ${req.body.accno}`
    var curr_amount = 0;
    db.all(sql1, [], (err, rows) => {
        if (err) {
            return res.sendFile(__dirname+"/bank_html/"+"error.html");
        }
        curr_amount = rows[0].Amount;
        updated_amount =  parseInt(req.body.amount) + parseInt(curr_amount);
        let sql = `update Account set Amount = "${updated_amount}" where AccNo = "${req.body.accno}"`;

        db.run(sql, function(err) {
            if (err) {
                return res.sendFile(__dirname+"/bank_html/"+"error.html");
            }
            console.log(`Row(s) updated: ${this.changes}`);
        
        });

	db.close()
    });
    res.sendStatus(200);  
});

app.get('/withdrawl',(req,res)=>{
    res.sendFile(__dirname+"/bank_html/"+"withdrawl.html");
});

app.post('/withdrawl',(req,res)=>{
	let db = new sqlite3.Database('bank');
    let sql1 = `select Amount from Account where AccNo = ${req.body.accno}`
    console.log(sql1);
    var curr_amount = 0;
    db.all(sql1, [], (err, rows) => {
        if (err) {
            return res.sendFile(__dirname+"/bank_html/"+"error.html");
        }
        curr_amount = rows[0].Amount;
        updated_amount = parseInt(curr_amount) - parseInt(req.body.amount) ;
        if(updated_amount>=500){
            let sql = `update Account set Amount = "${updated_amount}" where AccNo = "${req.body.accno}"`;

            db.run(sql, function(err) {
                if (err) {
                    return res.sendFile(__dirname+"/bank_html/"+"error.html");
                }
                console.log(`Row(s) updated: ${this.changes}`);
                res.sendStatus(200);  
        
        });
        } else {
            return res.sendFile(__dirname+"/bank_html/"+"error.html");
        }
        db.close()

    });
    
});
app.listen(3000);
