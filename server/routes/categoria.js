const express = require('express'); 

let {verificarToken, verificarAdmin_Role} = require('../middlewares/auth');
const categoria = require('../models/categoria');

let app = express();

let Categoria = require('../models/categoria');
const Usuario = require('../models/usuario');

const _ = require('underscore');

// ==================================
//     Crear categorias 
// ==================================

app.post('/categoria', verificarToken, (req, res) =>{

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save( (err, categoriaDB) =>{

        if(err){
            return res.status(500).json({
                 ok: false,
                 err
             });
         }

         if(!categoriaDB){
            return res.status(400).json({
                 ok: false,
                 err
             });
         }

         res.json({
             ok: true,
             categoriaDB
         });

    }); 


});

// ==================================
//     Mostrar todas las categorias 
// ==================================

app.get('/categoria', verificarToken, (req, res) =>{

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) =>{

        if(err){
           return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categorias){
            return res.status(400).json({
                 ok: false,
                 err: {
                     message: 'Sin categorias'
                 }
             });
         }

        res.json({
            ok: true,
            categorias
        });

    });
});

// =========================================
//     Mostrar todas las categorias por id  
// =========================================

app.get('/categoria/:id', verificarToken, (req, res) =>{

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) =>{

        if(err){
            return res.status(500).json({
                 ok: false,
                 err
             });
         }

         if(err){
            return res.status(400).json({
                 ok: false,
                 err
             });
         }
 
         res.json({
             ok: true,
             categoriaDB
         });

    });
});

// =========================================
//     Actualizar categorias por id  
// =========================================

app.put('/categoria/:id', [verificarToken, verificarAdmin_Role], (req, res) =>{

    let id = req.params.id;
    let body = req.body;

    let desCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findOneAndUpdate(id, desCategoria, {new: true, runValidators: true, context: 'query'}, (err, categoriaDB) =>{
            if(err){
                return res.status(500).json({
                     ok: false,
                     err
                 });
             }

            //  if(!categoriaDB){
            //     return res.status(400).json({
            //          ok: false,
            //          err
            //      });
            //  }

     
             res.json({
                 ok: true,
                 categoriaDB
             });


    });
});

app.delete('/categoria/:id', [verificarToken, verificarAdmin_Role], (req, res) =>{

    id = req.params.id;

    Categoria.findByIdAndDelete( id, (err, UsuarioBorrado) =>{

        if(err){
            return res.status(400).json({
                 ok: false,
                 err
             });
         }
 
         res.json({
             ok: true,
             UsuarioBorrado
         });
    });
})


module.exports = app;