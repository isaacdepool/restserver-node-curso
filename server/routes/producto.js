const express = require('express');
const app = express();

const { verificarToken } = require('../middlewares/auth');
const Producto = require('../models/producto');
// const Categoria = require('../models/categoria');

const _ = require('underscore');
const producto = require('../models/producto');

app.post('/producto', verificarToken, (req, res) =>{

    let body = req.body; 

    let producto = new Producto({

        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
        
    });

    producto.save( (err, productoDB)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productoDB
        });

    });

});

app.get('/producto', verificarToken, (req, res) =>{

    let skip = req.query.skip || 0;
    skip = Number(skip);
    let limit = req.query.limit || 5;
    limit = Number(limit);

    Producto.find({disponible: true})
        .skip(skip)
        .limit(limit)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec( (err, productoDB) =>{
           
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
    
            if(!productoDB){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoDB
            });

        });
});

app.get('/producto/:id', verificarToken, (req, res) =>{

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) =>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productoDB
        });

    });
});

// ============================
//     Buscar producto
// ============================
app.get('/producto/buscar/:termino', verificarToken, (req, res) =>{

    let termino = req.params.termino;
    let regexp = RegExp(termino, 'i');

    Producto.find({ nombre: regexp })
    .populate('producto', 'nombre')
    .exec((err, productoDB)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productoDB
        });
    });
});

app.put('/producto/:id', verificarToken, (req, res) =>{

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion']);

    Producto.findOneAndUpdate(id, body, 
        {new: true, runValidators: true, context: 'query'}, 
            (err, productoDB) =>{

                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
        
                if(!productoDB){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
            
            res.json({
                ok: true,
                productoDB
            });    

            });
});

app.delete('/producto/:id', verificarToken, (req, res) =>{

    let id = req.params.id;
    let disponible = _.pick({disponible: false}, ['disponible']);

    Producto.findByIdAndUpdate(id, disponible, 
        {new: true, runValidators: true, context: true},
        (err, productoDB) =>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }
    
    res.json({
        ok: true,
        productoDB
    });    

    });
});


module.exports = app;
