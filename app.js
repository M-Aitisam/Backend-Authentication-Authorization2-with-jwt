const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const userModel = require("./models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.render("index");
});

app.post('/create', async (req, res) => {

    let { username, email, password, age } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    let createdUser = await userModel.create({
        username,
        email,
        password: hash,
        age
    });

    let token = jwt.sign({ email }, "aitisam" );
    res.cookie("token", token, { httpOnly: true });

    res.send({ message: "User created successfully", user: createdUser, token });
});
//login
app.get("/login", (req, res) => {
    res.render("login");
})
app.post("/login", async (req, res) => {
    let user =  await userModel.findOne({ email: req.body.email });

    if (!user) {  res.send("Something Went Wrong 🤔"); }
    else {
        let match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            let token = jwt.sign({ email: user.email }, "aitisam");
            res.cookie("token", token, { httpOnly: true });
            return  res.send("Yes, You can log in.");
        } else {
          return  res.send("Something Went Wrong 🤔");
        }
        

    }
        
})
//logout
app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/");
})

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
