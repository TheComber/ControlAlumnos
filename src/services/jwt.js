'use strict'

var jwt = require("jwt-simple")
var moment = require("moment")
var secret = 'clave_secreta_Persona'

exports.createToken = function(persona){
    var payload = {
        sub: persona._id,
        nombre: persona.nombre,
        apellido: persona.apellido,
        usuario: persona.usuario,
        email: persona.email,
        rol: persona.rol,
        int: moment().unix(),
        exp: moment().day(30, 'days').unix()
    }

    return jwt.encode(payload, secret)

}