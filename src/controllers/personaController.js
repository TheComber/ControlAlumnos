'use strict'
//Imports
var  bcrypt = require("bcrypt-nodejs");
var Persona = require("../models/persona")
var jwt = require("../services/jwt")
var path = require("path")
var fs = require("fs")

function registrarPersona(req, res){
    var persona =  new Persona();
    var params = req.body;

    if(params.nombre && params.apellido && params.usuario && params.email && params.password){
        persona.nombre = params.nombre;
        persona.apellido = params.apellido;
        persona.usuario = params.usuario;
        persona.email = params.email;
        persona.rol = "ALUMNO";

        Persona.find({ $or:[
            {usuario: persona.usuario},
            {email: persona.email}
        ]}).exec((err, personas)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion de usuario'})

            if(personas && personas.length >=1){
                return res.status(500).send({message: 'El usuario ya exciste'})
            }else{
                bcrypt.hash(params.password, null, null,(err, hash)=>{
                    persona.password = hash;
                    
                    persona.save((err, personaGuardado)=>{
                        if(err) return res.status(500).send({message: 'Error al guardar el usuario'})
                        if(personaGuardado){
                            res.status(200).send({persona: personaGuardado})
                        }else{
                            res.status(404).send({message: 'No se ha registrado el usuario'})
                        }
                    })
                })
            }
        })
    }else{
        res.status(200).send({
            message: 'Rellene todos los comapos necesarios'

        })
    }
}

function asignarCursos(req, res){
    var personacurso = new  Persona();
    var params = req.body;

    if(params.curso1 && params.curso2 && params.curso3){
        personacurso.curso1 = params.curso1;
        personacurso.curso2 = params.curso2;
        personacurso.curso3 = params.curso3;

        personacurso.persona= req.persona.sub
        personacurso.save((err, cursosGuardada)=>{
            if(err)return req.status(500).send({message: "Error en la peticion de cursos"})
            if(!cursosGuardada)return req.status(404).send({message: "Error al agregar los cursos"})

            return res.status(200).send({personacurso: cursosGuardada})
        })
    }else{
        req.status(200).send({message: "Rellene todos los datos"})
    }
}

function asignar(req, res){
var personaid = req.params.idPersona;
var params = req.body;

    Persona.findOneAndUpdate(personaid,{$push:{listaCurso: {curso1: params.curso1, curso2: params.curso2, curso3: params.curso3, cursoIdPersona: req.persona.sub}}}, {new: true}, (err, cursos)=>{
        if(err) return res.status(500).sned({message: 'Error al piblicar el comentario'})
        if(!cursos) return res.status(404).send({message: "No se a podido guardar el comentario"})
        return res.status(200).send({cursos})
    })
}

function login(req, res){
    var params = req.body;

    Persona.findOne({email: params.email}, (err, persona)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})

        if(persona){
            bcrypt.compare(params.password, persona.password, (err, check)=>{
                if(check){
                    if(params.gettoken){
                        return res.status(200).send({token: jwt.createToken(persona)})
                    }else{
                        persona.password = undefined;
                        return res.status(200).send({persona})
                    }
                }else{

                    return res.status(404).send({message: 'El usuario no se pudo logiar'})

                }
            })
        }else{

            return res.status(404).send({message: 'El usuario no se pudo logiar'})
            
        }     
        
    })
}

function editarPersona(req, res){
    var personaId = req.params.idPersona;
    var params = req.body

    //Borrar la propidad de password para editar
    delete params.password

    if(personaId != req.persona.sub){
        return res.status(500).send({message: "No tiene permisos para editar este usuario"})
    }

    Persona.findByIdAndUpdate(personaId, params, {new: true}, (err, personaActualizado)=>{
        if(err) return res.status(500).send({message: "Error en la peticion"})
        if(!personaActualizado) return res.status.send({message: "No se ha podido actulizar los datos del usuario"})

        return res.status(200).send({persona: personaActualizado})


        
    })

}

function eliminarPersona(req, res){
    var personaid = req.params.id;

    if(personaid != req.persona.sub){
        return res.status(500).send({message: "No contiene permisos para eliminar"})
    }

    Persona.findByIdAndDelete(personaid , (err, personaEliminado)=>{
        if(err) res.status(500).send({message: "Error en la peticion"})
        if(!personaEliminado) res.status(404).send({message: "Error al eliminar el usuario"})
        return res.status(200).send({persona: personaEliminado})
    })

}

module.exports = {
    registrarPersona,
    asignarCursos,
    asignar,
    login,
    editarPersona,
    eliminarPersona

}