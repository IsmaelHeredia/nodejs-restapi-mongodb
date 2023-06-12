var express = require("express");
var helper = require("../funciones/helper.js");
var router = express.Router();

const TipoUsuario = require("../modelos/tipousuario.model");

router.get("/", function (req, res) {

  TipoUsuario.find({}, function (error, resultado) {
    if (error){
        res.status(400).json({estado:400, mensaje:"Error listando tipos de usuarios"});
    } else {
        res.json({estado:200, "tiposusuarios":resultado});
    }
  });

});

router.get("/:id", function (req, res) {
  var id = req.params.id;

  TipoUsuario.find({_id: id}, function (error, resultado) {
    if (error){
        res.status(400).json({estado:400, mensaje:"Error cargando tipo de usuario"});
    } else {
        res.json({estado:200, "tipousuario":resultado});
    }
  });

});

router.post("/", async (req,res) => {

  try {

    if(helper.estaVacio(req.body.nombre))
    {
      res.status(400).json({estado:400, mensaje:"Falta el nombre"});
    } 
    else 
    {
      var nombre = req.body.nombre;

      var tipousuario = new TipoUsuario(
        {
          nombre: nombre
        }
      );
      
      TipoUsuario.countDocuments({nombre: nombre}, function (err, cantidad){

        if(cantidad > 0) 
        {
          res.status(400).json({estado:400, mensaje:"El tipo de usuario con el nombre " + nombre + " ya existe"});
        } 
        else 
        {
          tipousuario.save(function (error) {
            if (error){
                res.status(400).json({estado:400, mensaje:"Error agregando tipo de usuario"});
            } else {
                res.json({estado:200, mensaje:"Tipo de usuario creado"});
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
    else if(helper.estaVacio(req.body.nombre))
    {
      res.status(400).json({estado:400, mensaje:"Falta el nombre"});
    } 
    else 
    {
      var id = req.params.id;
      var nombre = req.body.nombre;

      TipoUsuario.countDocuments({ $and: [ { _id: { $ne: id } }, {nombre: nombre} ] }, function (err, cantidad){

        if(cantidad > 0) 
        {
          res.status(400).json({estado:400, mensaje:"El tipo de usuario " + nombre + " ya existe"});
        } 
        else 
        {
          TipoUsuario.findByIdAndUpdate(id, 
          {
            nombre: nombre
          }, function (error, resultado) {
            if (error){
                res.status(400).json({estado:400, mensaje:"Error editando tipo de usuario"});
            } else {
                res.json({estado:200, mensaje:"Tipo de usuario editado"});
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

  TipoUsuario.findByIdAndRemove(id, function (error) {
    if (error){
      res.status(400).json({estado:400, mensaje:"Error borrando tipo de usuario"});
    } else {
      res.json({estado: 200, mensaje: "Tipo de usuario borrado"});
    }
  });

});

module.exports = router;