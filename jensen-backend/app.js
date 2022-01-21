
const express = require("express")
const app = express()

process.env.PORT = 3000

app.get("/", (req,res)=>{
    res.status(200).send({"Status":"Framgång!"})
})

app.listen(3000, ()=>{
    console.log(`Lyssnar på port ${process.env.PORT}`)
});

