'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var PersonaSchema = Schema({
    nombre: String,
    apelido: String,
    usuario: String,
    email: String,
    password: String,
    rol: String,
    listaCurso:[{
        curso: String,
        cursoPersona:{type:Schema.ObjectId , ref:'persona'}
    }],
    
    persona: {type: Schema.ObjectId, ref:'persona'}
})

module.exports = mongoose.model("persona",PersonaSchema)