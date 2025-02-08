const express = require('express');
const app =  express();
const path  = require('path');
const cookieparser =require('cookie-parser');


app.set("view engine" , "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname , 'public')));
app.use(cookieparser());

app.get("/" ,  (req,res)=>{
    res.send("Aitisam");
})

app.listen(3000);