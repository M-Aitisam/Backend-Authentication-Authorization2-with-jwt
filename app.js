const express = require('express');
const app = express();
const path = require('path');
const cookieparser = require('cookie-parser');
const usermodel = require("./models/user")
const brcypt = require('bcrypt');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieparser());

app.get("/", (req, res) => {
    res.render("index");
})

app.post('/create', (req, res) => {
    let { username, email, password, age } = req.body;
brcypt.genSalt(10,(err,salt)=>{

    brcypt.hash(password, salt, async (err, hash)=>{
        let createdUser =   await usermodel.create({
            username,
            email,
            password:hash,
            age
        });
        res.send(createdUser);
    
    })
})
})
app.listen(3000);