const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

let UsuarioSchema = new Schema({
    nombre: { type: String, required: true, max: 100, unique: true },
    clave: {type: String, required: true, max: 100},
    tipo: {type: String, required: true},
    fecha_registro: {type: String, required: true, max: 100}
});

UsuarioSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Usuario", UsuarioSchema);