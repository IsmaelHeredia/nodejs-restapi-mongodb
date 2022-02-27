const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

let TipoUsuarioSchema = new Schema({
    nombre: { type: String, required: true, max: 100, unique: true }
});

TipoUsuarioSchema.plugin(uniqueValidator);

module.exports = mongoose.model("TipoUsuario", TipoUsuarioSchema);