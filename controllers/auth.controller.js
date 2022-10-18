// Contiene la lógica

// Importar modelo
import { User } from "../models/User.js";
import jwt from 'jsonwebtoken'
import { generateToken, refreshTokenGenerator } from "../utils/tokenManager.js";

export const register = async (req, res) => {
  // Recuperar los datos enviados en la petición
  const { email, password } = req.body;

  // Guardar usuario en la base de datos
  try {
    const user = new User({ email, password }); // Creación del usuario
    await user.save(); // Guardado en la base de datos
    return res.status(201).json({ ok: true }); // respuesta
  } catch (e) {
    // Validar que no se registre un usuario con el mismo correo. Alternativa pro defecto mongoose
    if (e.code === 11000) {
      return res
        .status(400)
        .json({ error: "Ya existe un usuario con este email" });
    }
    return res.status(500).json({ error: "Error del servidor" });
  }
};

// Login
export const login = async (req, res) => {
  
  try {
    const { email, password } = req.body; // recuperar los datos enviados en el request
    let user = await User.findOne({ email }); // consultar si existe el email en la base de datos
    // Comparar las contraseñas. El método comparePassword es creado en el schema
    const passwordValidated = await user.comparePassword(password);

    if (!user || !passwordValidated)
      return res.status(400).json({ error: "Credenciales incorrectas" });

    // GENERAR JWT (json web token)
    const { token, expiresIn } = generateToken(user._id);
    // Generar el refreshToken
    refreshTokenGenerator(user._id, res)

    return res.json({ token, expiresIn });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};


// Funcción para acceder a la información del usuario loggeado
export const infoUser = async (req, res) => {
  try {
    // Consulta  a la base de datos .lean() retorna el objeto con los datos específicos. Hace la consulta más rápida
    const user = await User.findById(req.uid).lean();
    
    return res.json({email: user.email});
  } catch (error) {
    return res.status(500).json({error: "Error del servidor"})
  }
};


export const refreshToken = (req, res) => {

  try {
    const refreshTokenCookie = req.cookies.refreshToken

    if(!refreshTokenCookie) throw new Error("No Existe el Token")

    const {uid} = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH)
    const { token, expiresIn } = generateToken(uid);

    return res.json({token, expiresIn})

  } catch (error) {
    console.log(error)
    // Verificación de errores
    const tokenVerificationErrors = {
      "invalid signature": "La firma del JWT no es válida",
      "jwt expired": "JWT expirado",
      "invalid token": "Token no válido",
      "No bearer": "Utiliza el formato bearer",
      "jwt malformed": "JWT malformado"
  }

  return res.status(401).send({error: tokenVerificationErrors[error.message]})
  }

}


/*
export const loginCookies = async (req, res) => {
  
  try {
    const { email, password } = req.body; // recuperar los datos enviados en el request
    let user = await User.findOne({ email }); // consultar si existe el email en la base de datos
    // Comparar las contraseñas. El método comparePassword es creado en el schema
    const passwordValidated = await user.comparePassword(password);

    if (!user || !passwordValidated)
      return res.status(400).json({ error: "Credenciales incorrectas" });

    // GENERAR JWT (json web token)
    const { token, expiresIn } = generateToken(user._id);

    // Guardar token en una cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: !(process.env.MODE === "developer")
    })
    return res.json({ token, expiresIn });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};
*/
