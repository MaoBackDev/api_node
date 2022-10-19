import axios from "axios";
import { validationResult } from "express-validator"
import {body} from 'express-validator'


export const validationResultExpress = (req, res, next) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    next()
}

export const bodyRegisterValidator = [
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

]

export const bodyLoginValidator = [
    body('email', "El formato no es correcto").trim().isEmail().normalizeEmail(),
    body('password', "La contraseña debe contener mínimo 8 caracteres").trim().isLength({min: 8}),
    validationResultExpress
]

export const bodyLinkValidator = [
    body('longLink', "Formato de link incorrecto")
    .trim()
    .notEmpty()
    .custom(async value =>{
        try {
            if(!value.startsWith("https://")){
                value = "https://" + value
            }
            console.log(value)
            await axios.get(value)
            return value

        } catch (error) {
            throw new Error('Not found longLink 404')
        }
    }),
    validationResultExpress
]