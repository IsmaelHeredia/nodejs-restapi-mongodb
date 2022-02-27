const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

let ProveedorSchema = new Schema({
    nombre: { type: String, required: true, max: 100, unique: true },
    direccion: {type: String, required: true, max: 100},
    telefono: {type: Number, required: true},
    fecha_registro: {type: String, required: true, max: 100}
});

ProveedorSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Proveedor", ProveedorSchema);