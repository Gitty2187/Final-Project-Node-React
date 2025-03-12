require("dotenv").config()
const express = require('express')
const cors = require("cors")
const connectDB = require("./config/dbConn")
const mongoose = require("mongoose")

const corsOptions = require("./config/corsOptions")
const PORT = process.env.PORT || 8000
const app = express()
connectDB()

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.send("this is the home page")
})

app.use("/bulding", require("./routes/building-route"))
app.use("/apartment",require("./routes/apartment-route"))
app.use("/expenses",require("./routes/expenses-route"))
app.use("/apartment_sum",require("./routes/apartment_sum-router"))
app.use("/payments",require("./routes/apartment_payment-router"))

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port
    ${PORT}`))
})
mongoose.connection.on('error', err => {
    console.log(err)
})



