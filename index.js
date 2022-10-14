import 'dotenv/config'
import './database/connectdb.js'
import express from 'express'
const app = express()





const PORT = process.env.PORT || 5000
// Listen method to server connection
app.listen(PORT, () => {
    console.log("✔✔✔ https://localhost: " + PORT)
})