import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'

const {Schema, model} = mongoose

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        index: { unique: true },
    },
    password: {
        type: String,
        required: true,
    },
})

// Permite crear funcionalidad al momento de guardar un objeto del esquema. Esta función se ejecutará cuando se guarde un objeto.
userSchema.pre("save", async function(next){
    const user = this // Recuperamos el objeto

    if(!user.isModified('password')) return next() // Validar que al actualizar un usuario la contraseña se modifique

    try {
        const salt = await bcryptjs.genSalt(10) // Se generan los saltos para la encriptación
        user.password = await bcryptjs.hash(user.password, salt) // Se asigna al objeto en su campo password el hash de la contraseña
        next()
    }catch(e){
        console.log(e)
        throw new Error("Fallo en la encriptación")
    }
})

// Comparar las contraseñas para el login
userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcryptjs.compare(candidatePassword, this.password)
}

// Pasar el schema a un modelo exportable
export const User = model('User', userSchema)