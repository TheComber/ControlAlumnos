'use strict'

var express = require('express')
var PersonaController = require("../controllers/personaController")
var md_auth = require("../middlewares/authentication")

//Subir Imagen
var multiparty = require('connect-multiparty')

//Rutas
var api= express.Router()
api.post('/registrarPersona', PersonaController.registrarPersona)
api.post('/asignarCursos',md_auth.ensureAuth, PersonaController.asignarCursos)
api.put('/asignar/:idPersona',md_auth.ensureAuth, PersonaController.asignar)
api.post('/login', PersonaController.login)
api.put('/editarPersona/:idPersona', md_auth.ensureAuth, PersonaController.editarPersona)
api.delete('/eliminarPersona/:id',md_auth.ensureAuth, PersonaController.eliminarPersona)

module.exports = api;