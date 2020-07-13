'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema

var CursosShema = Schema({
    curso1: String,
    curso2: String,
    curso3: String,
    persona: {type: Schema.ObjectId, ref: 'persona'},

})

module.exports = mongoose.model('cursos', CursosShema)