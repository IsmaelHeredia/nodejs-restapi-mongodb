const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

let ProductoSchema = new Schema({
    nombre: { type: String, required: true, max: 100, unique: true },
    descripcion: {type: String, required: true, max: 100},
    precio: {type: Number, required: true},
    proveedor: {type: String, required: true},
    fecha_registro: {type: String, required: true, max: 100}
});

ProductoSchema.plugin(uniqueValidator);

const Producto = module.exports = mongoose.model("Producto", ProductoSchema);