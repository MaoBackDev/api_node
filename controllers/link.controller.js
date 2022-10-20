import { Link } from "../models/Link.js"
import {nanoid} from "nanoid"

export const getLinks = async (req, res) => {

    try {
        const links = await Link.find({uid: req.uid})
        
        return res.json({links})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Error del servidor"})
    }

}

export const getLink = async (req, res) => {

    try {
        const {nanoLink} = req.params
        const link = await Link.findOne({nanoLink})

        if(!link) 
            return res.status(404).json({error: "Link not found or not exists"})
        
        return res.json({longLink: link.longLink})
    } catch (error) {
        console.log(error)
        if(error.kind === 'ObjectId'){
            return res.status(403).json({error: "Error de formato"})
        }
        return res.status(500).json({error: "Error del servidor"})
    }

}

// Se usa para realizafr un crud tradicional
export const getLinkCrud = async (req, res) => {

    try {
        const {_id} = req.params
        const link = await Link.findById(_id)

        if(!link) 
            return res.status(404).json({error: "Link not found or not exists"})

        if(!link.uid.equals(req.uid)) 
            return res.status(401).json({error: "Link no pertenece al usuario"})
        
        return res.json({link})
    } catch (error) {
        console.log(error)
        if(error.kind === 'ObjectId'){
            return res.status(403).json({error: "Error de formato"})
        }
        return res.status(500).json({error: "Error del servidor"})
    }

}

export const createLink = async (req, res) => {
    try { 
        let {longLink} = req.body // Recuperar los parámetros del body

        if(!longLink.startsWith("https://")){
                longLink = "https://" + longLink
        }

        const link = new Link({longLink, nanoLink: nanoid(6), uid: req.uid})
        const newLink = await link.save()
     
        console.log(newLink)
        
        return res.status(201).json({newLink})

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Error del servidor"})
    }

}

export const removeLink = async (req, res) => {

    try {
        const {_id} = req.params
        const link = await Link.findById(_id)

        if(!link) 
            return res.status(404).json({error: "Link not found or not exists"})

        if(!link.uid.equals(req.uid)) 
            return res.status(401).json({error: "Link no pertenece al usuario"})
        
        await link.remove()
        return res.json({link})
    } catch (error) {
        console.log(error)
        if(error.kind === 'ObjectId'){
            return res.status(403).json({error: "Error de formato"})
        }
        return res.status(500).json({error: "Error del servidor"})
    }
}

export const updateLink = async (req, res) => {
    try {
        const {_id} = req.params
        const {longLink} = req.body

        if(!longLink.startsWith("https://")){
                longLink = "https://" + longLink
        }

        const link = await Link.findById(_id)

        if(!link) 
            return res.status(404).json({error: "Link not found or not exists"})

        if(!link.uid.equals(req.uid)) 
            return res.status(401).json({error: "Link no pertenece al usuario"})
        
        // Actualizar
        link.longLink = longLink
        await link.save()
        
        return res.json({link})

    } catch (error) {
        console.log(error)
        if(error.kind === 'ObjectId'){
            return res.status(403).json({error: "Error de formato"})
        }
        return res.status(500).json({error: "Error del servidor"})
    }
}