// Contiene la lógica 

// Importar modelo
import {User} from '../models/User.js'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    // Recuperar los datos enviados en la petición
    const {email, password} = req.body

    // Guardar usuario en la base de datos
    try {
        const user = new User({email, password}) // Creación del usuario
        await user.save() // Guardado en la base de datos
        return res.status(201).json({ok: true}) // respuesta

    }catch(e){
        // Validar que no se registre un usuario con el mismo correo. Alternativa pro defecto mongoose
        if(e.code === 11000){
            return res.status(400).json({error: 'Ya existe un usuario con este email'})
        }
        return res.status(500).json({error: 'Error del servidor'})
    }
}

// Login 
export const login = async (req, res) =>{
    const {email, password} = req.body; // recuperar los datos enviados en el request

    try {
        let user = await User.findOne({email}) // consultar si existe el email en la base de datos
        // Comparar las contraseñas. El método comparePassword es creado en el schema
        const passwordValidated = await user.comparePassword(password)

        if(!user || !passwordValidated) 
            return res.status(400).json({error: 'Credenciales incorrectas'})

        // GENERAR JWT (json web token)
        const token = jwt.sign({uid: user.id}, process.env.JWT_SECRET)
        
        return res.json({token})

    }catch(error){
        console.log(error)
        return res.status(500).json({error: 'Error del servidor'})
    }
}

