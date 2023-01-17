const {Client} = require('pg')

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(express.json);

app.listen(3000, ()=>{
    console.log("Server is Listening at port 3000");
})

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5433,
    password: "12345",
    database: "mydatabase"

}) 

client.connect();

app.get('/get/patients', (req, res)=>{
    client.query(`Select * from patients`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        } else {
            console.log(err.message)
        }
        client.end;
    })
    
})

app.get('/get/appointments', (req, res)=>{
    client.query(`Select * from appointments`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        } else {
            console.log(err.message)
        }
        client.end;
    })
    
})

app.get('/get/doctors', (req, res)=>{
    client.query(`Select * from doctors`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        } else {
            console.log(err.message)
        }
        client.end;
    })
    
})

client.query(`Select * from patients`, (err, res)=>{
    if(!err){
        console.log(res.rows);
    } else {
        console.log(err.message)
    }
    client.end;
})

client.query(`Select * from appointments`, (err, res)=>{
    if(!err){
        console.log(res.rows);
    } else {
        console.log(err.message)
    }
    client.end;
})

client.query(`Select * from doctors`, (err, res)=>{
    if(!err){
        console.log(res.rows);
    } else {
        console.log(err.message)
    }
    client.end;
})

app.post('/post/patients', (req, res)=>{
    const body = req.body
   // const {last_name, first_name, middle_initial_, age, gender, height_cm, weight_kg, current_address, contact_number, email_address} = req.body
    client.query(`INSERT INTO patients (last_name, first_name, middle_initial_, age, gender, height_cm, weight_kg, current_address, contact_number, email_address, gender)
    VALUES('cruz', 'jay', 'm', 23, 'male', 150, 60, 'quezon city', 09987654321, 'jay@gmail.com')`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        } else {
            console.log(err.message)
        }
        client.end;
    })
    res.json("Isert data success!")
})
app.post('/post/appointments', (req, res)=>{
    const body = req.body
    const {last_name, first_name, middle_initial} = req.body
    client.query(`INSERT INTO appointments (date_time, status, patients_id, doctors_id)
    VALUES(${date_time}, ${status}, ${patients_id}, ${doctors_id})`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        } else {
            console.log(err.message)
        }
        client.end;
    })
    res.json("Isert data success!")
})

app.post('/post/doctors',  (req, res)=>{
    const {last_name, first_name, middle_initial_, age, gender, specialization, hospital,  contact_number,  email_address} = req.body
    client.query(`INSERT INTO doctors (last_name, first_name, middle_initial_, age, gender, specialization, hospital,  contact_number,  email_address)
    VALUES($1, $2, $3, $4, $5, $6, $7,  $8, $9) RETURNING *`,(err, result)=>{
        if(!err){
            res.send(result.rows);
        } else {
            console.log(err.message)
        }
        client.end;
    })
    res.json("Insert data success!") 
})


app.post('/login', async (req, res) => {
    try {

        //take the username and password from the req.body
        const {
            username,
            password
        } = req.body;

        //Check if the user is not existing
        const user = await pool.query(`SELECT * FROM Patients WHERE
        username = $1`, [username])

        if (user.rows.length < 0) {
            res.status(401).send("User does not exists")
        }

        //Check if the password matches using bcrypt
        const validPassword = await bcrypt.compare(password, user.rows[0].password)
        if (!validPassword) {
            return res.status(401).json("Password or Email is incorrect")
        }

        //generate and return the JWT
        const token = generateJwt(user.rows[0])
        res.json({
            token
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).send({
            msg: "Unauthenticated"
        });
    }
})



