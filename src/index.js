'use strict'

const mongoose = require("mongoose")
const app = require("./app")

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ControlAlumnos',{useNewUrlParser: true, useUnifiedTopology:true }).then(()=>{
    console.log('Se ecuentra conectado a la Base de Datos');

    app.set('port',process.env.PORT || 8181)
app.listen(app.get('port'),()=>{

    console.log(`El servidor esta corriendo en el puerto: ${app.get('port')}`);

})

}).catch(err => console.log(err))