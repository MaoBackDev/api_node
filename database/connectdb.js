// Database connection with mongo db
import mongoose from "mongoose"

try {
    await mongoose.connect(process.env.URI_MONGO)
    console.log("Connection Db ok ✌")
} catch (error){
    console.log("Error de conexión -> " + error)
}
