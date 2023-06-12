var express = require("express");
var helper = require("../funciones/helper.js");
var router = express.Router();

const Producto = require("../modelos/producto.model");

router.get("/", function (req, res) {

  Producto.find({}, function (error, resultado) {
    if (error){
        res.status(400).json({estado:400, mensaje:"Error listando productos"});
    } else {
        res.json({estado:200, "productos":resultado});
    }
  });

});

router.get("/:id", function (req, res) {
  var id = req.params.id;

  Producto.findOne({_id: id}, function (error, resultado) {
    if (error){
        res.status(400).json({estado:400, mensaje:"Error cargando producto"});
    } else {
        res.json({estado:200, "producto":resultado});
    }
  });

});

router.post("/", async (req,res) => {

  try 
  {
    if(helper.estaVacio(req.body.nombre))
    {
      res.status(400).json({estado:400, mensaje:"Falta el nombre"});
    }
    else if(helper.estaVacio(req.body.descripcion)) 
    {
      res.status(400).json({estado:400, mensaje:"Falta la descripción"});
    }
    else if(helper.estaVacio(req.body.precio))
    {
      res.status(400).json({estado:400, mensaje:"Falta el precio"});
    }
    else if(helper.estaVacio(req.body.proveedor))
    {
      res.status(400).json({estado:400, mensaje:"Falta el proveedor"});
    } 
    else 
    {
      var nombre = req.body.nombre;
      var descripcion = req.body.descripcion;
      var precio = req.body.precio;
      var proveedor = req.body.proveedor;
      var fecha_registro = helper.cargarFechaActual();

      var producto = new Producto(
        {
          nombre: nombre,
          descripcion: descripcion,
          precio: precio,
          proveedor: proveedor,
          fecha_registro: fecha_registro
        }
      );
      
      Producto.countDocuments({nombre: nombre}, function (err, cantidad){

        if(cantidad > 0) 
        {
          res.status(400).json({estado:400, mensaje:"El producto con el nombre " + nombre + " ya existe"});
        } 
        else 
        {
          producto.save(function (error) {
            if (error){
                res.status(400).json({estado:400, mensaje:"Error agregando producto"});
            } else {
                res.json({estado:200, mensaje:"Producto creado"});
            }
          });
        }

      });

    }

  } 
  catch (error) 
  {
    res.status(400).json({mensaje:error.message});
  }

});

router.put("/:id", async (req,res) => {

  try 
  {
    if(helper.estaVacio(req.params.id)) 
    {
      res.status(400).json({estado:400, mensaje:"Falta el ID"});
    }
    else if(helper.estaVacio(req.body.nombre))
    {
      res.status(400).json({estado:400, mensaje:"Falta el nombre"});
    }
    else if(helper.estaVacio(req.body.descripcion))
    {
      res.status(400).json({estado:400, mensaje:"Falta la descripción"});
    }
    else if(helper.estaVacio(req.body.precio))
    {
      res.status(400).json({estado:400, mensaje:"Falta el precio"});
    }
    else if(helper.estaVacio(req.body.proveedor)) 
    {
      res.status(400).json({estado:400, mensaje:"Falta el proveedor"});
    } 
    else 
    {
      var id = req.params.id;
      var nombre = req.body.nombre;
      var descripcion = req.body.descripcion;
      var precio = req.body.precio;
      var proveedor = req.body.proveedor;

      Producto.countDocuments({ $and: [ { _id: { $ne: id } }, {nombre: nombre} ] }, function (err, cantidad){

        if(cantidad > 0) 
        {
          res.status(400).json({estado:400, mensaje:"El producto " + nombre + " ya existe"});
        } 
        else 
        {
          Producto.findByIdAndUpdate(id, 
          {
            nombre: nombre,
            descripcion: descripcion,
            precio: precio,
            proveedor: proveedor
          }, function (error, resultado) {
            if (error){
                res.status(400).json({estado:400, mensaje:"Error editando producto"});
            } else {
                res.json({estado:200, mensaje:"Producto editado"});
            }
          });

        }

      });

    }

  }
  catch (error) 
  {
    res.status(400).json({estado:400, mensaje:error.message});
  }
  
});

router.delete("/:id", function (req, res) {
  var id = req.params.id;

  Producto.findByIdAndRemove(id, function (error) {
    if (error){
      res.status(400).json({estado:400, mensaje:"Error borrando producto"});
    } else {
      res.json({estado: 200, mensaje: "Producto borrado"});
    }
  });

});

module.exports = router;