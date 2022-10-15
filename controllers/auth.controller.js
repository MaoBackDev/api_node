// Contiene la lógica 

export const register = (req, res) => {
    console.log(req.body)

    res.json({ok: 'Register Succesfully'})
}

export const login = (req, res) =>{
    res.json({ok: 'Login Succesfully'})
}

