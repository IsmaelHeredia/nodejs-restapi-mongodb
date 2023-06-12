var express = require("express");
var helper = require("../funciones/helper.js");
var router = express.Router();

const Usuario = require("../modelos/usuario.model");

router.post("/cambiarUsuario", async (req,res) => {

  try {

    if(helper.estaVacio(req.body.id))
    {
      res.status(400).json({estado:400, mensaje:"Falta el ID"});
    }
    else if(helper.estaVacio(req.body.nombre))
    {
      res.status(400).json({estado:400, mensaje:"Falta el nombre"});
    }
    else 
    {
      var id = req.body.id;
      var nombre = req.body.nombre;

      Usuario.countDocuments({ $and: [ { _id: { $ne: id } }, {nombre: nombre} ] }, function (err, cantidad){

        if(cantidad > 0) 
        {
            res.status(400).json({estado:400, mensaje:"El usuario " + nombre + " ya existe"});
        } 
        else 
        {
            Usuario.findByIdAndUpdate(id, 
            {
                nombre: nombre
            }, function (error, resultado) {
                if (error){
                    res.status(400).json({estado:400, mensaje:"Error editando usuario"});
                } else {
                    res.json({estado:200, mensaje:"Usuario editado"});
                }
            });
        }

      });
      
    }

  } catch (error) {
    res.status(400).json({estado:400, mensaje:error.message});
  }

});

router.post("/cambiarClave", async (req,res) => {

    try {
  
      if(helper.estaVacio(req.body.id))
      {
        res.status(400).json({estado:400, mensaje:"Falta el ID"});
      }
      else if(helper.estaVacio(req.body.clave))
      {
        res.status(400).json({estado:400, mensaje:"Falta la clave"});
      }
      else 
      {
        var id = req.body.id;
        var clave = helper.codificarClave(req.body.clave);
  
        Usuario.findByIdAndUpdate(id, 
            {
              clave: clave
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

module.exports = router;