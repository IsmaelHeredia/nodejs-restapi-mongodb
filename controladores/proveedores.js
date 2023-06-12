var express = require("express");
var helper = require("../funciones/helper.js");
var router = express.Router();

const Proveedor = require("../modelos/proveedor.model");

router.get("/", function (req, res) {

  Proveedor.find({}, function (error, resultado) {
    if (error){
        res.status(400).json({estado:400, mensaje:"Error listando proveedores"});
    } else {
        res.json({estado:200, "proveedores":resultado});
    }
  });

});

router.get("/:id", function (req, res) {
  var id = req.params.id;

  Proveedor.findOne({_id: id}, function (error, resultado) {
    if (error){
        res.status(400).json({estado:400, mensaje:"Error cargando proveedor"});
    } else {
        res.json({estado:200, "proveedor":resultado});
    }
  });

});

router.post("/", async (req,res) => {

  try {

    if(helper.estaVacio(req.body.nombre))
    {
      res.status(400).json({estado:400, mensaje:"Falta el nombre"});
    }
    else if(helper.estaVacio(req.body.direccion))
    {
      res.status(400).json({estado:400, mensaje:"Falta la dirección"});
    }
    else if(helper.estaVacio(req.body.telefono))
    {
      res.status(400).json({estado:400, mensaje:"Falta el teléfono"});
    }
    else 
    {
      var nombre = req.body.nombre;
      var direccion = req.body.direccion;
      var telefono = req.body.telefono;
      var fecha_registro = helper.cargarFechaActual();

      var proveedor = new Proveedor(
        {
          nombre: nombre,
          direccion: direccion,
          telefono: telefono,
          fecha_registro: fecha_registro
        }
      );
      
      Proveedor.countDocuments({nombre: nombre}, function (err, cantidad){

        if(cantidad > 0) 
        {
          res.status(400).json({estado:400, mensaje:"El proveedor con el nombre " + nombre + " ya existe"});
        } 
        else 
        {
          proveedor.save(function (error) {
            if (error){
                res.status(400).json({estado:400, mensaje:"Error agregando proveedor"});
            } else {
                res.json({estado:200, mensaje:"Proveedor creado"});
            }
          });
        }

      });

    }

  } catch (error)
  {
     res.status(400).json({estado:400, mensaje:error.message});
  }

});

router.put("/:id", async (req,res) => {

  try {

    if(helper.estaVacio(req.params.id)) {
      res.status(400).json({estado:400, mensaje:"Falta el ID"});
    }
    else if(helper.estaVacio(req.body.nombre)) 
    {
      res.status(400).json({estado:400, mensaje:"Falta el nombre"});
    }
    else if(helper.estaVacio(req.body.direccion))
    {
      res.status(400).json({estado:400, mensaje:"Falta la dirección"});
    }
    else if(helper.estaVacio(req.body.telefono))
    {
      res.status(400).json({estado:400, mensaje:"Falta el teléfono"});
    }
    else 
    {
      var id = req.params.id;
      var nombre = req.body.nombre;
      var direccion = req.body.direccion;
      var telefono = req.body.telefono;

      Proveedor.countDocuments({ $and: [ { _id: { $ne: id } }, {nombre: nombre} ] }, function (err, cantidad){

        if(cantidad > 0) 
        {
          res.status(400).json({estado:400, mensaje:"El proveedor " + nombre + " ya existe"});
        } 
        else 
        {
          Proveedor.findByIdAndUpdate(id, 
          {
            nombre: nombre,
            direccion: direccion,
            telefono: telefono
          }, function (error, resultado) {
            if (error){
                res.status(400).json({estado:400, mensaje:"Error editando proveedor"});
            } else {
                res.json({estado:200, mensaje:"Proveedor editado"});
            }
          });

        }

      });

    }

  } catch (error) 
  {
    res.status(400).json({estado:400, mensaje:error.message});
  }

});

router.delete("/:id", function (req, res) {
  var id = req.params.id;

  Proveedor.findByIdAndRemove(id, function (error) {
    if (error){
      res.status(400).json({estado:400, mensaje:"Error borrando proveedor"});
    } else {
      res.json({estado: 200, mensaje: "Proveedor borrado"});
    }
  });

});

module.exports = router;