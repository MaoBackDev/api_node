import express from 'express';
import { login, register } from '../controllers/auth.controller.js';
import {body} from 'express-validator'
import { validationResultExpress } from '../middlewares/validationResultExpress.js';
const router = express.Router();

/**
 * IMPORTANTE: Las rutas deben ser controladas en el archivo controlador
 */
router.post('/register',
    [
        body('email', "El formato no es correcto").trim().isEmail().normalizeEmail(),
        body('password', "La contraseña debe contener mínimo 8 caracteres").trim().isLength({min: 8}),
        body('password', "El formato no es correcto").
        custom((value, {req}) => {
            if (value !== req.body.repassword){
                throw new Error('Las contraseñas no coinciden')
            }
            return value
        })
    ], 
    validationResultExpress,
    register
)

router.post('/login',[
    body('email', "El formato no es correcto").trim().isEmail().normalizeEmail(),
    body('password', "La contraseña debe contener mínimo 8 caracteres").trim().isLength({min: 8}),
    ], 
    validationResultExpress,
    login
)


// Permite ser usado en otros módulos y asignarle el nombre que se necesite
export default router;