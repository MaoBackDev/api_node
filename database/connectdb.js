import mongoose from "mongoose"

try {
    await mongoose.connect(process.env.URI_MONGO)
    console.log("Connection Db ok ✌")
} catch (error){
    console.log("Error de conexión -> " + error)
}



// mongoose.connect(process.env.URI_MONGO,
//     {useNewUrlParser: true, useUnifiedTopology: true} 
//   )