var express = require("express");
var helper = require("../funciones/helper.js");
var router = express.Router();

const Usuario = require("../modelos/usuario.model");

router.get("/", function (req, res) {

  Usuario.find({}, function (error, resultado) {
    if (error){
        res.status(400).json({estado:400, mensaje:"Error listando usuarios"});
    } else {
        res.json({estado:200, "usuarios":resultado});
    }
  });

});

router.get("/:id", function (req, res) {
  var id = req.params.id;

  Usuario.findOne({_id: id}, function (error, resultado) {
    if (error){
        res.status(400).json({estado:400, mensaje:"Error cargando usuario"});
    } else {
        res.json({estado:200, "usuario":resultado});
    }
  });

});

router.post("/", async (req,res) => {

  try {

    if(helper.estaVacio(req.body.nombre))
    {
      res.status(400).json({estado:400, mensaje:"Falta el nombre"});
    }
    else if(helper.estaVacio(req.body.clave))
    {
      res.status(400).json({estado:400, mensaje:"Falta la clave"});
    }
    else if(helper.estaVacio(req.body.tipo))
    {
      res.status(400).json({estado:400, mensaje:"Falta el tipo"});
    } 
    else 
    {
      var nombre = req.body.nombre;
      var clave = helper.codificarClave(req.body.clave);
      var tipo = req.body.tipo;
      var fecha_registro = helper.cargarFechaActual();

      var usuario = new Usuario(
        {
          nombre: nombre,
          clave: clave,
          tipo: tipo,
          fecha_registro: fecha_registro
        }
      );
      
      Usuario.countDocuments({nombre: nombre}, function (err, cantidad){

        if(cantidad > 0) 
        {
          res.status(400).json({estado:400, mensaje:"El usuario con el nombre " + nombre + " ya existe"});
        } 
        else 
        {
          usuario.save(function (error) {
            if (error){
                res.status(400).json({estado:400, mensaje:"Error agregando usuario"});
            } else {
                res.json({estado:200, mensaje:"Usuario creado"});
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

    if(helper.estaVacio(req.params.id))
    {
      res.status(400).json({estado:400, mensaje:"Falta el ID"});
    }
    else if(helper.estaVacio(req.body.tipo))
    {
      res.status(400).json({estado:400, mensaje:"Falta el tipo"});
    } 
    else 
    {
      var id = req.params.id;
      var tipo = req.body.tipo;

      Usuario.findByIdAndUpdate(id, 
        {
          tipo: tipo
        }, function (error, resultado) {
          if (error){
              res.status(400).json({estado:400, mensaje:"Error editando usuario"});
          } else {
              res.json({estado:200, mensaje:"Usuario editado"});
          }
      });

    }

  } catch (error) {
    res.status(400).json({estado:400, mensaje:error.message});
  }

});

router.delete("/:id", function (req, res) {
  var id = req.params.id;

  Usuario.findByIdAndRemove(id, function (error) {
    if (error){
      res.status(400).json({estado:400, mensaje:"Error borrando usuario"});
    } else {
      res.json({estado: 200, mensaje: "Usuario borrado"});
    }
  });

});

module.exports = router;