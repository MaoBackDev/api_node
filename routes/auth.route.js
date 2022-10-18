import {Router} from 'express';
import { infoUser, login, register } from '../controllers/auth.controller.js';
import {body} from 'express-validator'
import { validationResultExpress } from '../middlewares/validationResultExpress.js';
import { tokenRequired } from '../middlewares/tokenRequired.js';
const router = Router();

/**
 * IMPORTANTE: Las rutas deben ser controladas en el archivo controlador
 * Validación de campos: Para validar los campos usamos el paquete de express.validator. Importamos body para capturar los valores que se envían a traves del req.
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


// Ruta Protegida
router.get('/protected', tokenRequired, infoUser)


// Permite ser usado en otros módulos y asignarle el nombre que se necesite
export default router;