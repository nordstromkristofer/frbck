
const express = require("express")
const app = express()

process.env.PORT = 5500

app.get("/", (req,res)=>{
    res.status(200).send({"Status":"Framgång!"})
})

app.listen(5500, ()=>{
    console.log(`Lyssnar på port ${process.env.PORT}`)
});

