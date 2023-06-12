var express = require("express");
var helper = require("../funciones/helper.js");
var router = express.Router();

const Usuario = require("../modelos/usuario.model");

var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

require("dotenv").config();

router.post("/", function (req, res) {

  if(helper.estaVacio(req.body.nombre))
  {
    res.status(400).json({estado:400, mensaje:"Falta el nombre"});
  }
  else if(helper.estaVacio(req.body.clave)) 
  {
    res.status(400).json({estado:400, mensaje:"Falta la clave"});
  }
  else 
  {
    var nombre = req.body.nombre;
    var clave = req.body.clave;

    Usuario.findOne({"nombre":nombre}, function(error, resultado) {
      if (error){
          res.status(400).json({estado:400, mensaje:"Error verificando los datos"});
      } else {
          if(resultado != null && resultado != "") {

            var id = String(resultado["_id"]);
            var clave_bd = resultado["clave"];
            var tipo = resultado["tipo"];

            if(bcrypt.compareSync(clave, clave_bd)) {
              const payload = {
                id:  id,
                usuario: nombre,
                tipo : tipo
              };
              const token = jwt.sign(payload, process.env.CLAVE_JWT, {
                expiresIn: "365d"
              });
              res.json({estado:200,"token":token});
            } else {
              res.json({estado:200, mensaje:"Datos incorrectos"});
            }

          } else {
            res.json({estado:200, mensaje:"Datos incorrectos"});
          }
        }
    });

  }

});

router.post("/validar", function (req, res) {
  var token = req.body.token;
  if (token) {
    jwt.verify(token, process.env.CLAVE_JWT, (err, decoded) => {      
      if (err) {
        return res.status(400).json({estado: 400, mensaje: "Token inválida" });    
      } else {
        res.json({estado:200,"token":decoded});
      }
    });
  } else {
    res.status(400).json({estado:400, mensaje: "Necesita enviar token"});
  }
});

module.exports = router;