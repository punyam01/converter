const express = require ("express")

const app = express()



// bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// router setting 

const converter= require("./routes/converter.route")


app.use('/api/v1/converter',converter)



module.exports = { app }